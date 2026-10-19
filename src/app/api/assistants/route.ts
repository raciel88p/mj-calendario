import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

const defaultAssistants: any[] = [];

export async function GET() {
  try {
    const assistants = await prisma.assistantGoal.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: assistants });
  } catch (error) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // BATCH UPDATE/SYNC SUPPORT
    if (body.batch && Array.isArray(body.batch)) {
      const createdBatch = await Promise.all(
        body.batch.map(async (item: any) => {
          let existing = null;

          if (item.id && !item.id.startsWith('asist-')) {
            existing = await prisma.assistantGoal.findUnique({ where: { id: item.id } });
          }

          if (!existing && item.name) {
            existing = await prisma.assistantGoal.findFirst({
              where: { name: { equals: item.name, mode: 'insensitive' } },
            });
          }

          if (existing) {
            return prisma.assistantGoal.update({
              where: { id: existing.id },
              data: {
                name: item.name || existing.name,
                role: item.role || existing.role,
                monthlyTarget: item.monthlyTarget !== undefined ? Number(item.monthlyTarget) : existing.monthlyTarget,
                currentSales: item.currentSales !== undefined ? Number(item.currentSales) : existing.currentSales,
                efficiency: item.efficiency !== undefined ? Number(item.efficiency) : existing.efficiency,
              },
            });
          }

          return prisma.assistantGoal.create({
            data: {
              name: item.name || 'Asistente',
              role: item.role || 'Asistente Clínico',
              monthlyTarget: Number(item.monthlyTarget) || 1500000,
              currentSales: Number(item.currentSales) || 0,
              efficiency: Number(item.efficiency) || 90,
            },
          });
        })
      );

      return NextResponse.json({ success: true, data: createdBatch });
    }

    // SINGLE CREATE
    const newAssistant = await prisma.assistantGoal.create({
      data: {
        name: body.name || 'Nueva Asistente',
        role: body.role || 'Asistente Clínico',
        monthlyTarget: Number(body.monthlyTarget) || 1500000,
        currentSales: Number(body.currentSales) || 0,
        efficiency: Number(body.efficiency) || 90,
      },
    });

    return NextResponse.json({ success: true, data: newAssistant }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error procesando asistentes en la BD' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, role, monthlyTarget, currentSales, efficiency } = body;

    // Check if assistant exists in DB before updating
    const existing = await prisma.assistantGoal.findUnique({ where: { id } });

    let updated;
    if (existing) {
      updated = await prisma.assistantGoal.update({
        where: { id },
        data: {
          name: name || existing.name,
          role: role || existing.role,
          monthlyTarget: monthlyTarget !== undefined ? Number(monthlyTarget) : existing.monthlyTarget,
          currentSales: currentSales !== undefined ? Number(currentSales) : existing.currentSales,
          efficiency: efficiency !== undefined ? Number(efficiency) : existing.efficiency,
        },
      });
    } else {
      // Upsert: Create if ID not found in database
      updated = await prisma.assistantGoal.create({
        data: {
          name: name || 'Asistente',
          role: role || 'Asistente Clínico',
          monthlyTarget: Number(monthlyTarget) || 1500000,
          currentSales: Number(currentSales) || 0,
          efficiency: Number(efficiency) || 90,
        },
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error actualizando asistente en la BD' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });
    }

    try {
      await prisma.assistantGoal.delete({
        where: { id },
      });
    } catch (dbErr) {
      // Ignorar si ya fue borrado
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error eliminando asistente' }, { status: 500 });
  }
}
