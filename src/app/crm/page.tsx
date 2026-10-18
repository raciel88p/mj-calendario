'use client';

import { useState } from 'react';
import { initialPatients, initialCRMInteractions, buildWhatsAppLink } from '@/lib/data';
import { Patient, CRMInteraction } from '@/types';
import { Users, Phone, MessageCircle, Mail, Plus, CheckCircle2, ArrowRight, UserCheck, Calendar, Filter, Star, Globe, MessageSquare, Instagram, Send, Facebook } from 'lucide-react';

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
  const [isWebFormModalOpen, setIsWebFormModalOpen] = useState(false);

  // Form states for manual CRM interaction
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [interactionType, setInteractionType] = useState<CRMInteraction['type']>('WhatsApp');
  const [note, setNote] = useState('');

  // Form states for Web Form / Multi-Channel Lead Registration
  const [leadName, setLeadName] = useState('');
  const [leadCedula, setLeadCedula] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadResidence, setLeadResidence] = useState('');
  const [leadChannel, setLeadChannel] = useState<Patient['sourceChannel']>('Formulario Web');
  const [leadNote, setLeadNote] = useState('');
  const [leadSuccessMsg, setLeadSuccessMsg] = useState(false);

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

  const handleWebFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: `lead-${Date.now()}`,
      fullName: leadName.toUpperCase(),
      cedula: leadCedula || `CED-${Date.now()}`,
      email: leadEmail,
      phone: leadPhone,
      whatsapp: leadPhone.replace(/\D/g, ''),
      residence: leadResidence || 'San José',
      consent: true,
      hasMembership: false,
      crmStage: 'Nuevo Lead',
      sourceChannel: leadChannel,
      createdAt: new Date().toISOString(),
    };

    const newInteraction: CRMInteraction = {
      id: `int-${Date.now()}`,
      patientId: newPatient.id,
      patientName: newPatient.fullName,
      type: leadChannel as any,
      note: leadNote || `Nuevo lead capturado desde canal: ${leadChannel}`,
      date: new Date().toISOString().split('T')[0],
    };

    setPatients([newPatient, ...patients]);
    setInteractions([newInteraction, ...interactions]);

    setLeadSuccessMsg(true);
    setTimeout(() => {
      setLeadSuccessMsg(false);
      setIsWebFormModalOpen(false);
      setLeadName('');
      setLeadCedula('');
      setLeadEmail('');
      setLeadPhone('');
      setLeadResidence('');
      setLeadNote('');
    }, 1500);
  };

  const getChannelBadge = (channel?: Patient['sourceChannel']) => {
    switch (channel) {
      case 'Messenger':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 flex items-center gap-1">
            <Facebook className="w-3 h-3 text-blue-600" /> Messenger
          </span>
        );
      case 'Instagram':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 flex items-center gap-1">
            <Instagram className="w-3 h-3 text-pink-600" /> Instagram
          </span>
        );
      case 'Formulario Web':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 flex items-center gap-1">
            <Globe className="w-3 h-3 text-purple-600" /> Web Form
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
            <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-purple-600" />
            Módulo CRM Multicanal & Captura de Leads
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Integración de canales: WhatsApp, Facebook Messenger, Instagram Direct y Formulario Web.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsWebFormModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-xs transition flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            Capturar Lead (Web / Canales)
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm rounded-xl shadow-xs hover:opacity-90 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Registrar Seguimiento
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-2xs">
          <span className="text-xs font-semibold text-gray-400 uppercase">Leads Web & Redes</span>
          <h3 className="text-xl font-bold text-purple-600 mt-0.5">{patients.length}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-2xs">
          <span className="text-xs font-semibold text-gray-400 uppercase">Leads WhatsApp</span>
          <h3 className="text-xl font-bold text-emerald-600 mt-0.5">
            {patients.filter((p) => p.sourceChannel === 'WhatsApp').length}
          </h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-2xs">
          <span className="text-xs font-semibold text-gray-400 uppercase">Leads Instagram / Messenger</span>
          <h3 className="text-xl font-bold text-pink-600 mt-0.5">
            {patients.filter((p) => p.sourceChannel === 'Instagram' || p.sourceChannel === 'Messenger').length}
          </h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-2xs">
          <span className="text-xs font-semibold text-gray-400 uppercase">Clientes Fidelizados</span>
          <h3 className="text-xl font-bold text-amber-500 mt-0.5">
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
                    <div className="flex items-center justify-between gap-1 pt-1">
                      {getChannelBadge(p.sourceChannel)}
                      {p.hasMembership && (
                        <span className="bg-amber-400 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded flex items-center gap-0.5 uppercase">
                          <Star className="w-2.5 h-2.5 fill-white" /> MJ
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-xs text-gray-800 uppercase pt-1">{p.fullName}</div>
                    <div className="text-[11px] text-gray-500 space-y-0.5">
                      <p>🪪 {p.cedula}</p>
                      <p>✉️ {p.email}</p>
                      <p>📱 {p.phone}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <a
                        href={buildWhatsAppLink(p.whatsapp || p.phone, `Hola ${p.fullName}, le saludamos de MJ Estética.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition"
                        title="Responder vía WhatsApp"
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
        <h2 className="font-bold text-gray-800 text-base">Historial de Interacciones Multicanal</h2>

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

      {/* Web Form Lead Capture Simulator Modal */}
      {isWebFormModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-rose-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" />
              Captura de Lead (Formulario Web / Messenger / Instagram)
            </h3>

            {leadSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ¡Lead registrado y guardado con éxito en el CRM!
              </div>
            ) : (
              <form onSubmit={handleWebFormSubmit} className="space-y-3">
                <p className="text-xs text-gray-500">
                  Capture la información ingresada por un cliente en el formulario de la página web o redes sociales:
                </p>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Ej. KAREN VAGAS HERNÁNDEZ"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 uppercase font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Cédula *</label>
                    <input
                      type="text"
                      required
                      value={leadCedula}
                      onChange={(e) => setLeadCedula(e.target.value)}
                      placeholder="Ej. 1-1555-0888"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="karen@ejemplo.com"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Celular *</label>
                    <input
                      type="text"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+506 8888-0000"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Canal de Origen</label>
                    <select
                      value={leadChannel}
                      onChange={(e) => setLeadChannel(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="Formulario Web">Formulario Web</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Instagram">Instagram Direct</option>
                      <option value="Messenger">Facebook Messenger</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Consulta o Mensaje del Cliente</label>
                  <textarea
                    value={leadNote}
                    onChange={(e) => setLeadNote(e.target.value)}
                    rows={2}
                    placeholder="Ej. Interesada en consulta gratuita para Facial Hidratante..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setIsWebFormModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 shadow-xs flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" /> Guardar Lead en CRM
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Manual Interaction Modal */}
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
                  <option value="Messenger">Facebook Messenger</option>
                  <option value="Instagram">Instagram Direct</option>
                  <option value="Formulario Web">Formulario Web</option>
                  <option value="Llamada">Llamada</option>
                  <option value="Correo">Correo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Detalle / Notas del Seguimiento</label>
                <textarea
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Ej. Se le envió información sobre tratamiento facial..."
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
