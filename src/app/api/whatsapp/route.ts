import { NextResponse } from 'next/server';
import { buildWhatsAppLink } from '@/lib/data';

export async function POST(request: Request) {
  const { phone, message } = await request.json();
  const waUrl = buildWhatsAppLink(phone, message);
  return NextResponse.json({ success: true, url: waUrl });
}
