'use client';

import { useState } from 'react';
import { initialPatients, buildWhatsAppLink } from '@/lib/data';
import { Patient } from '@/types';
import { Users, Search, Plus, Phone, Mail, AlertTriangle, FileSpreadsheet, Upload, MapPin, CreditCard, MessageCircle, Edit, CheckCircle2 } from 'lucide-react';

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Patient Form Fields
  const [fullName, setFullName] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [residence, setResidence] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Femenino');
  const [allergies, setAllergies] = useState('');
  const [notes, setNotes] = useState('');
  const [crmStage, setCrmStage] = useState<Patient['crmStage']>('Nuevo Lead');

  // Excel Import text area / file parser
  const [csvRawInput, setCsvRawInput] = useState('');
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

  const filteredPatients = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.cedula.includes(search) ||
      p.phone.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  const openNewModal = () => {
    setSelectedPatient(null);
    setFullName('');
    setCedula('');
    setEmail('');
    setPhone('');
    setWhatsapp('');
    setResidence('');
    setDob('');
    setGender('Femenino');
    setAllergies('');
    setNotes('');
    setCrmStage('Nuevo Lead');
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
                fullName: fullName.toUpperCase(),
                cedula,
                email,
                phone,
                whatsapp: whatsapp || phone.replace(/\D/g, ''),
                residence,
                dob,
                gender,
                allergies,
                notes,
                crmStage,
              }
            : p
        )
      );
    } else {
      const newP: Patient = {
        id: `p-${Date.now()}`,
        fullName: fullName.toUpperCase(),
        cedula,
        email,
        phone,
        whatsapp: whatsapp || phone.replace(/\D/g, ''),
        residence,
        dob,
        gender,
        allergies,
        notes,
        consent: true,
        crmStage,
        createdAt: new Date().toISOString(),
      };
      setPatients([...patients, newP]);
    }
    setIsModalOpen(false);
  };

  // Import Patients from CSV / Excel format
  const handleCSVImport = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = csvRawInput.split('\n');
    const newImportedPatients: Patient[] = [];

    lines.forEach((line, index) => {
      if (!line.trim()) return;
      // Skip CSV header if user pasted headers
      if (index === 0 && line.toLowerCase().includes('nombre')) return;

      const [nameVal, cedulaVal, emailVal, phoneVal, residenceVal] = line.split(',').map((s) => s?.trim() || '');

      if (nameVal && emailVal) {
        newImportedPatients.push({
          id: `p-imp-${Date.now()}-${index}`,
          fullName: nameVal.toUpperCase(),
          cedula: cedulaVal || `CED-${Date.now()}-${index}`,
          email: emailVal,
          phone: phoneVal || '+506 8888-0000',
          whatsapp: phoneVal ? phoneVal.replace(/\D/g, '') : '50688880000',
          residence: residenceVal || 'San José',
          consent: true,
          crmStage: 'Nuevo Lead',
          createdAt: new Date().toISOString(),
        });
      }
    });

    if (newImportedPatients.length > 0) {
      setPatients((prev) => [...prev, ...newImportedPatients]);
      setImportSuccessCount(newImportedPatients.length);
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportSuccessCount(null);
        setCsvRawInput('');
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-pink-500" />
            Directorio de Pacientes & CRM
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Administración de expediente, datos obligatorios (Cédula y Correo) e Importación Excel.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-xs transition flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Importar Excel / CSV
          </button>

          <button
            onClick={openNewModal}
            className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm rounded-xl shadow-xs hover:opacity-90 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Paciente
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar paciente por Nombre, Cédula, Correo o Teléfono..."
          className="w-full bg-transparent text-sm focus:outline-none text-gray-800"
        />
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm hover:border-pink-300 transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 font-bold flex items-center justify-center text-sm shrink-0">
                  {p.fullName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm uppercase">{p.fullName}</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-600">
                    {p.crmStage}
                  </span>
                </div>
              </div>

              <a
                href={buildWhatsAppLink(p.whatsapp || p.phone, `Hola ${p.fullName}, le saludamos de MJ Estética.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600 border-t pt-3 border-gray-100">
              <p className="flex items-center gap-2 font-medium">
                <CreditCard className="w-3.5 h-3.5 text-pink-500" /> <strong>Cédula:</strong> {p.cedula}
              </p>
              <p className="flex items-center gap-2 font-medium">
                <Mail className="w-3.5 h-3.5 text-pink-500" /> <strong>Correo:</strong> {p.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400" /> {p.phone}
              </p>
              {p.residence && (
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> {p.residence}
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
              <span className="text-emerald-600 font-medium">Consentimiento Activo</span>
              <button
                onClick={() => {
                  setSelectedPatient(p);
                  setFullName(p.fullName);
                  setCedula(p.cedula);
                  setEmail(p.email);
                  setPhone(p.phone);
                  setWhatsapp(p.whatsapp || '');
                  setResidence(p.residence || '');
                  setDob(p.dob || '');
                  setGender(p.gender || 'Femenino');
                  setAllergies(p.allergies || '');
                  setNotes(p.notes || '');
                  setCrmStage(p.crmStage);
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

      {/* Patient Creation/Editing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-rose-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-3">
              {selectedPatient ? 'Editar Expediente Paciente' : 'Nuevo Paciente'}
            </h3>

            <form onSubmit={handleSavePatient} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nombre Completo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. MARÍA GONZÁLEZ PÉRERZ"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500 uppercase font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Cédula / Identificación <span className="text-rose-500">* (Obligatorio)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    placeholder="Ej. 1-1111-0111"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Correo Electrónico <span className="text-rose-500">* (Obligatorio)</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Celular / Teléfono</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+506 8888-8888"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Residencia / Lugar donde vive</label>
                  <input
                    type="text"
                    value={residence}
                    onChange={(e) => setResidence(e.target.value)}
                    placeholder="Ej. Escazú, San José"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Etapa CRM</label>
                <select
                  value={crmStage}
                  onChange={(e) => setCrmStage(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                >
                  <option value="Nuevo Lead">Nuevo Lead</option>
                  <option value="Contactado">Contactado</option>
                  <option value="Cita Agendada">Cita Agendada</option>
                  <option value="Cliente Fidelizado">Cliente Fidelizado</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">Notas Clínicas</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
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

      {/* Import Excel / CSV Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-rose-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              Importar Pacientes desde Excel / CSV
            </h3>

            {importSuccessCount !== null ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ¡Se importaron {importSuccessCount} pacientes con éxito!
              </div>
            ) : (
              <form onSubmit={handleCSVImport} className="space-y-3">
                <p className="text-xs text-gray-500">
                  Pegue el contenido en formato separado por comas (CSV) con el orden: <br />
                  <strong className="text-gray-700">Nombre Completo, Cédula, Correo Electrónico, Celular, Residencia</strong>
                </p>

                <textarea
                  required
                  value={csvRawInput}
                  onChange={(e) => setCsvRawInput(e.target.value)}
                  rows={6}
                  placeholder={`MARTA SOLANO CHAVES, 1-1234-0567, marta@ejemplo.com, +506 8888-9999, Curridabat\nJUAN PÉREZ BOLAÑOS, 2-0987-0654, juan@ejemplo.com, +506 8777-6666, Alajuela`}
                  className="w-full p-3 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-500"
                />

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 shadow-xs flex items-center gap-1"
                  >
                    <Upload className="w-4 h-4" /> Importar Pacientes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
