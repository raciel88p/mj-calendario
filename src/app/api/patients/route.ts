import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error obteniendo pacientes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const patient = await prisma.patient.create({
      data: {
        fullName: body.fullName,
        cedula: body.cedula,
        email: body.email,
        phone: body.phone,
        whatsapp: body.whatsapp || body.phone,
        residence: body.residence || null,
        allergies: body.allergies || null,
        notes: body.notes || null,
        consent: body.consent !== undefined ? body.consent : true,
        hasMembership: body.hasMembership || false,
        creditEnabled: body.creditEnabled || false,
        crmStage: body.crmStage || 'Nuevo Lead',
      },
    });

    return NextResponse.json({ success: true, data: patient }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error guardando paciente en BD' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const patient = await prisma.patient.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: patient });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error actualizando paciente' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });
    }

    await prisma.patient.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error eliminando paciente' }, { status: 500 });
  }
}
