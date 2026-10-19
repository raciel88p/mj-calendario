import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultTreatments = [
  { name: 'Limpieza Facial Profunda', category: 'Faciales', durationMins: 60, price: 35000, color: '#3B82F6' },
  { name: 'Masaje Relajante Descontracturante', category: 'Masajes', durationMins: 60, price: 35000, color: '#10B981' },
  { name: 'Depilación Láser Diodo', category: 'Láser', durationMins: 45, price: 45000, color: '#8B5CF6' },
  { name: 'Depilación con Cera Sensible', category: 'Depilación', durationMins: 30, price: 25000, color: '#EC4899' },
  { name: 'Masaje Reductivo Corporal', category: 'Corporales', durationMins: 60, price: 38000, color: '#F59E0B' },
];

export async function GET() {
  try {
    let treatments = await prisma.treatment.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
    });

    if (treatments.length === 0) {
      await prisma.treatment.createMany({
        data: defaultTreatments,
      });
      treatments = await prisma.treatment.findMany({
        where: { active: true },
        orderBy: { createdAt: 'asc' },
      });
    }

    return NextResponse.json({ success: true, data: treatments });
  } catch (error) {
    return NextResponse.json({ success: true, data: defaultTreatments });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const treatment = await prisma.treatment.create({
      data: {
        name: body.name || 'Nuevo Servicio',
        category: body.category || 'Faciales',
        durationMins: Number(body.durationMins) || 60,
        price: Number(body.price) || 35000,
        color: body.color || '#3B82F6',
        description: body.description || null,
      },
    });

    return NextResponse.json({ success: true, data: treatment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
