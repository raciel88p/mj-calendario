'use client';

import { useState } from 'react';
import { initialAppointments, initialPatients } from '@/lib/data';
import { BarChart3, Download, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

export default function ReportesPage() {
  const [appointments] = useState(initialAppointments);
  const [patients] = useState(initialPatients);

  const totalRevenue = appointments.reduce((sum, a) => sum + a.deposit, 0);
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
            Reportes & Ventas
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Análisis de ingresos, pacientes frecuentes y exportación de datos.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm rounded-xl shadow-sm hover:opacity-90 transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar Reporte Excel/CSV
        </button>
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
