'use client';

import { useState } from 'react';
import { initialAppointments, initialPatients, initialTreatments, buildWhatsAppLink } from '@/lib/data';
import { Appointment } from '@/types';
import { Calendar as CalendarIcon, Plus, Clock, User, DollarSign, MessageCircle, X, Copy, Trash2, CheckCircle2 } from 'lucide-react';

export default function AgendaPage() {
  const [view, setView] = useState<'Dia' | 'Semana' | 'Mes'>('Dia');
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new/edited appointment
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [treatmentId, setTreatmentId] = useState(initialTreatments[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState(45000);
  const [deposit, setDeposit] = useState(15000);
  const [status, setStatus] = useState<'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada'>('Pendiente');
  const [notes, setNotes] = useState('');

  const openNewModal = () => {
    setSelectedAppointment(null);
    setPatientName('');
    setPatientPhone('');
    setTreatmentId(initialTreatments[0].id);
    setDuration(initialTreatments[0].durationMins);
    setPrice(initialTreatments[0].price);
    setDeposit(0);
    setStatus('Pendiente');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleTreatmentChange = (tId: string) => {
    setTreatmentId(tId);
    const selectedT = initialTreatments.find((t) => t.id === tId);
    if (selectedT) {
      setDuration(selectedT.durationMins);
      setPrice(selectedT.price);
    }
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const selTreatment = initialTreatments.find((t) => t.id === treatmentId);

    if (selectedAppointment) {
      setAppointments(
        appointments.map((a) =>
          a.id === selectedAppointment.id
            ? {
                ...a,
                patientName,
                patientPhone,
                treatmentId,
                treatmentName: selTreatment?.name,
                treatmentColor: selTreatment?.color,
                dateTime: `${date}T${time}:00`,
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
        patientName: patientName || 'Paciente Nuevo',
        patientPhone: patientPhone || '+506 8888-0000',
        treatmentId,
        treatmentName: selTreatment?.name || 'Tratamiento',
        treatmentColor: selTreatment?.color || '#3B82F6',
        dateTime: `${date}T${time}:00`,
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
      notes: `${apt.notes || ''} (Copia)`,
    };
    setAppointments([...appointments, dup]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-pink-500" />
            Agenda MJ Estética
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Vista interactiva de agenda estilo SIKU & Notion Calendar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
            {(['Dia', 'Semana', 'Mes'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  view === v ? 'bg-white text-gray-800 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={openNewModal}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm rounded-xl shadow-sm hover:opacity-90 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Cita
          </button>
        </div>
      </div>

      {/* Category Legend */}
      <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
        <span className="font-bold text-gray-800">Tratamientos:</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"/> Faciales (Azul)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"/> Masajes (Verde)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block"/> Láser (Morado)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-pink-500 inline-block"/> Depilación (Rosado)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block"/> Corporales (Naranja)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-400 inline-block"/> Otros (Gris)</span>
      </div>

      {/* Calendar Slots Display */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => {
                setSelectedAppointment(apt);
                setPatientName(apt.patientName || '');
                setPatientPhone(apt.patientPhone || '');
                setTreatmentId(apt.treatmentId);
                setDuration(apt.durationMins);
                setPrice(apt.price);
                setDeposit(apt.deposit);
                setStatus(apt.status);
                setNotes(apt.notes || '');
                setIsModalOpen(true);
              }}
              className="p-4 rounded-xl border border-gray-100 hover:border-pink-300 transition bg-white shadow-xs cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-8"
              style={{ borderLeftColor: apt.treatmentColor || '#EC4899' }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 text-base">{apt.patientName}</span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    apt.status === 'Confirmada' ? 'bg-emerald-50 text-emerald-600' :
                    apt.status === 'Completada' ? 'bg-blue-50 text-blue-600' :
                    apt.status === 'Cancelada' ? 'bg-rose-50 text-rose-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {apt.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {apt.treatmentName} • Duración: {apt.durationMins} minutos
                </p>
                {apt.notes && <p className="text-xs italic text-gray-400 mt-0.5">&quot;{apt.notes}&quot;</p>}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">₡{apt.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Abono: ₡{apt.deposit.toLocaleString()}</p>
                </div>

                <a
                  href={buildWhatsAppLink(
                    apt.patientPhone || '50688888888',
                    `Hola ${apt.patientName}. Le recordamos su cita de ${apt.treatmentName} en MJ Estética.`
                  )}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition"
                  title="Abrir WhatsApp prellenado"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-rose-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">
                {selectedAppointment ? 'Editar Cita' : 'Agregar Nueva Cita'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAppointment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Paciente</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Ej. María González"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tratamiento</label>
                <select
                  value={treatmentId}
                  onChange={(e) => handleTreatmentChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Hora</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Precio (₡)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Abono (₡)</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Estado</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
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
                  placeholder="Notas adicionales..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                {selectedAppointment ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(selectedAppointment)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs flex items-center gap-1 font-medium"
                      title="Duplicar"
                    >
                      <Copy className="w-4 h-4" /> Duplicar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedAppointment.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs flex items-center gap-1 font-medium"
                      title="Eliminar"
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
                    className="px-4 py-2 bg-pink-500 text-white rounded-xl text-xs font-semibold hover:bg-pink-600 shadow-xs"
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
