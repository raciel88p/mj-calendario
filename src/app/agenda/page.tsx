'use client';

import { useState } from 'react';
import { initialAppointments, initialPatients, initialTreatments, buildWhatsAppLink } from '@/lib/data';
import { Appointment } from '@/types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Clock,
  User,
  MessageCircle,
  X,
  Copy,
  Trash2,
  Filter,
  Users,
  Check
} from 'lucide-react';

const HOURS = [
  '8am',
  '9am',
  '10am',
  '11am',
  '12pm',
  '1pm',
  '2pm',
  '3pm',
  '4pm',
  '5pm',
  '6pm',
  '7pm',
];

export default function AgendaPage() {
  const [activeTab, setActiveTab] = useState<'Agenda' | 'Citas' | 'SalaDeEspera'>('Agenda');
  const [view, setView] = useState<'Día' | 'Semana' | 'Mes'>('Día');
  const [selectedDate, setSelectedDate] = useState(6); // 6 de Noviembre
  const [currentMonth] = useState('noviembre 2026');

  // Filters
  const [filters, setFilters] = useState<{ [key: string]: boolean }>({
    'Faciales': true,
    'Masajes': true,
    'Láser': true,
    'Depilación': true,
    'Corporales': true,
  });

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt-1',
      patientId: 'p1',
      patientName: 'CHAVARRIA LOPEZ MARJORIE FERNANDA',
      patientPhone: '+506 8888-1111',
      treatmentId: 't2',
      treatmentName: 'Masaje Relajante Descontracturante',
      treatmentColor: '#10B981', // Verde
      dateTime: '2026-11-06T09:00:00',
      durationMins: 60,
      price: 35000,
      deposit: 10000,
      status: 'Confirmada',
      notes: 'Solo 2 cabinas',
    },
    {
      id: 'apt-2',
      patientId: 'p2',
      patientName: 'VELASQUEZ LORIA JIRLEN MILENA',
      patientPhone: '+506 8888-2222',
      treatmentId: 't4',
      treatmentName: 'Depilación con Cera Sensible',
      treatmentColor: '#EC4899', // Rosado
      dateTime: '2026-11-06T09:00:00',
      durationMins: 60,
      price: 25000,
      deposit: 5000,
      status: 'Confirmada',
    },
    {
      id: 'apt-3',
      patientId: 'p3',
      patientName: 'BEDOYA GONZALEZ KAREN MARIA',
      patientPhone: '+506 8888-3333',
      treatmentId: 't4',
      treatmentName: 'Depilación Láser Diodo',
      treatmentColor: '#8B5CF6', // Morado
      dateTime: '2026-11-06T11:00:00',
      durationMins: 60,
      price: 45000,
      deposit: 15000,
      status: 'Pendiente',
    },
    {
      id: 'apt-4',
      patientId: 'p4',
      patientName: 'CEDEÑO CASTRO CAROLL MARIA',
      patientPhone: '+506 8888-4444',
      treatmentId: 't2',
      treatmentName: 'Masaje Reductivo Corporal',
      treatmentColor: '#10B981', // Verde
      dateTime: '2026-11-06T13:00:00',
      durationMins: 60,
      price: 38000,
      deposit: 0,
      status: 'Confirmada',
    },
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [treatmentId, setTreatmentId] = useState(initialTreatments[0].id);
  const [slotTime, setSlotTime] = useState('09:00');
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState(35000);
  const [deposit, setDeposit] = useState(0);
  const [status, setStatus] = useState<'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada'>('Pendiente');
  const [notes, setNotes] = useState('');

  const openSlotModal = (hourText: string) => {
    let h = parseInt(hourText);
    if (hourText.includes('pm') && h < 12) h += 12;
    const formattedHour = h < 10 ? `0${h}:00` : `${h}:00`;

    setSelectedAppointment(null);
    setPatientName('');
    setPatientPhone('');
    setTreatmentId(initialTreatments[0].id);
    setSlotTime(formattedHour);
    setDuration(initialTreatments[0].durationMins);
    setPrice(initialTreatments[0].price);
    setDeposit(0);
    setStatus('Pendiente');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setPatientName(apt.patientName || '');
    setPatientPhone(apt.patientPhone || '');
    setTreatmentId(apt.treatmentId);
    setSlotTime(apt.dateTime.split('T')[1].slice(0, 5));
    setDuration(apt.durationMins);
    setPrice(apt.price);
    setDeposit(apt.deposit);
    setStatus(apt.status);
    setNotes(apt.notes || '');
    setIsModalOpen(true);
  };

  const toggleFilter = (cat: string) => {
    setFilters((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleAllFilters = (enable: boolean) => {
    const updated = { ...filters };
    Object.keys(updated).forEach((k) => (updated[k] = enable));
    setFilters(updated);
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const selT = initialTreatments.find((t) => t.id === treatmentId);

    if (selectedAppointment) {
      setAppointments(
        appointments.map((a) =>
          a.id === selectedAppointment.id
            ? {
                ...a,
                patientName: patientName.toUpperCase(),
                patientPhone,
                treatmentId,
                treatmentName: selT?.name,
                treatmentColor: selT?.color || '#3B82F6',
                dateTime: `2026-11-06T${slotTime}:00`,
                durationMins: Number(duration),
                price: Number(price),
                deposit: Number(deposit),
                status,
                notes,
              }
            : a
        )
      );
    } else {
      const newApt: Appointment = {
        id: `apt-${Date.now()}`,
        patientId: `p-${Date.now()}`,
        patientName: (patientName || 'NUEVO PACIENTE').toUpperCase(),
        patientPhone: patientPhone || '+506 8888-0000',
        treatmentId,
        treatmentName: selT?.name || 'Tratamiento',
        treatmentColor: selT?.color || '#3B82F6',
        dateTime: `2026-11-06T${slotTime}:00`,
        durationMins: Number(duration),
        price: Number(price),
        deposit: Number(deposit),
        status,
        notes,
      };
      setAppointments([...appointments, newApt]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id));
    setIsModalOpen(false);
  };

  const handleDuplicate = (apt: Appointment) => {
    const dup: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`,
      patientName: `${apt.patientName} (COPIA)`,
    };
    setAppointments([...appointments, dup]);
    setIsModalOpen(false);
  };

  const formatTimeRange = (dateTimeStr: string, durationMins: number) => {
    const [_, timePart] = dateTimeStr.split('T');
    const [hStr, mStr] = timePart.split(':');
    let h = parseInt(hStr);
    let m = parseInt(mStr);

    const startFormatted = `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${m < 10 ? '0' + m : m} ${h >= 12 ? 'p' : 'a'}`;

    const totalMins = h * 60 + m + durationMins;
    let endH = Math.floor(totalMins / 60);
    let endM = totalMins % 60;
    const endFormatted = `${endH > 12 ? endH - 12 : endH === 0 ? 12 : endH}:${endM < 10 ? '0' + endM : endM} ${endH >= 12 ? 'p' : 'a'}`;

    return `${startFormatted} - ${endFormatted}`;
  };

  // Helper to get appointments for a specific hour
  const getAppointmentsForHour = (hourIndex: number) => {
    const hourVal = 8 + hourIndex;
    return appointments.filter((apt) => {
      const aptHour = parseInt(apt.dateTime.split('T')[1].split(':')[0]);
      const selT = initialTreatments.find((t) => t.id === apt.treatmentId);
      const categoryMatch = selT ? filters[selT.category] !== false : true;
      return aptHour === hourVal && categoryMatch;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col min-h-[85vh]">
      {/* Top Header Navigation Tabs & Actions */}
      <div className="border-b border-gray-200 bg-slate-50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm">
        {/* Left Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('Agenda')}
            className={`px-4 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-2 transition ${
              activeTab === 'Agenda' ? 'bg-white text-blue-600 shadow-2xs border border-gray-200' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-blue-500" />
            Agenda
          </button>
          <button
            onClick={() => setActiveTab('Citas')}
            className={`px-4 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-2 transition ${
              activeTab === 'Citas' ? 'bg-white text-blue-600 shadow-2xs border border-gray-200' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="w-4 h-4 text-sky-500" />
            Citas
          </button>
          <button
            onClick={() => setActiveTab('SalaDeEspera')}
            className={`px-4 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-2 transition ${
              activeTab === 'SalaDeEspera' ? 'bg-white text-blue-600 shadow-2xs border border-gray-200' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-500" />
            Sala de espera
          </button>
        </div>

        {/* Center Date & View Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedDate(6)}
            className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Hoy
          </button>

          <select
            value={view}
            onChange={(e) => setView(e.target.value as any)}
            className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none"
          >
            <option value="Día">Día</option>
            <option value="Semana">Semana</option>
            <option value="Mes">Mes</option>
          </select>

          <span className="font-bold text-gray-800 text-sm">
            {selectedDate} de noviembre de 2026
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openSlotModal('9am')}
            className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            title="Nueva Cita"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {}}
            className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            title="Refrescar Agenda"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid Section: Left Mini-Calendar + Timeline */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Mini-Calendar & Filters */}
        <div className="w-64 border-r border-gray-200 p-4 space-y-5 hidden md:block bg-slate-50/50">
          {/* Mini Calendar Header */}
          <div className="flex items-center justify-between font-bold text-xs text-gray-800">
            <button className="p-1 hover:bg-gray-200 rounded-md">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="capitalize">{currentMonth}</span>
            <button className="p-1 hover:bg-gray-200 rounded-md">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Mini Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
            {['L', 'K', 'M', 'J', 'V', 'S', 'D'].map((d) => (
              <span key={d} className="font-semibold text-gray-400 py-1">
                {d}
              </span>
            ))}
            {[26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(
              (dayNumber, idx) => {
                const isCurrent = dayNumber === selectedDate && idx >= 6 && idx <= 12;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(dayNumber)}
                    className={`py-1 rounded-md transition ${
                      isCurrent
                        ? 'bg-gray-800 text-white font-bold'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {dayNumber < 10 ? `0${dayNumber}` : dayNumber}
                  </button>
                );
              }
            )}
          </div>

          {/* Filter Toggles */}
          <div className="space-y-2 border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between text-xs">
              <button onClick={() => toggleAllFilters(true)} className="text-blue-600 hover:underline font-medium">
                ✓ todas
              </button>
              <button onClick={() => toggleAllFilters(false)} className="text-blue-600 hover:underline font-medium">
                ✕ ninguna
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              {['Faciales', 'Masajes', 'Láser', 'Depilación', 'Corporales'].map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={filters[cat] !== false}
                    onChange={() => toggleFilter(cat)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Google Calendar Style Timeline */}
        <div className="flex-1 overflow-y-auto bg-white">
          {/* Day Header Column */}
          <div className="border-b border-gray-200 bg-slate-50 p-2 text-center text-xs font-bold text-gray-600 sticky top-0 z-10 border-l border-gray-200">
            vie. 6
          </div>

          {/* Hours Grid */}
          <div className="relative divide-y divide-gray-100">
            {HOURS.map((hourText, idx) => {
              const hourApts = getAppointmentsForHour(idx);

              return (
                <div
                  key={hourText}
                  onClick={() => openSlotModal(hourText)}
                  className="min-h-[95px] flex group hover:bg-blue-50/20 cursor-pointer transition relative"
                >
                  {/* Time Label */}
                  <div className="w-16 py-2 px-2 text-right text-xs text-gray-400 font-semibold select-none border-r border-gray-100">
                    {hourText}
                  </div>

                  {/* Slot Content Area */}
                  <div className="flex-1 p-1 relative flex gap-2 overflow-x-auto">
                    {hourApts.map((apt) => (
                      <div
                        key={apt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(apt);
                        }}
                        className="flex-1 min-w-[240px] max-w-[380px] rounded-md shadow-xs p-2 flex flex-col justify-between hover:opacity-95 transition cursor-pointer border text-white"
                        style={{
                          backgroundColor: apt.treatmentColor || '#38BDF8',
                          borderColor: apt.treatmentColor || '#0284C7',
                        }}
                      >
                        {/* Appointment Time Badge Header */}
                        <div
                          className="px-2 py-0.5 rounded text-[11px] font-bold text-white flex items-center justify-between bg-black/20"
                        >
                          <span>{formatTimeRange(apt.dateTime, apt.durationMins)}</span>
                        </div>

                        {/* Patient Name */}
                        <div className="mt-1 font-extrabold text-xs tracking-tight uppercase text-white line-clamp-2 drop-shadow-2xs">
                          {apt.patientName}
                        </div>

                        {/* Treatment Name & WhatsApp Quick Action */}
                        <div className="mt-1 flex items-center justify-between text-[11px] text-white/90">
                          <span className="truncate">{apt.treatmentName}</span>
                          <a
                            href={buildWhatsAppLink(
                              apt.patientPhone || '50688888888',
                              `Hola ${apt.patientName}. Le recordamos su cita de ${apt.treatmentName} en MJ Estética.`
                            )}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-white/20 hover:bg-white/40 text-white transition"
                            title="Abrir WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Appointment Creation / Editing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">
                {selectedAppointment ? 'Editar Cita' : 'Agregar Cita en Agenda'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAppointment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Completo del Paciente</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Ej. BEDOYA GONZALEZ KAREN MARIA"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 uppercase font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="Ej. +506 8888-1111"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tratamiento / Servicio</label>
                <select
                  value={treatmentId}
                  onChange={(e) => {
                    setTreatmentId(e.target.value);
                    const selT = initialTreatments.find((t) => t.id === e.target.value);
                    if (selT) {
                      setDuration(selT.durationMins);
                      setPrice(selT.price);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  {initialTreatments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.category}) - ₡{t.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Hora de Inicio</label>
                  <input
                    type="time"
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Duración (minutos)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Precio Total (₡)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Abono (₡)</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Estado de Cita</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Observaciones</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Ej. Solo 2 cabinas disponibles..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                {selectedAppointment ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(selectedAppointment)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs flex items-center gap-1 font-medium"
                    >
                      <Copy className="w-4 h-4" /> Duplicar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedAppointment.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                  </div>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-xs"
                  >
                    Guardar Cita
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
