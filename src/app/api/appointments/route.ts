import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        treatment: true,
      },
      orderBy: { dateTime: 'asc' },
    });

    const formatted = appointments.map((apt) => ({
      id: apt.id,
      patientId: apt.patientId,
      patientName: apt.patient.fullName,
      patientPhone: apt.patient.phone,
      treatmentId: apt.treatmentId,
      treatmentName: apt.treatment.name,
      treatmentColor: apt.treatment.color,
      dateTime: apt.dateTime.toISOString(),
      durationMins: apt.durationMins,
      price: apt.price,
      deposit: apt.deposit,
      status: apt.status,
      notes: apt.notes,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      patientName,
      patientPhone,
      treatmentId,
      dateTime,
      durationMins = 60,
      price,
      deposit = 0,
      status = 'Pendiente',
      notes,
    } = body;

    // Find or create patient
    let patient = await prisma.patient.findFirst({
      where: {
        OR: [
          { fullName: { equals: patientName, mode: 'insensitive' } },
          { phone: patientPhone },
        ],
      },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          fullName: patientName || 'PACIENTE GENERAL',
          cedula: `CED-${Date.now().toString().slice(-6)}`,
          email: `paciente_${Date.now().toString().slice(-4)}@ejemplo.com`,
          phone: patientPhone || '+506 8888-0000',
          whatsapp: patientPhone ? patientPhone.replace(/\D/g, '') : '50688880000',
        },
      });
    }

    // Ensure treatment exists
    let treatment = await prisma.treatment.findUnique({
      where: { id: treatmentId },
    });

    if (!treatment) {
      treatment = await prisma.treatment.findFirst();
      if (!treatment) {
        treatment = await prisma.treatment.create({
          data: {
            name: 'Servicio Estético',
            category: 'General',
            price: Number(price) || 35000,
          },
        });
      }
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        treatmentId: treatment.id,
        dateTime: new Date(dateTime),
        durationMins: Number(durationMins),
        price: Number(price),
        deposit: Number(deposit),
        status,
        notes,
      },
      include: {
        patient: true,
        treatment: true,
      },
    });

    const formatted = {
      id: newAppointment.id,
      patientId: newAppointment.patientId,
      patientName: newAppointment.patient.fullName,
      patientPhone: newAppointment.patient.phone,
      treatmentId: newAppointment.treatmentId,
      treatmentName: newAppointment.treatment.name,
      treatmentColor: newAppointment.treatment.color,
      dateTime: newAppointment.dateTime.toISOString(),
      durationMins: newAppointment.durationMins,
      price: newAppointment.price,
      deposit: newAppointment.deposit,
      status: newAppointment.status,
      notes: newAppointment.notes,
    };

    return NextResponse.json({ success: true, data: formatted }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error agendando cita en la BD' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, patientName, patientPhone, treatmentId, dateTime, durationMins, price, deposit, status, notes } = body;

    const existing = await prisma.appointment.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Cita no encontrada' }, { status: 404 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        dateTime: dateTime ? new Date(dateTime) : existing.dateTime,
        durationMins: durationMins !== undefined ? Number(durationMins) : existing.durationMins,
        price: price !== undefined ? Number(price) : existing.price,
        deposit: deposit !== undefined ? Number(deposit) : existing.deposit,
        status: status || existing.status,
        notes: notes !== undefined ? notes : existing.notes,
        treatmentId: treatmentId || existing.treatmentId,
      },
      include: {
        patient: true,
        treatment: true,
      },
    });

    const formatted = {
      id: updated.id,
      patientId: updated.patientId,
      patientName: updated.patient.fullName,
      patientPhone: updated.patient.phone,
      treatmentId: updated.treatmentId,
      treatmentName: updated.treatment.name,
      treatmentColor: updated.treatment.color,
      dateTime: updated.dateTime.toISOString(),
      durationMins: updated.durationMins,
      price: updated.price,
      deposit: updated.deposit,
      status: updated.status,
      notes: updated.notes,
    };

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error actualizando cita en la BD' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });
    }

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error eliminando cita de la BD' }, { status: 500 });
  }
}
