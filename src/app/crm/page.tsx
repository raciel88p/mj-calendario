'use client';

import { useState } from 'react';
import { initialPatients, initialCRMInteractions, buildWhatsAppLink } from '@/lib/data';
import { Patient, CRMInteraction } from '@/types';
import { Users, Phone, MessageCircle, Mail, Plus, CheckCircle2, ArrowRight, UserCheck, Calendar, Filter, Star, TrendingUp } from 'lucide-react';

const CRM_STAGES: Patient['crmStage'][] = [
  'Nuevo Lead',
  'Contactado',
  'Cita Agendada',
  'Cliente Fidelizado',
  'Inactivo',
];

export default function CRMPage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [interactions, setInteractions] = useState<CRMInteraction[]>(initialCRMInteractions);

  // Interaction modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [interactionType, setInteractionType] = useState<CRMInteraction['type']>('WhatsApp');
  const [note, setNote] = useState('');

  const movePatientStage = (patientId: string, newStage: Patient['crmStage']) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, crmStage: newStage } : p))
    );
  };

  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    const p = patients.find((pat) => pat.id === selectedPatientId);
    if (p) {
      const newInt: CRMInteraction = {
        id: `crm-${Date.now()}`,
        patientId: p.id,
        patientName: p.fullName,
        type: interactionType,
        note,
        date: new Date().toISOString().split('T')[0],
      };
      setInteractions([newInt, ...interactions]);
    }
    setNote('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-purple-600" />
            Módulo CRM - Embudo de Ventas & Leads
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Administración de relación con clientes, seguimiento de prospectos y fidelización.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm rounded-xl shadow-xs hover:opacity-90 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Registrar Interacción CRM
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-2xs">
          <span className="text-xs font-semibold text-gray-400 uppercase">Nuevos Leads</span>
          <h3 className="text-xl font-bold text-purple-600 mt-0.5">
            {patients.filter((p) => p.crmStage === 'Nuevo Lead').length}
          </h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-2xs">
          <span className="text-xs font-semibold text-gray-400 uppercase">En Contacto</span>
          <h3 className="text-xl font-bold text-blue-600 mt-0.5">
            {patients.filter((p) => p.crmStage === 'Contactado').length}
          </h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-2xs">
          <span className="text-xs font-semibold text-gray-400 uppercase">Citas Agendadas</span>
          <h3 className="text-xl font-bold text-amber-500 mt-0.5">
            {patients.filter((p) => p.crmStage === 'Cita Agendada').length}
          </h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-2xs">
          <span className="text-xs font-semibold text-gray-400 uppercase">Clientes Fidelizados</span>
          <h3 className="text-xl font-bold text-emerald-600 mt-0.5">
            {patients.filter((p) => p.crmStage === 'Cliente Fidelizado').length}
          </h3>
        </div>
      </div>

      {/* Kanban Pipeline View */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-2">
        {CRM_STAGES.map((stage) => {
          const stagePatients = patients.filter((p) => p.crmStage === stage);

          return (
            <div
              key={stage}
              className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex flex-col space-y-3 min-w-[220px]"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-gray-800 uppercase">{stage}</span>
                <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[10px] font-extrabold text-gray-600">
                  {stagePatients.length}
                </span>
              </div>

              <div className="space-y-2 flex-1">
                {stagePatients.map((p) => (
                  <div
                    key={p.id}
                    className={`bg-white p-3 rounded-xl border shadow-2xs space-y-2 hover:border-purple-300 transition relative ${
                      p.hasMembership ? 'border-amber-300 ring-1 ring-amber-200' : 'border-gray-200'
                    }`}
                  >
                    {p.hasMembership && (
                      <div className="absolute -top-2 right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[9px] font-extrabold px-2 py-0.2 rounded-full flex items-center gap-0.5 shadow-2xs uppercase">
                        <Star className="w-2.5 h-2.5 fill-white" />
                        Membresía MJ
                      </div>
                    )}

                    <div className="font-bold text-xs text-gray-800 uppercase pt-1">{p.fullName}</div>
                    <div className="text-[11px] text-gray-500 space-y-0.5">
                      <p>🪪 {p.cedula}</p>
                      <p>✉️ {p.email}</p>
                      <p>📱 {p.phone}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <a
                        href={buildWhatsAppLink(p.whatsapp || p.phone, `Hola ${p.fullName}, saludos de MJ Estética.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>

                      {/* Move stage dropdown */}
                      <select
                        value={p.crmStage}
                        onChange={(e) => movePatientStage(p.id, e.target.value as any)}
                        className="text-[10px] bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 font-medium text-gray-700"
                      >
                        {CRM_STAGES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactions Log Section */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-gray-800 text-base">Historial de Interacciones & Seguimiento CRM</h2>

        <div className="space-y-3">
          {interactions.map((int) => (
            <div
              key={int.id}
              className="p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 text-sm">{int.patientName}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600">
                    {int.type}
                  </span>
                  <span className="text-xs text-gray-400">{int.date}</span>
                </div>
                <p className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                  &quot;{int.note}&quot;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-rose-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Registrar Interacción CRM</h3>

            <form onSubmit={handleAddInteraction} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Paciente / Cliente</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.cedula}) {p.hasMembership ? '⭐ Membresía MJ' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo de Interacción</label>
                <select
                  value={interactionType}
                  onChange={(e) => setInteractionType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Llamada">Llamada</option>
                  <option value="Correo">Correo</option>
                  <option value="Reunión">Reunión</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Detalle / Notas del Seguimiento</label>
                <textarea
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Ej. Se le envió información sobre tratamiento facial con descuento..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 shadow-xs"
                >
                  Guardar Interacción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
