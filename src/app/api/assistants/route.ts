import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultAssistants = [
  { name: 'Sofía Monge', role: 'Asistente Principal', monthlyTarget: 1500000, currentSales: 1250000, efficiency: 94 },
  { name: 'Valeria Rojas', role: 'Asistente Cabina 1', monthlyTarget: 1200000, currentSales: 980000, efficiency: 88 },
  { name: 'Daniela Castro', role: 'Asistente Cabina 2', monthlyTarget: 1200000, currentSales: 1100000, efficiency: 92 },
  { name: 'Camila Mora', role: 'Especialista Facial', monthlyTarget: 1800000, currentSales: 1650000, efficiency: 96 },
  { name: 'Mariana Solís', role: 'Especialista Corporal', monthlyTarget: 1600000, currentSales: 1400000, efficiency: 90 },
  { name: 'Lucía Vargas', role: 'Recepcionista & Ventas', monthlyTarget: 2000000, currentSales: 1850000, efficiency: 95 },
];

export async function GET() {
  try {
    let assistants = await prisma.assistantGoal.findMany({
      orderBy: { createdAt: 'asc' },
    });

    if (assistants.length === 0) {
      await prisma.assistantGoal.createMany({
        data: defaultAssistants,
      });
      assistants = await prisma.assistantGoal.findMany({
        orderBy: { createdAt: 'asc' },
      });
    }

    return NextResponse.json({ success: true, data: assistants });
  } catch (error) {
    return NextResponse.json({ success: true, data: defaultAssistants });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newAssistant = await prisma.assistantGoal.create({
      data: {
        name: body.name,
        role: body.role || 'Asistente Clínico',
        monthlyTarget: Number(body.monthlyTarget) || 1500000,
        currentSales: Number(body.currentSales) || 0,
        efficiency: Number(body.efficiency) || 90,
      },
    });

    return NextResponse.json({ success: true, data: newAssistant }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error creando asistente' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const updated = await prisma.assistantGoal.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        monthlyTarget: Number(data.monthlyTarget),
        currentSales: Number(data.currentSales),
        efficiency: Number(data.efficiency),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error actualizando asistente' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });
    }

    await prisma.assistantGoal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error eliminando asistente' }, { status: 500 });
  }
}
