import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultDeals = [
  {
    title: 'Paquete Facial Hidratante + Colágeno',
    patientName: 'MARÍA GONZÁLEZ PÉREZ',
    cedula: '1-1111-0111',
    email: 'maria.gonzalez@example.com',
    phone: '+506 8888-1111',
    whatsapp: '50688881111',
    value: 45000,
    stage: 'Cliente Fidelizado',
    owner: 'Dra. María José',
    channel: 'WhatsApp',
    hasMembership: true,
  },
  {
    title: 'Tratamiento Masaje Descontracturante',
    patientName: 'CARLA RODRÍGUEZ MONGE',
    cedula: '1-2222-0222',
    email: 'carla.rodriguez@example.com',
    phone: '+506 8888-2222',
    whatsapp: '50688882222',
    value: 35000,
    stage: 'Cita Agendada',
    owner: 'Recepción Estética',
    channel: 'Instagram',
    hasMembership: false,
  },
  {
    title: 'Sesión Depilación Láser Diodo',
    patientName: 'FERNANDA LÓPEZ SÁNCHEZ',
    cedula: '1-3333-0333',
    email: 'fernanda.lopez@example.com',
    phone: '+506 8888-3333',
    whatsapp: '50688883333',
    value: 50000,
    stage: 'Nuevo Lead',
    owner: 'Dra. María José',
    channel: 'Formulario Web',
    hasMembership: true,
  },
];

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const deals = patients.map((p) => ({
      id: p.id,
      title: p.notes || `Servicio / Negocio Estético - ${p.fullName}`,
      patientName: p.fullName,
      cedula: p.cedula,
      email: p.email,
      phone: p.phone,
      whatsapp: p.whatsapp || p.phone,
      value: 45000,
      stage: p.crmStage || 'Nuevo Lead',
      owner: 'Dra. María José',
      closeDate: '2026-11-30',
      channel: 'Formulario Web',
      hasMembership: p.hasMembership,
    }));

    if (deals.length === 0) {
      return NextResponse.json({
        success: true,
        data: defaultDeals.map((d, i) => ({ id: `deal-${i + 1}`, ...d })),
      });
    }

    return NextResponse.json({ success: true, data: deals });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: defaultDeals.map((d, i) => ({ id: `deal-${i + 1}`, ...d })),
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const patient = await prisma.patient.create({
      data: {
        fullName: body.patientName || 'NUEVO CLIENTE CRM',
        cedula: body.cedula || `CED-${Date.now()}`,
        email: body.email || `lead-${Date.now()}@mj.cr`,
        phone: body.phone || '+506 8888-0000',
        whatsapp: body.whatsapp || body.phone || '50688880000',
        crmStage: body.stage || 'Nuevo Lead',
        hasMembership: body.hasMembership || false,
        notes: body.title || 'Negocio Estético',
      },
    });

    const newDeal = {
      id: patient.id,
      title: body.title || 'Nuevo Negocio Estético',
      patientName: patient.fullName,
      cedula: patient.cedula,
      email: patient.email,
      phone: patient.phone,
      whatsapp: patient.whatsapp,
      value: Number(body.value) || 45000,
      stage: patient.crmStage,
      owner: body.owner || 'Dra. María José',
      channel: body.channel || 'Formulario Web',
      hasMembership: patient.hasMembership,
    };

    return NextResponse.json({ success: true, data: newDeal }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, stage, title, value } = body;

    if (id && !id.startsWith('deal-')) {
      await prisma.patient.update({
        where: { id },
        data: {
          crmStage: stage,
        },
      });
    }

    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
