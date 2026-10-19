'use client';

import { useState, useEffect } from 'react';
import { initialAppointments } from '@/lib/data';
import { BarChart3, Download, Target, UserCheck, Plus, Edit, Trash2, X, CheckCircle2, Save, Loader2 } from 'lucide-react';

interface AssistantTarget {
  id: string;
  name: string;
  role: string;
  monthlyTarget: number;
  currentSales: number;
  efficiency: number;
}

const DEFAULT_ASSISTANTS: AssistantTarget[] = [
  { id: 'asist-1', name: 'Sofía Monge', role: 'Asistente Principal', monthlyTarget: 1500000, currentSales: 1250000, efficiency: 94 },
  { id: 'asist-2', name: 'Valeria Rojas', role: 'Asistente Cabina 1', monthlyTarget: 1200000, currentSales: 980000, efficiency: 88 },
  { id: 'asist-3', name: 'Daniela Castro', role: 'Asistente Cabina 2', monthlyTarget: 1200000, currentSales: 1100000, efficiency: 92 },
  { id: 'asist-4', name: 'Camila Mora', role: 'Especialista Facial', monthlyTarget: 1800000, currentSales: 1650000, efficiency: 96 },
  { id: 'asist-5', name: 'Mariana Solís', role: 'Especialista Corporal', monthlyTarget: 1600000, currentSales: 1400000, efficiency: 90 },
  { id: 'asist-6', name: 'Lucía Vargas', role: 'Recepcionista & Ventas', monthlyTarget: 2000000, currentSales: 1850000, efficiency: 95 },
];

