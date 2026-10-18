'use client';

import { useState } from 'react';
import { initialAppointments, initialPatients } from '@/lib/data';
import { BarChart3, Download, TrendingUp, Users, DollarSign, Calendar, Target, Award, UserCheck, Plus, Edit, Trash2, Settings, X, CheckCircle2, Sparkles } from 'lucide-react';

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

  // Global Clinic Sales Target State
  const [globalSalesTarget, setGlobalSalesTarget] = useState(5000000); // ₡5,000,000 default
  const [isGlobalTargetModalOpen, setIsGlobalTargetModalOpen] = useState(false);
  const [tempGlobalTarget, setTempGlobalTarget] = useState(5000000);

  // 6 Clinic Assistants State + CRUD
  const [assistants, setAssistants] = useState<AssistantTarget[]>([
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

  // Modal State for Assistant CRUD & Goal Configuration
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsist, setSelectedAsist] = useState<AssistantTarget | null>(null);
  const [asistName, setAsistName] = useState('');
  const [targetAmount, setTargetAmount] = useState(850000);
  const [currentSales, setCurrentSales] = useState(500000);
  const [completedAppointments, setCompletedAppointments] = useState(15);
  const [conversionRate, setConversionRate] = useState(90);

  // Dynamic calculations
  const totalRevenue = assistants.reduce((sum, a) => sum + a.currentSales, 0);
  const targetProgressPct = Math.min(Math.round((totalRevenue / (globalSalesTarget || 1)) * 100), 100);

  const totalPending = appointments.reduce((sum, a) => sum + (a.price - a.deposit), 0);
  const totalAppointments = appointments.length;

  const openNewAssistantModal = () => {
    setSelectedAsist(null);
    setAsistName(`Asistente ${assistants.length + 1} - `);
    setTargetAmount(850000);
    setCurrentSales(0);
    setCompletedAppointments(0);
    setConversionRate(85);
    setIsModalOpen(true);
  };

  const handleSaveAssistant = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAsist) {
      setAssistants(
        assistants.map((a) =>
          a.id === selectedAsist.id
            ? {
                ...a,
                name: asistName,
                targetAmount: Number(targetAmount),
                currentSales: Number(currentSales),
                completedAppointments: Number(completedAppointments),
                conversionRate: Number(conversionRate),
              }
            : a
        )
      );
    } else {
      const newAsist: AssistantTarget = {
        id: `asist-${Date.now()}`,
        name: asistName,
        targetAmount: Number(targetAmount),
        currentSales: Number(currentSales),
        completedAppointments: Number(completedAppointments),
        conversionRate: Number(conversionRate),
      };
      setAssistants([...assistants, newAsist]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteAssistant = (id: string) => {
    setAssistants(assistants.filter((a) => a.id !== id));
  };

  const handleSaveGlobalTarget = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalSalesTarget(Number(tempGlobalTarget));
    setIsGlobalTargetModalOpen(false);
  };

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
            Reportes, Metas de Ventas & Administrador de Asistentes
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configuración de meta global de ventas (₡) y gestión de asistentes con metas individuales.
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

      {/* 1. SECCIÓN DESTACADA: META GLOBAL DE VENTAS DE LA ESTÉTICA */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 rounded-2xl p-6 border border-emerald-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Configuración de Metas</span>
              <h2 className="text-xl font-bold text-gray-800">Meta Global de Ventas de la Clínica</h2>
              <p className="text-xs text-gray-500">Objetivo acumulado de ventas mensuales para toda MJ Estética</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-2xl font-extrabold text-emerald-700">₡{totalRevenue.toLocaleString()}</span>
              <span className="text-xs text-gray-500 font-bold block">
                de ₡{globalSalesTarget.toLocaleString()} Meta Mensual
              </span>
            </div>

            {/* BOTÓN DESTACADO PARA MODIFICAR META GLOBAL */}
            <button
              onClick={() => {
                setTempGlobalTarget(globalSalesTarget);
                setIsGlobalTargetModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Modificar Meta Global
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-gray-700">
            <span>Cumplimiento del Objetivo General</span>
            <span className="text-emerald-700 font-extrabold">{targetProgressPct}% Completado</span>
          </div>
          <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden p-0.5 border border-emerald-200">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${targetProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. SECCIÓN DESTACADA: ADMINISTRADOR DE ASISTENTES */}
      <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          <div>
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              Administrador de Asistentes & Metas Individuales ({assistants.length})
            </h2>
            <p className="text-xs text-gray-500">Cree asistentes, guarde cambios, edite las metas individuales en colones (₡) y revise la eficacia.</p>
          </div>

          <button
            onClick={openNewAssistantModal}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Agregar Nueva Asistente
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assistants.map((asist) => {
            const pct = asist.targetAmount > 0 ? Math.min(Math.round((asist.currentSales / asist.targetAmount) * 100), 100) : 0;

            return (
              <div key={asist.id} className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition space-y-3 bg-slate-50/50 relative shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-sm truncate max-w-[170px]">{asist.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {asist.conversionRate}% Eficiencia
                  </span>
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <p className="flex justify-between">
                    <span>Ventas Logradas:</span>
                    <strong className="text-emerald-700 font-extrabold">₡{asist.currentSales.toLocaleString()}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Meta Asignada:</span>
                    <strong className="text-gray-900 font-bold">₡{asist.targetAmount.toLocaleString()}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Citas Atendidas:</span>
                    <strong>{asist.completedAppointments} citas</strong>
                  </p>
                </div>

                {/* Progress bar per assistant */}
                <div className="space-y-1 pt-1 border-t border-gray-200">
                  <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                    <span>Cumplimiento de Meta</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-gray-200 flex justify-end gap-2 text-xs">
                  <button
                    onClick={() => {
                      setSelectedAsist(asist);
                      setAsistName(asist.name);
                      setTargetAmount(asist.targetAmount);
                      setCurrentSales(asist.currentSales);
                      setCompletedAppointments(asist.completedAppointments);
                      setConversionRate(asist.conversionRate);
                      setIsModalOpen(true);
                    }}
                    className="px-2.5 py-1 text-purple-700 hover:bg-purple-50 rounded font-bold flex items-center gap-1 border border-purple-200"
                  >
                    <Edit className="w-3.5 h-3.5" /> Modificar Meta
                  </button>
                  <button
                    onClick={() => handleDeleteAssistant(asist.id)}
                    className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metrics Summary Row */}
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

      {/* Modal Editar Meta Global de Ventas */}
      {isGlobalTargetModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Modificar Meta Global de Ventas
              </h3>
              <button onClick={() => setIsGlobalTargetModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGlobalTarget} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nueva Meta Global Mensual de la Estética (₡) *
                </label>
                <input
                  type="number"
                  required
                  value={tempGlobalTarget}
                  onChange={(e) => setTempGlobalTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 font-extrabold text-emerald-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsGlobalTargetModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-2xs"
                >
                  Guardar Meta Global
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Configurar / Crear Asistente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-purple-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">
                {selectedAsist ? 'Guardar Cambios en Asistente' : 'Agregar Nueva Asistente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssistant} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre de la Asistente *</label>
                <input
                  type="text"
                  required
                  value={asistName}
                  onChange={(e) => setAsistName(e.target.value)}
                  placeholder="Ej. Asistente 7 - Lucía Morales"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Meta de Ventas Individual (₡) *</label>
                <input
                  type="number"
                  required
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  placeholder="850000"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-600 font-bold text-emerald-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ventas Logradas (₡)</label>
                  <input
                    type="number"
                    value={currentSales}
                    onChange={(e) => setCurrentSales(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Citas Atendidas</label>
                  <input
                    type="number"
                    value={completedAppointments}
                    onChange={(e) => setCompletedAppointments(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Eficacia / Conversión (%)</label>
                <input
                  type="number"
                  max={100}
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
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
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
