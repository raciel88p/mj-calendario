import { Patient, Treatment, Appointment, Payment, CRMInteraction } from '@/types';

export const initialTreatments: Treatment[] = [
  {
    id: 't1',
    name: 'Facial Hidratante Profundo',
    category: 'Faciales',
    durationMins: 60,
    price: 45000,
    color: '#3B82F6', // Azul
    description: 'Limpieza profunda con ácido hialurónico y mascarilla de colágeno.',
    active: true,
  },
  {
    id: 't2',
    name: 'Masaje Relajante Descontracturante',
    category: 'Masajes',
    durationMins: 60,
    price: 35000,
    color: '#10B981', // Verde
    description: 'Masaje de cuerpo entero con aceites esenciales.',
    active: true,
  },
  {
    id: 't3',
    name: 'Depilación Láser Diodo',
    category: 'Láser',
    durationMins: 45,
    price: 50000,
    color: '#8B5CF6', // Morado
    description: 'Sesión láser zona completa.',
    active: true,
  },
  {
    id: 't4',
    name: 'Depilación con Cera Sensible',
    category: 'Depilación',
    durationMins: 30,
    price: 20000,
    color: '#EC4899', // Rosado
    description: 'Depilación cera tibia con manzanilla.',
    active: true,
  },
  {
    id: 't5',
    name: 'Masaje Reductivo Corporal',
    category: 'Corporales',
    durationMins: 75,
    price: 40000,
    color: '#F97316', // Naranja
    description: 'Reducción de medidas y drenaje linfático.',
    active: true,
  },
];

export const initialPatients: Patient[] = [
  {
    id: 'p1',
    fullName: 'MARÍA GONZÁLEZ PÉREZ',
    cedula: '1-1111-0111',
    email: 'maria.gonzalez@example.com',
    phone: '+506 8888-1111',
    whatsapp: '50688881111',
    residence: 'Escazú, San José',
    dob: '1992-05-14',
    gender: 'Femenino',
    allergies: 'Ninguna',
    notes: 'Prefiere citas en horario matutino.',
    consent: true,
    hasMembership: true,
    crmStage: 'Cliente Fidelizado',
    sourceChannel: 'WhatsApp',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    fullName: 'CARLA RODRÍGUEZ MONGE',
    cedula: '1-2222-0222',
    email: 'carla.rodriguez@example.com',
    phone: '+506 8888-2222',
    whatsapp: '50688882222',
    residence: 'Santa Ana, San José',
    dob: '1988-11-20',
    gender: 'Femenino',
    allergies: 'Sensibilidad a retinol',
    notes: 'Alergia suave.',
    consent: true,
    hasMembership: false,
    crmStage: 'Cita Agendada',
    sourceChannel: 'Instagram',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    fullName: 'FERNANDA LÓPEZ SÁNCHEZ',
    cedula: '1-3333-0333',
    email: 'fernanda.lopez@example.com',
    phone: '+506 8888-3333',
    whatsapp: '50688883333',
    residence: 'Curridabat, San José',
    dob: '1995-03-10',
    gender: 'Femenino',
    allergies: 'Ninguna',
    consent: true,
    hasMembership: true,
    crmStage: 'Nuevo Lead',
    sourceChannel: 'Formulario Web',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p4',
    fullName: 'STEFANIE CHAVARRÍA SOLANO',
    cedula: '1-4444-0444',
    email: 'stefanie.chavarria@example.com',
    phone: '+506 8888-4444',
    whatsapp: '50688884444',
    residence: 'Belén, Heredia',
    consent: true,
    hasMembership: false,
    crmStage: 'Contactado',
    sourceChannel: 'Messenger',
    createdAt: new Date().toISOString(),
  },
];

export const initialCRMInteractions: CRMInteraction[] = [
  {
    id: 'crm-1',
    patientId: 'p1',
    patientName: 'MARÍA GONZÁLEZ PÉREZ',
    type: 'WhatsApp',
    note: 'Enviada confirmación de cita para Facial Hidratante. Membresía MJ verificada.',
    date: '2026-11-05',
  },
  {
    id: 'crm-2',
    patientId: 'p3',
    patientName: 'FERNANDA LÓPEZ SÁNCHEZ',
    type: 'Formulario Web',
    note: 'Lead recibido desde el Formulario Web de la clínica solicitando cita de Depilación Láser.',
    date: '2026-11-04',
  },
  {
    id: 'crm-3',
    patientId: 'p4',
    patientName: 'STEFANIE CHAVARRÍA SOLANO',
    type: 'Messenger',
    note: 'Consulta por Facebook Messenger sobre costos de paquetes reductivos.',
    date: '2026-11-03',
  },
];

export const initialAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'MARÍA GONZÁLEZ PÉREZ',
    patientPhone: '+506 8888-1111',
    treatmentId: 't1',
    treatmentName: 'Facial Hidratante Profundo',
    treatmentColor: '#3B82F6',
    dateTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    durationMins: 60,
    price: 45000,
    deposit: 15000,
    status: 'Confirmada',
    notes: 'Primera cita del mes - Membresía MJ',
  },
  {
    id: 'a2',
    patientId: 'p2',
    patientName: 'CARLA RODRÍGUEZ MONGE',
    patientPhone: '+506 8888-2222',
    treatmentId: 't2',
    treatmentName: 'Masaje Relajante Descontracturante',
    treatmentColor: '#10B981',
    dateTime: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    durationMins: 60,
    price: 35000,
    deposit: 0,
    status: 'Pendiente',
    notes: 'Enviar recordatorio por WhatsApp',
  },
];

export const initialPayments: Payment[] = [
  {
    id: 'pay1',
    patientId: 'p1',
    appointmentId: 'a1',
    amount: 15000,
    paymentMethod: 'SINPE',
    voucher: 'SINPE-99281',
    createdAt: new Date().toISOString(),
  },
];

export function buildWhatsAppLink(phone: string, text: string) {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
