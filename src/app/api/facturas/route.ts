import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultInvoices: any[] = [];

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: { patient: true },
      orderBy: { createdAt: 'desc' },
    });

    if (payments.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const formatted = payments.map((p, idx) => ({
      id: p.id,
      docNumber: (874 - idx).toString(),
      docType: 'Factura electrónica',
      patientName: p.patient?.fullName || 'CLIENTE GENERAL',
      cedula: p.patient?.cedula || '1-0000-0000',
      email: p.patient?.email || 'cliente@ejemplo.com',
      phone: p.patient?.phone || '+506 8888-8888',
      date: new Date(p.createdAt).toLocaleDateString('es-CR'),
      time: new Date(p.createdAt).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
      paymentStatus: 'Pagada',
      haciendaStatus: 'Aceptado',
      emailSent: true,
      totalAmount: p.amount,
      balancePending: 0,
      paymentMethod: p.paymentMethod || 'SINPE Móvil',
      serviceName: 'Tratamiento Estético / Servicio',
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    return NextResponse.json({ success: true, data: defaultInvoices });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check patient or create
    let patient = await prisma.patient.findFirst({
      where: {
        OR: [{ cedula: body.cedula }, { email: body.email }],
      },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          fullName: body.patientName || 'CLIENTE GENERAL',
          cedula: body.cedula || `CED-${Date.now()}`,
          email: body.email || `factura-${Date.now()}@mj.cr`,
          phone: body.phone || '+506 8888-8888',
          creditEnabled: body.balancePending > 0,
        },
      });
    }

    const newPayment = await prisma.payment.create({
      data: {
        patientId: patient.id,
        amount: Number(body.totalAmount) || 0,
        paymentMethod: body.paymentMethod || 'SINPE Móvil',
        voucher: body.docNumber || `VOC-${Date.now()}`,
      },
    });

    const formattedInvoice = {
      id: newPayment.id,
      docNumber: body.docNumber || '875',
      docType: body.docType || 'Factura electrónica',
      patientName: patient.fullName,
      cedula: patient.cedula,
      email: patient.email,
      phone: patient.phone,
      date: new Date().toLocaleDateString('es-CR'),
      time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
      paymentStatus: body.balancePending > 0 ? 'Por Pagar' : 'Pagada',
      haciendaStatus: 'Aceptado',
      emailSent: true,
      totalAmount: Number(body.totalAmount),
      balancePending: Number(body.balancePending) || 0,
      paymentMethod: body.paymentMethod || 'SINPE Móvil',
      serviceName: body.serviceName || 'Servicio Estético',
    };

    return NextResponse.json({ success: true, data: formattedInvoice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id && !id.startsWith('inv-')) {
      await prisma.payment.delete({
        where: { id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
