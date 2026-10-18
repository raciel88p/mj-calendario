'use client';

import { useState } from 'react';
import { Settings, Building, Users, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ConfiguracionPage() {
  const [companyName, setCompanyName] = useState('MJ Estética');
  const [phone, setPhone] = useState('+506 8888-8888');
  const [address, setAddress] = useState('Escazú, San José');
  const [reminderTpl, setReminderTpl] = useState(
    'Hola {nombre}. Le recordamos su cita de {tratamiento} el día {fecha} a las {hora}. MJ Estética.'
  );
  const [saved, setSaved] = useState(false);

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
            Configuración General
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Ajustes de empresa, profesionales, cabinas y plantillas de WhatsApp.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ¡Configuración guardada correctamente!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm space-y-6">
        {/* Company Info */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-pink-500" /> Datos de la Clínica
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
              <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono Principal</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Dirección</label>
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
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
