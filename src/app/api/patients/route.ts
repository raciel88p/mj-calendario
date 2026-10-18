import { NextResponse } from 'next/server';
import { initialPatients } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ success: true, data: initialPatients });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newPatient = {
    id: `p-${Date.now()}`,
    ...body,
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json({ success: true, data: newPatient }, { status: 201 });
}
