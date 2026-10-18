import { NextResponse } from 'next/server';

let invoicesMemory = [
  {
    id: 'inv-874',
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
    id: 'inv-873',
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
    id: 'inv-872',
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
  return NextResponse.json({ success: true, data: invoicesMemory });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newDocNum = (Number(invoicesMemory[0]?.docNumber || 874) + 1).toString();

    const newInvoice = {
      id: `inv-${newDocNum}`,
      docNumber: newDocNum,
      docType: body.docType || 'Factura electrónica',
      patientName: body.patientName || 'CLIENTE GENERAL',
      cedula: body.cedula || '1-0000-0000',
      email: body.email || 'cliente@ejemplo.com',
      phone: body.phone || '+506 8888-8888',
      date: '18 OCT. 2026',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentStatus: body.balancePending === 0 ? 'Pagada' : 'Por Pagar',
      haciendaStatus: 'Aceptado',
      emailSent: true,
      totalAmount: Number(body.totalAmount) || 0,
      balancePending: Number(body.balancePending) || 0,
      paymentMethod: body.paymentMethod || 'SINPE Móvil',
      serviceName: body.serviceName || 'Tratamiento Estético',
    };

    invoicesMemory.unshift(newInvoice);
    return NextResponse.json({ success: true, data: newInvoice }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error procesando la factura' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, abonoAmount } = body;

    invoicesMemory = invoicesMemory.map((inv) => {
      if (inv.id === id) {
        const newPending = Math.max(0, inv.balancePending - Number(abonoAmount));
        return {
          ...inv,
          balancePending: newPending,
          paymentStatus: newPending === 0 ? 'Pagada' : 'Por Pagar',
        };
      }
      return inv;
    });

    return NextResponse.json({ success: true, data: invoicesMemory });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error registrando el abono' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de factura requerido' }, { status: 400 });
    }

    invoicesMemory = invoicesMemory.filter((inv) => inv.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al eliminar la factura' }, { status: 500 });
  }
}
