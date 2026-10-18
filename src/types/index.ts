export interface Patient {
  id: string;
  fullName: string;
  cedula: string;
  email: string;
  phone: string;
  whatsapp?: string;
  residence?: string;
  dob?: string;
  gender?: string;
  allergies?: string;
  notes?: string;
  consent: boolean;
  crmStage: 'Nuevo Lead' | 'Contactado' | 'Cita Agendada' | 'Cliente Fidelizado' | 'Inactivo';
  createdAt: string;
}

export interface CRMInteraction {
  id: string;
  patientId: string;
  patientName: string;
  type: 'Llamada' | 'WhatsApp' | 'Correo' | 'Reunión';
  note: string;
  date: string;
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
