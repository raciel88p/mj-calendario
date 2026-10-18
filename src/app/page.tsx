'use client';

import { useState } from 'react';
import { initialAppointments, initialPatients, initialTreatments, buildWhatsAppLink } from '@/lib/data';
import { Calendar, Users, DollarSign, Clock, MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [appointments] = useState(initialAppointments);
  const [patients] = useState(initialPatients);

  // Metrics calculations
  const todayAppointments = appointments.length;
  const pendingDeposits = appointments.reduce((sum, a) => sum + (a.price - a.deposit), 0);
  const dailyIncome = appointments.reduce((sum, a) => sum + a.deposit, 0);
  const totalPatients = patients.length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-50 via-white to-amber-50 p-6 rounded-2xl border border-rose-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bienvenido a MJ Estética 🌸</h1>
          <p className="text-sm text-gray-500 mt-1">
            Resumen diario, agenda del día y métricas principales.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/agenda"
            className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm rounded-xl shadow-sm hover:opacity-90 transition flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Nueva Cita
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Citas de Hoy</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{todayAppointments}</h3>
            <span className="text-xs text-emerald-600 font-medium">Agenda activa</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Pacientes Hoy</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalPatients}</h3>
            <span className="text-xs text-amber-600 font-medium">Atención personalizada</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Ingresos Diarios</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">₡{dailyIncome.toLocaleString()}</h3>
            <span className="text-xs text-emerald-600 font-medium">Abonos recibidos</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Abonos Pendientes</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">₡{pendingDeposits.toLocaleString()}</h3>
            <span className="text-xs text-rose-500 font-medium">Por cobrar</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Agenda (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-rose-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-500" />
              Agenda del Día
            </h2>
            <Link href="/agenda" className="text-xs text-pink-600 font-semibold hover:underline flex items-center gap-1">
              Ver calendario completo <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-xl border border-gray-100 hover:border-rose-200 transition bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-12 rounded-full"
                    style={{ backgroundColor: apt.treatmentColor || '#EC4899' }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-800">{apt.patientName}</h4>
                      <span className="px-2 py-0.5 text-xs font-medium bg-rose-50 text-pink-600 rounded-full">
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {apt.treatmentName} • {apt.durationMins} min
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">₡{apt.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">
                      Abono: ₡{apt.deposit.toLocaleString()}
                    </p>
                  </div>

                  <a
                    href={buildWhatsAppLink(
                      apt.patientPhone || '50688888888',
                      `Hola ${apt.patientName}. Le recordamos su cita de ${apt.treatmentName} hoy en MJ Estética.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                    title="Enviar recordatorio por WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminders & Quick Actions Sidebar (1 Col) */}
        <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
            <MessageCircle className="w-5 h-5 text-emerald-500" />
            Recordatorios por Enviar
          </h2>

          <p className="text-xs text-gray-500">
            Supervisa los mensajes antes de abrirlos en WhatsApp Web.
          </p>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">{apt.patientName}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                    WhatsApp Listo
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  &quot;Hola {apt.patientName}. Le recordamos su cita de {apt.treatmentName} mañana en MJ Estética.&quot;
                </p>
                <a
                  href={buildWhatsAppLink(
                    apt.patientPhone || '50688888888',
                    `Hola ${apt.patientName}. Le recordamos su cita de ${apt.treatmentName} mañana en MJ Estética.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 transition flex items-center justify-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Enviar WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
