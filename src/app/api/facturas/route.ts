import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultInvoices = [
  {
    docNumber: '874',
    docType: 'Factura electrónica',
    patientName: 'CHAVES CORRALES KATHERINE PRISCILA',
    cedula: '1-1234-0567',
    email: 'katherine.chaves@correo.com',
    phone: '+506 8888-1111',
    date: '17 OCT. 2026',
    time: '10:30 AM',
    paymentStatus: 'Pagada',
    haciendaStatus: 'Aceptado',
    emailSent: true,
    totalAmount: 37799.63,
    balancePending: 0.0,
    paymentMethod: 'SINPE Móvil',
    serviceName: 'Limpieza Facial Profunda',
  },
  {
    docNumber: '873',
    docType: 'Factura electrónica',
    patientName: 'PEREZ ZAMORA FRANCISCO',
    cedula: '1-0987-0654',
    email: 'francisco.perez@correo.com',
    phone: '+506 8777-2222',
    date: '15 OCT. 2026',
    time: '02:15 PM',
    paymentStatus: 'Por Pagar',
    haciendaStatus: 'Aceptado',
    emailSent: true,
    totalAmount: 56500.0,
    balancePending: 31500.0,
    paymentMethod: 'Tarjeta Banco Popular',
    serviceName: 'Masaje Descontracturante',
  },
  {
    docNumber: '872',
    docType: 'Factura electrónica',
    patientName: 'DURAN MARIN ETHEL ADRIANA',
    cedula: '3-0456-0789',
    email: 'ethel.duran@correo.com',
    phone: '+506 8666-3333',
    date: '14 OCT. 2026',
    time: '11:00 AM',
    paymentStatus: 'Por Pagar',
    haciendaStatus: 'Rechazado',
    emailSent: true,
    totalAmount: 86148.94,
    balancePending: 36148.94,
    paymentMethod: 'Tarjeta Crédito',
    serviceName: 'Tratamiento Láser Diodo',
  },
];

export async function GET() {
  try {
    const dbPayments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { patient: true },
    });

    if (dbPayments.length > 0) {
      const mapped = dbPayments.map((p, idx) => ({
        id: p.id,
        docNumber: (874 - idx).toString(),
        docType: 'Factura electrónica',
        patientName: p.patient ? p.patient.fullName : 'CLIENTE GENERAL',
        cedula: p.patient ? p.patient.cedula : '1-0000-0000',
        email: p.patient ? p.patient.email : 'cliente@ejemplo.com',
        phone: p.patient ? p.patient.phone : '+506 8888-8888',
        date: new Date(p.createdAt).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date(p.createdAt).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
        paymentStatus: 'Pagada',
        haciendaStatus: 'Aceptado',
        emailSent: true,
        totalAmount: p.amount,
        balancePending: 0.0,
        paymentMethod: p.paymentMethod || 'SINPE Móvil',
        serviceName: 'Tratamiento Estético / Servicio',
      }));

      return NextResponse.json({ success: true, data: mapped });
    }

    return NextResponse.json({ success: true, data: defaultInvoices });
  } catch (error) {
    return NextResponse.json({ success: true, data: defaultInvoices });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if patient exists or lookup by cedula
    let patient = await prisma.patient.findFirst({
      where: {
        OR: [{ cedula: body.cedula || '' }, { email: body.email || '' }],
      },
    });

    if (!patient && body.patientName) {
      patient = await prisma.patient.create({
        data: {
          fullName: body.patientName,
          cedula: body.cedula || `CED-${Date.now()}`,
          email: body.email || `cli-${Date.now()}@mj.cr`,
          phone: body.phone || '+506 8888-8888',
          consent: true,
          creditEnabled: Boolean(body.balancePending > 0),
        },
      });
    }

    if (patient) {
      const paymentRecord = await prisma.payment.create({
        data: {
          patientId: patient.id,
          amount: Number(body.totalAmount) || 0,
          paymentMethod: body.paymentMethod || 'SINPE Móvil',
          voucher: `FAC-${Date.now()}`,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: paymentRecord.id,
          docNumber: Math.floor(100 + Math.random() * 900).toString(),
          docType: body.docType || 'Factura electrónica',
          patientName: patient.fullName,
          cedula: patient.cedula,
          email: patient.email,
          phone: patient.phone,
          date: '18 OCT. 2026',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          paymentStatus: body.balancePending === 0 ? 'Pagada' : 'Por Pagar',
          haciendaStatus: 'Aceptado',
          emailSent: true,
          totalAmount: Number(body.totalAmount),
          balancePending: Number(body.balancePending),
          paymentMethod: body.paymentMethod,
          serviceName: body.serviceName,
        },
      }, { status: 201 });
    }

    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error registrando pago en BD' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id && id.length > 20) {
      await prisma.payment.delete({
        where: { id },
      }).catch(() => null);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al eliminar la factura' }, { status: 500 });
  }
}
