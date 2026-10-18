import { NextResponse } from 'next/server';
import { initialAppointments } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ success: true, data: initialAppointments });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newAppointment = {
    id: `apt-${Date.now()}`,
    ...body,
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json({ success: true, data: newAppointment }, { status: 201 });
}
