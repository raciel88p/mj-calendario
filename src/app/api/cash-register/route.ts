import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    let register = await prisma.cashRegister.findFirst({
      where: { status: 'Abierto' },
      orderBy: { openedAt: 'desc' },
    });

    if (!register) {
      register = await prisma.cashRegister.findFirst({
        orderBy: { openedAt: 'desc' },
      });
    }

    return NextResponse.json({ success: true, data: register });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al consultar la caja chica' }, { status: 500 });
  }
}

// Open or close cash register
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, initialBalance, notes, efectivoSales, sinpeSales, tarjetaSales } = body;

    if (action === 'OPEN') {
      const activeRegister = await prisma.cashRegister.findFirst({
        where: { status: 'Abierto' },
      });

      if (activeRegister) {
        return NextResponse.json({ success: false, error: 'Ya existe una caja abierta.' }, { status: 400 });
      }

      const newRegister = await prisma.cashRegister.create({
        data: {
          initialBalance: Number(initialBalance) || 50000,
          status: 'Abierto',
          notes: notes || 'Apertura de caja diaria',
        },
      });

      return NextResponse.json({ success: true, data: newRegister }, { status: 201 });
    }

    if (action === 'CLOSE') {
      const activeRegister = await prisma.cashRegister.findFirst({
        where: { status: 'Abierto' },
      });

      if (!activeRegister) {
        return NextResponse.json({ success: false, error: 'No hay ninguna caja abierta para cerrar.' }, { status: 400 });
      }

      const closedRegister = await prisma.cashRegister.update({
        where: { id: activeRegister.id },
        data: {
          closedAt: new Date(),
          status: 'Cerrado',
          efectivoSales: Number(efectivoSales) || 0,
          sinpeSales: Number(sinpeSales) || 0,
          tarjetaSales: Number(tarjetaSales) || 0,
          notes: notes || 'Cierre de caja efectuado',
        },
      });

      return NextResponse.json({ success: true, data: closedRegister });
    }

    return NextResponse.json({ success: false, error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error procesando la caja' }, { status: 500 });
  }
}
