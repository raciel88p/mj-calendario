export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  whatsapp: string;
  email?: string;
  dob?: string;
  gender?: string;
  address?: string;
  allergies?: string;
  notes?: string;
  consent: boolean;
  createdAt: string;
}

export interface Treatment {
  id: string;
  name: string;
  category: 'Faciales' | 'Masajes' | 'Láser' | 'Depilación' | 'Corporales' | 'Otros';
  durationMins: number;
  price: number;
  color: string;
  description?: string;
  active: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string;
  patientPhone?: string;
  treatmentId: string;
  treatmentName?: string;
  treatmentColor?: string;
  professionalId?: string;
  cabinId?: string;
  dateTime: string;
  durationMins: number;
  price: number;
  deposit: number;
  status: 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';
  notes?: string;
}

export interface Payment {
  id: string;
  patientId: string;
  appointmentId?: string;
  amount: number;
  paymentMethod: 'Transferencia' | 'SINPE' | 'Tarjeta' | 'Efectivo';
  voucher?: string;
  createdAt: string;
}
