import { NextResponse } from 'next/server';
import { initialAppointments } from '@/lib/data';

// In-memory appointments list for active session persistence & conflict validation
let appointments = [...initialAppointments];

export async function GET() {
  return NextResponse.json({ success: true, data: appointments });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dateTime, durationMins = 60, professionalId, cabinId } = body;

    const newStart = new Date(dateTime).getTime();
    const newEnd = newStart + Number(durationMins) * 60 * 1000;

    // Check schedule overlap for same professional or same cabin
    const conflict = appointments.find((apt) => {
      if (apt.status === 'Cancelada') return false;

      const aptStart = new Date(apt.dateTime).getTime();
      const aptEnd = aptStart + (apt.durationMins || 60) * 60 * 1000;

      const isTimeOverlapping = newStart < aptEnd && newEnd > aptStart;
      if (!isTimeOverlapping) return false;

      const sameProf = professionalId && apt.professionalId && apt.professionalId === professionalId;
      const sameCabin = cabinId && apt.cabinId && apt.cabinId === cabinId;

      return sameProf || sameCabin;
    });

    if (conflict) {
      return NextResponse.json(
        {
          success: false,
          error: 'Conflicto de horario: La profesional o la cabina seleccionada ya tienen una cita agendada en este horario.',
        },
        { status: 409 }
      );
    }

    const newAppointment = {
      id: `apt-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };

    appointments.unshift(newAppointment);

    return NextResponse.json({ success: true, data: newAppointment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error procesando la solicitud' }, { status: 500 });
  }
}
