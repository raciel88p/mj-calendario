import { Patient, Treatment, Appointment, Payment } from '@/types';

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
    firstName: 'María',
    lastName: 'González',
    phone: '+506 8888-1111',
    whatsapp: '50688881111',
    email: 'maria@example.com',
    dob: '1992-05-14',
    gender: 'Femenino',
    allergies: 'Ninguna',
    notes: 'Prefiere citas en horario matutino.',
    consent: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    firstName: 'Carla',
    lastName: 'Rodríguez',
    phone: '+506 8888-2222',
    whatsapp: '50688882222',
    email: 'carla@example.com',
    dob: '1988-11-20',
    gender: 'Femenino',
    allergies: 'Sensibilidad a retinol',
    notes: 'Alergia suave.',
    consent: true,
    createdAt: new Date().toISOString(),
  },
];

export const initialAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'María González',
    patientPhone: '+506 8888-1111',
    treatmentId: 't1',
    treatmentName: 'Facial Hidratante Profundo',
    treatmentColor: '#3B82F6',
    dateTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    durationMins: 60,
    price: 45000,
    deposit: 15000,
    status: 'Confirmada',
    notes: 'Primera cita del mes',
  },
  {
    id: 'a2',
    patientId: 'p2',
    patientName: 'Carla Rodríguez',
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
