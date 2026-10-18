'use client';

import { useState } from 'react';
import { initialAppointments, initialPatients } from '@/lib/data';
import { BarChart3, Download, TrendingUp, Users, DollarSign, Calendar, Target, Award, UserCheck } from 'lucide-react';

interface AssistantTarget {
  id: string;
  name: string;
  targetAmount: number;
  currentSales: number;
  completedAppointments: number;
  conversionRate: number;
}

export default function ReportesPage() {
  const [appointments] = useState(initialAppointments);
  const [patients] = useState(initialPatients);

  // Monthly Sales Target
  const monthlyTeamTarget = 5000000; // ₡5,000,000
  const totalRevenue = appointments.reduce((sum, a) => sum + a.deposit, 0) + 1850000; // Total actual sales
  const targetProgressPct = Math.min(Math.round((totalRevenue / monthlyTeamTarget) * 100), 100);

  // 6 Clinic Assistants Performance & Efficiency
  const [assistants] = useState<AssistantTarget[]>([
    {
      id: 'asist-1',
      name: 'Asistente 1 - Valeria Castro',
      targetAmount: 850000,
      currentSales: 720000,
      completedAppointments: 24,
      conversionRate: 92,
    },
    {
      id: 'asist-2',
      name: 'Asistente 2 - Daniela Solano',
      targetAmount: 850000,
      currentSales: 680000,
      completedAppointments: 21,
      conversionRate: 88,
    },
    {
      id: 'asist-3',
      name: 'Asistente 3 - Camila Vargas',
      targetAmount: 800000,
      currentSales: 590000,
      completedAppointments: 18,
      conversionRate: 84,
    },
    {
      id: 'asist-4',
      name: 'Asistente 4 - Andrea Jiménez',
      targetAmount: 800000,
      currentSales: 610000,
      completedAppointments: 19,
      conversionRate: 85,
    },
    {
      id: 'asist-5',
      name: 'Asistente 5 - Sofía Monge',
      targetAmount: 850000,
      currentSales: 750000,
      completedAppointments: 25,
      conversionRate: 95,
    },
    {
      id: 'asist-6',
      name: 'Asistente 6 - Nicole Bolaños',
      targetAmount: 850000,
      currentSales: 700000,
      completedAppointments: 22,
      conversionRate: 90,
    },
  ]);

  const totalPending = appointments.reduce((sum, a) => sum + (a.price - a.deposit), 0);
  const totalAppointments = appointments.length;

  const handleExportCSV = () => {
    const headers = ['ID', 'Paciente', 'Tratamiento', 'Precio', 'Abono', 'Estado', 'Fecha'];
    const rows = appointments.map((a) => [
      a.id,
      `"${a.patientName}"`,
      `"${a.treatmentName}"`,
      a.price,
      a.deposit,
      a.status,
      a.dateTime,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_mj_estetica_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-pink-500" />
            Reportes, Metas de Ventas & Eficiencia de Asistentes
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Métricas de ingresos, seguimiento de metas mensuales y evaluación del equipo interno.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm rounded-xl shadow-sm hover:opacity-90 transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar Reporte CSV
        </button>
      </div>

      {/* Monthly Team Sales Target Widget */}
      <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-800">Meta de Ventas Mensuales de la Clínica</h2>
              <p className="text-xs text-gray-500">Objetivo acumulado del equipo de asistentes e ingresos generales</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-emerald-600">₡{totalRevenue.toLocaleString()}</span>
            <span className="text-xs text-gray-400 font-semibold block">/ ₡{monthlyTeamTarget.toLocaleString()} Meta</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-gray-700">
            <span>Progreso General</span>
            <span>{targetProgressPct}% Completado</span>
          </div>
          <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden p-0.5 border border-gray-200">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${targetProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 6 Assistants Performance Section */}
      <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="font-bold text-gray-800 text-base flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" />
            Rendimiento & Eficiencia de las 6 Asistentes Internas
          </h2>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
            Equipo Interno
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assistants.map((asist) => {
            const pct = Math.min(Math.round((asist.currentSales / asist.targetAmount) * 100), 100);

            return (
              <div key={asist.id} className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition space-y-3 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-sm">{asist.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                    {asist.conversionRate}% Eficiencia
                  </span>
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <p className="flex justify-between">
                    <span>Ventas Logradas:</span>
                    <strong className="text-gray-800">₡{asist.currentSales.toLocaleString()}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Meta Asignada:</span>
                    <span>₡{asist.targetAmount.toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Citas Atendidas:</span>
                    <strong>{asist.completedAppointments} citas</strong>
                  </p>
                </div>

                {/* Progress bar per assistant */}
                <div className="space-y-1 pt-1 border-t border-gray-200">
                  <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                    <span>Cumplimiento Meta</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase">Total Ingresos Recaudados</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">₡{totalRevenue.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase">Saldo Pendiente por Cobrar</p>
          <h3 className="text-2xl font-bold text-rose-500 mt-1">₡{totalPending.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase">Total Citas Atendidas</p>
          <h3 className="text-2xl font-bold text-amber-500 mt-1">{totalAppointments}</h3>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-gray-800 text-base">Desglose de Ventas y Tratamientos</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                <th className="py-3 px-2">Paciente</th>
                <th className="py-3 px-2">Tratamiento</th>
                <th className="py-3 px-2">Precio Total</th>
                <th className="py-3 px-2">Abono Realizado</th>
                <th className="py-3 px-2">Saldo Pendiente</th>
                <th className="py-3 px-2">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {appointments.map((a) => (
                <tr key={a.id} className="hover:bg-rose-50/50 transition">
                  <td className="py-3 px-2 font-medium text-gray-800">{a.patientName}</td>
                  <td className="py-3 px-2">{a.treatmentName}</td>
                  <td className="py-3 px-2 font-bold">₡{a.price.toLocaleString()}</td>
                  <td className="py-3 px-2 text-emerald-600 font-semibold">₡{a.deposit.toLocaleString()}</td>
                  <td className="py-3 px-2 text-rose-500 font-semibold">₡{(a.price - a.deposit).toLocaleString()}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-600">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
