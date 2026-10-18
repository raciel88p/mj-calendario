'use client';

import { useState } from 'react';
import { Settings, Building, Users, Clock, ShieldCheck, CheckCircle2, MapPin, Plus, Edit, Trash2, Globe } from 'lucide-react';

interface Sucursal {
  id: string;
  name: string;
  provincia: string;
  canton: string;
  address: string;
  phone: string;
  active: boolean;
}

export default function ConfiguracionPage() {
  const [companyName, setCompanyName] = useState('MJ Estética');
  const [phone, setPhone] = useState('+506 8888-8888');
  const [address, setAddress] = useState('Escazú, San José');
  const [reminderTpl, setReminderTpl] = useState(
    'Hola {nombre}. Le recordamos su cita de {tratamiento} el día {fecha} a las {hora}. MJ Estética.'
  );

  // Sucursales Costa Rica State
  const [sucursales, setSucursales] = useState<Sucursal[]>([
    {
      id: 'suc-1',
      name: 'MJ Estética Escazú (Sede Principal)',
      provincia: 'San José',
      canton: 'Escazú',
      address: 'Plaza Multiplaza, Local 45, Escazú',
      phone: '+506 8888-1111',
      active: true,
    },
    {
      id: 'suc-2',
      name: 'MJ Estética Santa Ana',
      provincia: 'San José',
      canton: 'Santa Ana',
      address: 'City Place, Edificio B, Santa Ana',
      phone: '+506 8888-2222',
      active: true,
    },
    {
      id: 'suc-3',
      name: 'MJ Estética Curridabat / Pinares',
      provincia: 'San José',
      canton: 'Curridabat',
      address: 'Cronos Plaza, Pinares, Curridabat',
      phone: '+506 8888-3333',
      active: true,
    },
    {
      id: 'suc-4',
      name: 'MJ Estética Heredia / Belén',
      provincia: 'Heredia',
      canton: 'Belén',
      address: 'Centro Corporativo El Cafetal, Belén',
      phone: '+506 8888-4444',
      active: true,
    },
  ]);

  // Modal State for Sucursales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);
  const [sucName, setSucName] = useState('');
  const [sucProvincia, setSucProvincia] = useState('San José');
  const [sucCanton, setSucCanton] = useState('Escazú');
  const [sucAddress, setSucAddress] = useState('');
  const [sucPhone, setSucPhone] = useState('');

  const [saved, setSaved] = useState(false);

  const openNewSucursalModal = () => {
    setSelectedSucursal(null);
    setSucName('');
    setSucProvincia('San José');
    setSucCanton('Escazú');
    setSucAddress('');
    setSucPhone('+506 8888-8888');
    setIsModalOpen(true);
  };

  const handleSaveSucursal = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSucursal) {
      setSucursales(
        sucursales.map((s) =>
          s.id === selectedSucursal.id
            ? {
                ...s,
                name: sucName,
                provincia: sucProvincia,
                canton: sucCanton,
                address: sucAddress,
                phone: sucPhone,
              }
            : s
        )
      );
    } else {
      const newSuc: Sucursal = {
        id: `suc-${Date.now()}`,
        name: sucName,
        provincia: sucProvincia,
        canton: sucCanton,
        address: sucAddress,
        phone: sucPhone,
        active: true,
      };
      setSucursales([...sucursales, newSuc]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteSucursal = (id: string) => {
    setSucursales(sucursales.filter((s) => s.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-gray-500" />
            Configuración General & Sucursales
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Ajustes de empresa, sucursales en Costa Rica, áreas regionales y mensajes de WhatsApp.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ¡Configuración guardada correctamente!
        </div>
      )}

      {/* 1. Sucursales de Costa Rica Section */}
      <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-500" />
              Sucursales de la Clínica en Costa Rica
            </h2>
            <p className="text-xs text-gray-500">
              Administración de sedes y puntos de atención en las provincias de Costa Rica.
            </p>
          </div>

          <button
            onClick={openNewSucursalModal}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-xs rounded-xl shadow-2xs hover:opacity-90 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Nueva Sucursal
          </button>
        </div>

        {/* Sucursales List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sucursales.map((suc) => (
            <div key={suc.id} className="p-4 rounded-xl border border-gray-200 hover:border-pink-300 transition space-y-2 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">{suc.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                  {suc.provincia}
                </span>
              </div>

              <p className="text-xs text-gray-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                {suc.address} ({suc.canton})
              </p>

              <p className="text-xs text-gray-500">📱 {suc.phone}</p>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedSucursal(suc);
                    setSucName(suc.name);
                    setSucProvincia(suc.provincia);
                    setSucCanton(suc.canton);
                    setSucAddress(suc.address);
                    setSucPhone(suc.phone);
                    setIsModalOpen(true);
                  }}
                  className="px-2.5 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded font-medium flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Editar
                </button>
                <button
                  onClick={() => handleDeleteSucursal(suc.id)}
                  className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Form & Company Info */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm space-y-6">
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-pink-500" /> Datos de la Empresa
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Comercial</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono Central Costa Rica</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Dirección Matriz</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* WhatsApp Message Template */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" /> Plantilla Predeterminada de WhatsApp
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mensaje de Recordatorio</label>
            <textarea
              value={reminderTpl}
              onChange={(e) => setReminderTpl(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Variables disponibles: &#123;nombre&#125;, &#123;tratamiento&#125;, &#123;fecha&#125;, &#123;hora&#125;.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-sm rounded-xl shadow-xs hover:opacity-90 transition"
          >
            Guardar Cambios General
          </button>
        </div>
      </form>

      {/* Modal Agregar / Editar Sucursal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-rose-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-3">
              {selectedSucursal ? 'Editar Sucursal Costa Rica' : 'Agregar Nueva Sucursal Costa Rica'}
            </h3>

            <form onSubmit={handleSaveSucursal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre de Sucursal *</label>
                <input
                  type="text"
                  required
                  value={sucName}
                  onChange={(e) => setSucName(e.target.value)}
                  placeholder="Ej. MJ Estética Alajuela City Mall"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-pink-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Provincia *</label>
                  <select
                    value={sucProvincia}
                    onChange={(e) => setSucProvincia(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-pink-500"
                  >
                    <option value="San José">San José</option>
                    <option value="Alajuela">Alajuela</option>
                    <option value="Cartago">Cartago</option>
                    <option value="Heredia">Heredia</option>
                    <option value="Guanacaste">Guanacaste</option>
                    <option value="Puntarenas">Puntarenas</option>
                    <option value="Limón">Limón</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Cantón / Zona *</label>
                  <input
                    type="text"
                    required
                    value={sucCanton}
                    onChange={(e) => setSucCanton(e.target.value)}
                    placeholder="Ej. Escazú, Santa Ana..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Dirección Exacta *</label>
                <input
                  type="text"
                  required
                  value={sucAddress}
                  onChange={(e) => setSucAddress(e.target.value)}
                  placeholder="Ej. Plaza Lincoln, Moravia..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono Sucursal *</label>
                <input
                  type="text"
                  required
                  value={sucPhone}
                  onChange={(e) => setSucPhone(e.target.value)}
                  placeholder="+506 8888-8888"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-pink-500"
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
                  className="px-4 py-2 bg-pink-500 text-white rounded-xl text-xs font-semibold hover:bg-pink-600 shadow-2xs"
                >
                  Guardar Sucursal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
