import { NextResponse } from 'next/server';
import { initialTreatments } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ success: true, data: initialTreatments });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newTreatment = {
    id: `t-${Date.now()}`,
    ...body,
    active: true,
  };
  return NextResponse.json({ success: true, data: newTreatment }, { status: 201 });
}