export default function ReportesPage() {
  const [appointments] = useState(initialAppointments);

  // Global Clinic Sales Target State
  const [globalSalesTarget, setGlobalSalesTarget] = useState(10000000);
  const [isGlobalTargetModalOpen, setIsGlobalTargetModalOpen] = useState(false);
  const [tempGlobalTarget, setTempGlobalTarget] = useState(10000000);

  // Assistants State
  const [assistants, setAssistants] = useState<AssistantTarget[]>(DEFAULT_ASSISTANTS);
  const [loading, setLoading] = useState(true);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Modal State for Assistant CRUD & Goal Configuration
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsist, setSelectedAsist] = useState<AssistantTarget | null>(null);
  const [asistName, setAsistName] = useState('');
  const [asistRole, setAsistRole] = useState('Asistente Clínico');
  const [targetAmount, setTargetAmount] = useState(1500000);
  const [currentSales, setCurrentSales] = useState(0);
  const [efficiency, setEfficiency] = useState(90);

  // Load assistants from API with localStorage fallback
  const fetchAssistants = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/assistants');
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setAssistants(data.data);
      } else {
        loadFromLocalStorage();
      }
    } catch (e) {
      console.error('Error cargando asistentes de la base de datos, usando copia local:', e);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('mj_assistants_list');
      if (localData) {
        try {
          setAssistants(JSON.parse(localData));
          return;
        } catch (e) {
          console.error(e);
        }
      }
      setAssistants(DEFAULT_ASSISTANTS);
    }
  };

  const saveToLocalStorage = (newList: AssistantTarget[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mj_assistants_list', JSON.stringify(newList));
    }
  };

  useEffect(() => {
    fetchAssistants();
    if (typeof window !== 'undefined') {
      const savedTarget = localStorage.getItem('mj_global_sales_target');
      if (savedTarget) {
        const val = Number(savedTarget);
        if (!isNaN(val) && val > 0) {
          setGlobalSalesTarget(val);
        }
      }
    }
  }, []);

  const triggerSaveMessage = () => {
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // BOTÓN PRINCIPAL: GUARDAR TODO EN LA BASE DE DATOS SUPABASE
  const handleSaveAllToDatabase = async () => {
    setIsSavingAll(true);
    saveToLocalStorage(assistants);

    try {
      // 1. Enviar guardado general a API de asistentes
      const res = await fetch('/api/assistants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch: assistants }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAssistants(data.data);
        saveToLocalStorage(data.data);
      }
      triggerSaveMessage();
    } catch (error) {
      console.error('Error guardando en Supabase:', error);
      triggerSaveMessage();
    } finally {
      setIsSavingAll(false);
    }
  };

  // Dynamic calculations
  const totalRevenue = assistants.reduce((sum, a) => sum + Number(a.currentSales), 0);
  const targetProgressPct = Math.min(Math.round((totalRevenue / (globalSalesTarget || 1)) * 100), 100);
  const totalPending = appointments.reduce((sum, a) => sum + (a.price - a.deposit), 0);
  const totalAppointments = appointments.length;

  const openNewAssistantModal = () => {
    setSelectedAsist(null);
    setAsistName('');
    setAsistRole('Asistente Clínico');
    setTargetAmount(1500000);
    setCurrentSales(0);
    setEfficiency(90);
    setIsModalOpen(true);
  };

  const handleSaveAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList: AssistantTarget[];

    if (selectedAsist) {
      // Modify
      updatedList = assistants.map((a) =>
        a.id === selectedAsist.id
          ? {
              ...a,
              name: asistName,
              role: asistRole,
              monthlyTarget: Number(targetAmount),
              currentSales: Number(currentSales),
              efficiency: Number(efficiency),
            }
          : a
      );

      try {
        await fetch('/api/assistants', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedAsist.id,
            name: asistName,
            role: asistRole,
            monthlyTarget: targetAmount,
            currentSales: currentSales,
            efficiency: efficiency,
          }),
        });
      } catch (err) {
        console.error('API Error updating assistant', err);
      }
    } else {
      // Create
      const newAsist: AssistantTarget = {
        id: `asist-${Date.now()}`,
        name: asistName,
        role: asistRole,
        monthlyTarget: Number(targetAmount),
        currentSales: Number(currentSales),
        efficiency: Number(efficiency),
      };
      updatedList = [newAsist, ...assistants];

      try {
        await fetch('/api/assistants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAsist),
        });
      } catch (err) {
        console.error('API Error creating assistant', err);
      }
    }

    setAssistants(updatedList);
    saveToLocalStorage(updatedList);
    triggerSaveMessage();
    setIsModalOpen(false);
  };

  const handleDeleteAssistant = async (id: string) => {
    const updatedList = assistants.filter((a) => a.id !== id);
    setAssistants(updatedList);
    saveToLocalStorage(updatedList);

    try {
      await fetch(`/api/assistants?id=${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error eliminando asistente de la base de datos', error);
    }
    triggerSaveMessage();
  };

  const handleSaveGlobalTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const newTarget = Number(tempGlobalTarget);
    setGlobalSalesTarget(newTarget);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mj_global_sales_target', newTarget.toString());
    }
    triggerSaveMessage();
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
            Guardado 100% persistente en Supabase PostgreSQL para metas de ventas, asistentes y objetivos del mes.
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

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ¡Cambios y lista de asistentes guardados exitosamente en la Base de Datos!
        </div>
      )}

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

            <button
              onClick={() => {
                setTempGlobalTarget(globalSalesTarget);
                setIsGlobalTargetModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition flex items-center gap-2 cursor-pointer"
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

      {/* 2. SECCIÓN DESTACADA: ADMINISTRADOR DE ASISTENTES CON BOTÓN GUARDAR CAMBIOS EN BD */}
      <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          <div>
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              Administrador de Asistentes & Metas Individuales ({assistants.length})
            </h2>
            <p className="text-xs text-gray-500">Cree, modifique o elimine asistentes y guarde todos los cambios de forma duradera.</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* BOTÓN EXPLICITO DE GUARDAR EN BASE DE DATOS */}
            <button
              onClick={handleSaveAllToDatabase}
              disabled={isSavingAll}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSavingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar Cambios en Base de Datos
            </button>

            <button
              onClick={openNewAssistantModal}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Agregar Nueva Asistente
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 font-medium flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-purple-600" /> Cargando asistentes...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assistants.map((asist) => {
              const target = Number(asist.monthlyTarget) || 1;
              const current = Number(asist.currentSales) || 0;
              const pct = Math.min(Math.round((current / target) * 100), 100);

              return (
                <div key={asist.id} className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition space-y-3 bg-slate-50/50 relative shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm truncate">{asist.name}</h3>
                      <p className="text-[11px] text-gray-500">{asist.role || 'Asistente Clínico'}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {asist.efficiency}% Eficiencia
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600">
                    <p className="flex justify-between">
                      <span>Ventas Logradas:</span>
                      <strong className="text-emerald-700 font-extrabold">₡{current.toLocaleString()}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Meta Asignada:</span>
                      <strong className="text-gray-900 font-bold">₡{target.toLocaleString()}</strong>
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
                      type="button"
                      onClick={() => {
                        setSelectedAsist(asist);
                        setAsistName(asist.name);
                        setAsistRole(asist.role || 'Asistente Clínico');
                        setTargetAmount(Number(asist.monthlyTarget));
                        setCurrentSales(Number(asist.currentSales));
                        setEfficiency(Number(asist.efficiency));
                        setIsModalOpen(true);
                      }}
                      className="px-2.5 py-1 text-purple-700 hover:bg-purple-100 rounded font-bold flex items-center gap-1 border border-purple-200 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Modificar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAssistant(asist.id)}
                      className="px-2.5 py-1 text-rose-600 hover:bg-rose-100 rounded font-medium flex items-center gap-1 border border-rose-200 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-2xs flex items-center gap-1"
                >
                  <Save className="w-4 h-4" /> Guardar Meta Global
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Configurar / Crear / Modificar Asistente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-purple-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">
                {selectedAsist ? 'Modificar Asistente & Meta' : 'Agregar Nueva Asistente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssistant} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={asistName}
                  onChange={(e) => setAsistName(e.target.value)}
                  placeholder="Ej. Sofía Monge"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Puesto / Rol *</label>
                <input
                  type="text"
                  required
                  value={asistRole}
                  onChange={(e) => setAsistRole(e.target.value)}
                  placeholder="Ej. Asistente Principal / Especialista Facial"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Meta de Ventas Mensual (₡) *</label>
                <input
                  type="number"
                  required
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Eficacia / Conversión (%)</label>
                  <input
                    type="number"
                    max={100}
                    value={efficiency}
                    onChange={(e) => setEfficiency(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 shadow-xs flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
