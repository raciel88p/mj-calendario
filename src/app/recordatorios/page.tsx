'use client';

import { useState } from 'react';
import { initialAppointments, buildWhatsAppLink } from '@/lib/data';
import { MessageCircle, ExternalLink, Send, CheckCircle2, Gift, Sparkles } from 'lucide-react';

export default function RecordatoriosPage() {
  const [templateType, setTemplateType] = useState<
    'Recordatorio' | 'Confirmacion' | 'Cancelacion' | 'Reagendado' | 'Cumpleanos' | 'Promocion'
  >('Recordatorio');

  const [appointments] = useState(initialAppointments);

  const getMessageText = (patientName: string, treatmentName: string) => {
    switch (templateType) {
      case 'Recordatorio':
        return `Hola ${patientName}. Le recordamos su cita de ${treatmentName} mañana en MJ Estética. ¡Le esperamos con gusto! ✨`;
      case 'Confirmacion':
        return `Hola ${patientName}. Le confirmamos que su cita de ${treatmentName} ha sido reservada con éxito en MJ Estética. 🌸`;
      case 'Cancelacion':
        return `Hola ${patientName}. Su cita de ${treatmentName} ha sido cancelada. Si desea reagendar, responda a este mensaje. 🌿`;
      case 'Reagendado':
        return `Hola ${patientName}. Su cita de ${treatmentName} ha sido reagendada exitosamente en MJ Estética. 🌸`;
      case 'Cumpleanos':
        return `¡Feliz cumpleaños ${patientName}! 🎉 De parte de todo el equipo de MJ Estética, le enviamos un abrazo y un 20% de descuento en su próximo tratamiento. 🎂`;
      case 'Promocion':
        return `Hola ${patientName}. 🌸 Aproveche nuestra promoción especial del mes en MJ Estética. ¡Reserve su espacio hoy mismo! ✨`;
      default:
        return `Hola ${patientName}. Saludos de MJ Estética.`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-emerald-500" />
            Centro de Recordatorios WhatsApp
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Generación de enlaces manuales supervisados para envio rápido vía WhatsApp.
          </p>
        </div>
      </div>

      {/* Template Selector Tabs */}
      <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex flex-wrap gap-2">
        {(['Recordatorio', 'Confirmacion', 'Cancelacion', 'Reagendado', 'Cumpleanos', 'Promocion'] as const).map(
          (type) => (
            <button
              key={type}
              onClick={() => setTemplateType(type)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                templateType === type
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type}
            </button>
          )
        )}
      </div>

      {/* WhatsApp Action List */}
      <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm space-y-4">
        <h2 className="font-bold text-gray-800 text-base">Pacientes para envío de mensaje ({templateType})</h2>

        <div className="space-y-3">
          {appointments.map((apt) => {
            const message = getMessageText(apt.patientName || 'Paciente', apt.treatmentName || 'Tratamiento');
            const waUrl = buildWhatsAppLink(apt.patientPhone || '50688888888', message);

            return (
              <div
                key={apt.id}
                className="p-4 rounded-xl border border-gray-100 hover:border-emerald-200 transition bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-sm">{apt.patientName}</span>
                    <span className="text-xs text-gray-400">({apt.patientPhone})</span>
                  </div>
                  <p className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                    &quot;{message}&quot;
                  </p>
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 self-start md:self-auto shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Abrir WhatsApp
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
