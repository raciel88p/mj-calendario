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

export const initialPatients: Patient[] = [];

export const initialCRMInteractions: CRMInteraction[] = [];

export const initialAppointments: Appointment[] = [];

export const initialPayments: Payment[] = [];

export function buildWhatsAppLink(phone: string, text: string) {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
