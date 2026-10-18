import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    if (patientId) {
      const patientPackages = await prisma.patientPackage.findMany({
        where: { patientId },
        include: {
          package: { include: { treatment: true } },
          usages: { orderBy: { usedAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ success: true, data: patientPackages });
    }

    const packages = await prisma.package.findMany({
      where: { active: true },
      include: { treatment: true },
    });

    return NextResponse.json({ success: true, data: packages });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error cargando paquetes' }, { status: 500 });
  }
}

// Purchase package for patient
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, packageId, price, totalSessions } = body;

    const patientPackage = await prisma.patientPackage.create({
      data: {
        patientId,
        packageId,
        totalSessions: Number(totalSessions),
        remainingSessions: Number(totalSessions),
        price: Number(price),
        status: 'Activo',
      },
      include: {
        package: { include: { treatment: true } },
      },
    });

    return NextResponse.json({ success: true, data: patientPackage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al procesar la compra del paquete' }, { status: 500 });
  }
}

// Transactional Session Deduction
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { patientPackageId, notes } = body;

    const result = await prisma.$transaction(async (tx) => {
      const pkg = await tx.patientPackage.findUnique({
        where: { id: patientPackageId },
      });

      if (!pkg) {
        throw new Error('Paquete no encontrado');
      }

      if (pkg.remainingSessions <= 0 || pkg.status !== 'Activo') {
        throw new Error('El paquete ya no tiene sesiones disponibles.');
      }

      const newRemaining = pkg.remainingSessions - 1;
      const newStatus = newRemaining === 0 ? 'Agotado' : 'Activo';

      const updatedPackage = await tx.patientPackage.update({
        where: { id: patientPackageId },
        data: {
          remainingSessions: newRemaining,
          status: newStatus,
        },
      });

      const usage = await tx.packageUsage.create({
        data: {
          patientPackageId,
          notes: notes || 'Sesión consumida en cita',
        },
      });

      return { updatedPackage, usage };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error descontando la sesión' }, { status: 400 });
  }
}
