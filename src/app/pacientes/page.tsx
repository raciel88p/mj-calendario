'use client';

import { useState } from 'react';
import { initialPatients, initialAppointments, buildWhatsAppLink } from '@/lib/data';
import { Patient } from '@/types';
import { Users, Search, Plus, Phone, Mail, AlertTriangle, FileText, Calendar, MessageCircle, Edit, Trash2 } from 'lucide-react';

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Femenino');
  const [allergies, setAllergies] = useState('');
  const [notes, setNotes] = useState('');

  const filteredPatients = patients.filter(
    (p) =>
      p.firstName.toLowerCase().includes(search.toLowerCase()) ||
      p.lastName.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const openNewModal = () => {
    setSelectedPatient(null);
    setFirstName('');
    setLastName('');
    setPhone('');
    setWhatsapp('');
    setEmail('');
    setDob('');
    setGender('Femenino');
    setAllergies('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSavePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPatient) {
      setPatients(
        patients.map((p) =>
          p.id === selectedPatient.id
            ? {
                ...p,
                firstName,
                lastName,
                phone,
                whatsapp: whatsapp || phone.replace(/\D/g, ''),
                email,
                dob,
                gender,
                allergies,
                notes,
              }
            : p
        )
      );
    } else {
      const newP: Patient = {
        id: `p-${Date.now()}`,
        firstName,
        lastName,
        phone,
        whatsapp: whatsapp || phone.replace(/\D/g, ''),
        email,
        dob,
        gender,
        allergies,
        notes,
        consent: true,
        createdAt: new Date().toISOString(),
      };
      setPatients([...patients, newP]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-pink-500" />
            Directorio de Pacientes & Expedientes
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestión completa de expediente clínico, alergias y contactos.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm rounded-xl shadow-sm hover:opacity-90 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Paciente
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar paciente por nombre, apellidos o teléfono..."
          className="w-full bg-transparent text-sm focus:outline-none text-gray-800"
        />
      </div>

      {/* Patient List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm hover:border-pink-300 transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 font-bold flex items-center justify-center text-sm">
                  {p.firstName[0]}
                  {p.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    {p.firstName} {p.lastName}
                  </h3>
                  <span className="text-xs text-gray-400">{p.gender}</span>
                </div>
              </div>

              <a
                href={buildWhatsAppLink(p.whatsapp || p.phone, `Hola ${p.firstName}, te saludamos de MJ Estética.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            <div className="space-y-1 text-xs text-gray-600 border-t pt-3 border-gray-100">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400" /> {p.phone}
              </p>
              {p.email && (
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> {p.email}
                </p>
              )}
            </div>

            {/* Allergy alert */}
            {p.allergies && p.allergies !== 'Ninguna' && (
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Alergia:</strong> {p.allergies}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between border-t pt-3 border-gray-100 text-xs">
              <span className="text-emerald-600 font-medium">Consentimiento Al Día</span>
              <button
                onClick={() => {
                  setSelectedPatient(p);
                  setFirstName(p.firstName);
                  setLastName(p.lastName);
                  setPhone(p.phone);
                  setWhatsapp(p.whatsapp);
                  setEmail(p.email || '');
                  setDob(p.dob || '');
                  setGender(p.gender || 'Femenino');
                  setAllergies(p.allergies || '');
                  setNotes(p.notes || '');
                  setIsModalOpen(true);
                }}
                className="text-pink-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" /> Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-rose-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-3">
              {selectedPatient ? 'Editar Expediente Paciente' : 'Nuevo Paciente'}
            </h3>

            <form onSubmit={handleSavePatient} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Apellidos</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ej. 50688881111"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Alergias o Contraindicaciones</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Ej. Piel sensible a retinol, alergia a látex..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Notas Clínicas / Expediente</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
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
                  className="px-4 py-2 bg-pink-500 text-white rounded-xl text-xs font-semibold hover:bg-pink-600 shadow-xs"
                >
                  Guardar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
