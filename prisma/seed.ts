import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Configuración
  await prisma.setting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      companyName: 'MJ Estética',
      phone: '+506 8888-8888',
      address: 'Escazú, San José',
    },
  });

  // Profesionales
  const prof1 = await prisma.professional.create({
    data: { name: 'Dra. María José', specialty: 'Estética Avanzada' },
  });

  // Cabinas
  const cab1 = await prisma.cabin.create({ data: { name: 'Cabina Rosa (Facial)' } });
  const cab2 = await prisma.cabin.create({ data: { name: 'Cabina Dorada (Láser/Corporal)' } });

  // Tratamientos con sus colores
  const tFacial = await prisma.treatment.create({
    data: {
      name: 'Facial Hidratante Profundo',
      category: 'Faciales',
      durationMins: 60,
      price: 45000,
      color: '#3B82F6', // Azul
      description: 'Limpieza profunda con ácido hialurónico y mascarilla de colágeno.',
    },
  });

  const tMasaje = await prisma.treatment.create({
    data: {
      name: 'Masaje Relajante Descontracturante',
      category: 'Masajes',
      durationMins: 60,
      price: 35000,
      color: '#10B981', // Verde
      description: 'Masaje de cuerpo entero con aceites esenciales.',
    },
  });

  const tLaser = await prisma.treatment.create({
    data: {
      name: 'Depilación Láser Diodo',
      category: 'Láser',
      durationMins: 45,
      price: 50000,
      color: '#8B5CF6', // Morado
      description: 'Sesión láser zona completa.',
    },
  });

  const tDepilacion = await prisma.treatment.create({
    data: {
      name: 'Depilación con Cera Sensible',
      category: 'Depilación',
      durationMins: 30,
      price: 20000,
      color: '#EC4899', // Rosado
      description: 'Depilación cera tibia con extracto de manzanilla.',
    },
  });

  const tCorporal = await prisma.treatment.create({
    data: {
      name: 'Masaje Reductivo Corporal',
      category: 'Corporales',
      durationMins: 75,
      price: 40000,
      color: '#F97316', // Naranja
      description: 'Reducción de medidas y drenaje linfático.',
    },
  });

  // Pacientes
  const p1 = await prisma.patient.create({
    data: {
      firstName: 'María',
      lastName: 'González',
      phone: '+506 8888-1111',
      whatsapp: '50688881111',
      email: 'maria@example.com',
      gender: 'Femenino',
      allergies: 'Ninguna',
      notes: 'Prefiere atención en la mañana.',
      consent: true,
    },
  });

  const p2 = await prisma.patient.create({
    data: {
      firstName: 'Carla',
      lastName: 'Rodríguez',
      phone: '+506 8888-2222',
      whatsapp: '50688882222',
      email: 'carla@example.com',
      gender: 'Femenino',
      allergies: 'Piel sensible a retinol',
      consent: true,
    },
  });

  // Citas de hoy
  const today = new Date();
  today.setHours(10, 0, 0, 0);

  const todayNext = new Date();
  todayNext.setHours(15, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: p1.id,
      treatmentId: tFacial.id,
      professionalId: prof1.id,
      cabinId: cab1.id,
      dateTime: today,
      durationMins: 60,
      price: 45000,
      deposit: 15000,
      status: 'Confirmada',
      notes: 'Primera sesión.',
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: p2.id,
      treatmentId: tMasaje.id,
      professionalId: prof1.id,
      cabinId: cab2.id,
      dateTime: todayNext,
      durationMins: 60,
      price: 35000,
      deposit: 0,
      status: 'Pendiente',
      notes: 'Recordatorio por enviar.',
    },
  });

  console.log('MJ Estética Seed Data inserted successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
