'use client';

import { useState, useEffect } from 'react';
import { initialPatients, initialCRMInteractions, buildWhatsAppLink } from '@/lib/data';
import { Patient, CRMInteraction } from '@/types';
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Download,
  Copy,
  RotateCcw,
  ChevronDown,
  X,
  MessageCircle,
  Facebook,
  Instagram,
  Globe,
  Star,
  CheckCircle2,
  DollarSign,
  Calendar,
  SlidersHorizontal
} from 'lucide-react';

const STAGES: Patient['crmStage'][] = [
  'Nuevo Lead',
  'Contactado',
  'Cita Agendada',
  'Cliente Fidelizado',
  'Inactivo',
];

interface DealItem {
  id: string;
  title: string;
  patientName: string;
  cedula: string;
  email: string;
  phone: string;
  whatsapp: string;
  value: number;
  stage: Patient['crmStage'];
  owner: string;
  closeDate: string;
  channel: 'WhatsApp' | 'Messenger' | 'Instagram' | 'Formulario Web';
  hasMembership: boolean;
}

export default function CRMPage() {
  const [activeSubTab, setActiveSubTab] = useState<'Todos' | 'Mis'>('Mis');
  const [viewMode, setViewMode] = useState<'Kanban' | 'Tabla'>('Kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwnerFilter, setSelectedOwnerFilter] = useState('Todos');

  const DEFAULT_DEALS: DealItem[] = [];

  // Deals State with database sync
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crm');
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setDeals(data.data);
      }
    } catch (e) {
      console.error('Error fetching CRM deals:', e);
    } finally {
      setLoading(false);
    }
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealTitle, setDealTitle] = useState('');
  const [patientName, setPatientName] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [value, setValue] = useState(45000);
  const [stage, setStage] = useState<Patient['crmStage']>('Nuevo Lead');
  const [owner, setOwner] = useState('Dra. María José');
  const [channel, setChannel] = useState<DealItem['channel']>('Formulario Web');
  const [hasMembership, setHasMembership] = useState(false);

  useEffect(() => {
    fetchDeals();
    if (typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem('mj_draft_crm');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft.dealTitle) setDealTitle(draft.dealTitle);
          if (draft.patientName) setPatientName(draft.patientName);
          if (draft.cedula) setCedula(draft.cedula);
          if (draft.email) setEmail(draft.email);
          if (draft.phone) setPhone(draft.phone);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && (dealTitle || patientName || cedula)) {
      localStorage.setItem(
        'mj_draft_crm',
        JSON.stringify({ dealTitle, patientName, cedula, email, phone })
      );
    }
  }, [dealTitle, patientName, cedula, email, phone]);

  const filteredDeals = deals.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.cedula.includes(searchQuery);

    const matchesTab = activeSubTab === 'Mis' ? d.owner === 'Dra. María José' : true;
    const matchesOwner = selectedOwnerFilter === 'Todos' ? true : d.owner === selectedOwnerFilter;

    return matchesSearch && matchesTab && matchesOwner;
  });

  const moveDealStage = async (dealId: string, newStage: Patient['crmStage']) => {
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)));
    try {
      await fetch('/api/crm', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: dealId, stage: newStage }),
      });
    } catch (e) {
      console.error('Error updating deal stage in BD:', e);
    }
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: dealTitle || 'Nuevo Negocio Estético',
      patientName: patientName.toUpperCase(),
      cedula,
      email,
      phone,
      whatsapp: phone.replace(/\D/g, ''),
      value: Number(value),
      stage,
      owner,
      channel,
      hasMembership,
    };

    try {
      const res = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDeals([data.data, ...deals]);
      } else {
        const newDeal: DealItem = {
          id: `deal-${Date.now()}`,
          ...payload,
          closeDate: '2026-11-30',
        };
        setDeals([newDeal, ...deals]);
      }
    } catch (e) {
      console.error(e);
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('mj_draft_crm');
    }
    setIsModalOpen(false);
    setDealTitle('');
    setPatientName('');
    setCedula('');
    setEmail('');
    setPhone('');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Negocio', 'Cliente', 'Cédula', 'Correo', 'Teléfono', 'Valor', 'Etapa', 'Propietario', 'Canal'];
    const rows = deals.map((d) => [
      d.id,
      `"${d.title}"`,
      `"${d.patientName}"`,
      d.cedula,
      d.email,
      d.phone,
      d.value,
      d.stage,
      d.owner,
      d.channel,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `negocios_crm_mj_estetica_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getChannelIcon = (ch: DealItem['channel']) => {
    switch (ch) {
      case 'Messenger':
        return <Facebook className="w-3.5 h-3.5 text-blue-600" />;
      case 'Instagram':
        return <Instagram className="w-3.5 h-3.5 text-pink-600" />;
      case 'Formulario Web':
        return <Globe className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col min-h-[85vh]">
      {/* Top Header Title & Tabs */}
      <div className="border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Negocios</h1>
            <ChevronDown className="w-5 h-5 text-gray-500 cursor-pointer" />
          </div>

          {/* Subtabs */}
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-gray-600">
            <button
              onClick={() => setActiveSubTab('Todos')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeSubTab === 'Todos' ? 'bg-white text-gray-900 shadow-2xs border border-gray-200 font-bold' : 'hover:bg-gray-100'
              }`}
            >
              Todos negocios ({deals.length})
            </button>
            <button
              onClick={() => setActiveSubTab('Mis')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeSubTab === 'Mis' ? 'bg-white text-gray-900 shadow-2xs border border-gray-200 font-bold' : 'hover:bg-gray-100'
              }`}
            >
              Mis negocios ({deals.filter((d) => d.owner === 'Dra. María José').length})
            </button>
            <button onClick={() => setIsModalOpen(true)} className="p-1 hover:bg-gray-100 rounded text-gray-400">
              +
            </button>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                const savedDraft = localStorage.getItem('mj_draft_crm');
                if (savedDraft) {
                  try {
                    const draft = JSON.parse(savedDraft);
                    if (draft.dealTitle) setDealTitle(draft.dealTitle);
                    if (draft.patientName) setPatientName(draft.patientName);
                    if (draft.cedula) setCedula(draft.cedula);
                    if (draft.email) setEmail(draft.email);
                    if (draft.phone) setPhone(draft.phone);
                  } catch (e) {
                    console.error(e);
                  }
                }
              }
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-2"
          >
            Agregar negocios <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="border-b border-gray-200 px-6 py-3 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Filter Inputs & Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar (/ )"
              className="pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 w-44"
            />
          </div>

          <button className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-200 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            Filtro (1)
          </button>

          {/* Owner filter chip */}
          <select
            value={selectedOwnerFilter}
            onChange={(e) => setSelectedOwnerFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none"
          >
            <option value="Todos">Propietario del negocio (Todos)</option>
            <option value="Dra. María José">Dra. María José</option>
            <option value="Recepción Estética">Recepción Estética</option>
          </select>

          <span className="text-gray-400 text-xs cursor-pointer hover:underline" onClick={() => setSelectedOwnerFilter('Todos')}>
            Borrar todo
          </span>
        </div>

        {/* Right View Switcher & Pipeline selector */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-lg font-bold text-gray-700">
            Pipeline de ventas ⌄
          </span>

          <div className="bg-gray-100 p-1 rounded-xl flex gap-1 border border-gray-200">
            <button
              onClick={() => setViewMode('Kanban')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'Kanban' ? 'bg-white shadow-2xs text-gray-900' : 'text-gray-500'}`}
              title="Vista Kanban"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('Tabla')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'Tabla' ? 'bg-white shadow-2xs text-gray-900' : 'text-gray-500'}`}
              title="Vista Tabla"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Deals Content View */}
      <div className="flex-1 p-6 bg-slate-50/30 overflow-y-auto">
        {filteredDeals.length === 0 ? (
          /* Empty State matching user screenshot */
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shadow-2xs">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              No hay Negocios que coincidan con los filtros actuales.
            </h3>
            <p className="text-xs text-gray-500">
              Si esperabas ver nuevos elementos del tipo &quot;Negocios&quot;, inténtalo de nuevo en unos segundos o presiona Agregar Negocio.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-emerald-800 transition"
            >
              + Agregar Nuevo Negocio
            </button>
          </div>
        ) : viewMode === 'Kanban' ? (
          /* Kanban Board View */
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {STAGES.map((stageName) => {
              const stageDeals = filteredDeals.filter((d) => d.stage === stageName);
              const totalStageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

              return (
                <div
                  key={stageName}
                  className="bg-slate-100/70 p-4 rounded-2xl border border-gray-200 flex flex-col space-y-3 min-w-[230px]"
                >
                  <div className="border-b border-gray-200 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-gray-800 uppercase tracking-tight">{stageName}</span>
                      <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-600">
                        {stageDeals.length}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-emerald-700 mt-1">₡{totalStageValue.toLocaleString()}</p>
                  </div>

                  <div className="space-y-3 flex-1">
                    {stageDeals.map((d) => (
                      <div
                        key={d.id}
                        className={`bg-white p-4 rounded-xl border shadow-2xs space-y-2 hover:border-emerald-500 transition cursor-pointer relative ${
                          d.hasMembership ? 'border-amber-300 ring-1 ring-amber-200' : 'border-gray-200'
                        }`}
                      >
                        {d.hasMembership && (
                          <span className="absolute -top-2 right-2 bg-amber-400 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded shadow-2xs flex items-center gap-0.5 uppercase">
                            <Star className="w-2.5 h-2.5 fill-white" /> MJ VIP
                          </span>
                        )}

                        <div className="flex items-center gap-1.5 text-xs">
                          {getChannelIcon(d.channel)}
                          <span className="font-extrabold text-gray-900 text-xs line-clamp-1">{d.title}</span>
                        </div>

                        <div className="text-[11px] text-gray-600 space-y-0.5 border-t border-gray-100 pt-2">
                          <p className="font-bold text-gray-800 uppercase">{d.patientName}</p>
                          <p>🪪 {d.cedula}</p>
                          <p className="text-emerald-700 font-extrabold text-xs mt-1">₡{d.value.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-400">Propietario: {d.owner}</p>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                          <a
                            href={buildWhatsAppLink(d.whatsapp, `Hola ${d.patientName}, le saludamos de MJ Estética.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition"
                            title="Responder por WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          <select
                            value={d.stage}
                            onChange={(e) => moveDealStage(d.id, e.target.value as any)}
                            className="text-[10px] bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 font-medium text-gray-700"
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s}>
                                {s}
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
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                  <th className="py-3 px-3">Negocio</th>
                  <th className="py-3 px-3">Cliente</th>
                  <th className="py-3 px-3">Cédula</th>
                  <th className="py-3 px-3">Valor (₡)</th>
                  <th className="py-3 px-3">Etapa</th>
                  <th className="py-3 px-3">Propietario</th>
                  <th className="py-3 px-3">Canal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredDeals.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-bold text-gray-900">{d.title}</td>
                    <td className="py-3 px-3 uppercase font-semibold">{d.patientName}</td>
                    <td className="py-3 px-3">{d.cedula}</td>
                    <td className="py-3 px-3 font-extrabold text-emerald-700">₡{d.value.toLocaleString()}</td>
                    <td className="py-3 px-3 font-bold text-purple-700">{d.stage}</td>
                    <td className="py-3 px-3">{d.owner}</td>
                    <td className="py-3 px-3 flex items-center gap-1">
                      {getChannelIcon(d.channel)} {d.channel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Action Footer matching screenshot */}
      <div className="border-t border-gray-200 px-6 py-3 bg-white flex items-center justify-between text-xs text-gray-600">
        <span className="px-3 py-1 bg-gray-100 rounded-full font-bold text-gray-700">
          {filteredDeals.length} negocios
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
          <button className="px-3 py-1.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold flex items-center gap-1">
            <Copy className="w-3.5 h-3.5" /> Clonar
          </button>
        </div>
      </div>

      {/* Agregar Negocio Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-700" /> Agregar Nuevo Negocio CRM
            </h3>

            <form onSubmit={handleCreateDeal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre del Negocio / Servicio *</label>
                <input
                  type="text"
                  required
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  placeholder="Ej. Paquete Facial + Láser Diodo"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre del Cliente *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Ej. KAREN SOLANO MORA"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600 uppercase font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Cédula *</label>
                  <input
                    type="text"
                    required
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    placeholder="1-1234-0567"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Valor Estimado (₡) *</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Propietario</label>
                  <select
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Dra. María José">Dra. María José</option>
                    <option value="Recepción Estética">Recepción Estética</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Etapa Inicial</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Canal de Origen</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Formulario Web">Formulario Web</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Instagram">Instagram Direct</option>
                    <option value="Messenger">Facebook Messenger</option>
                  </select>
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
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 shadow-2xs"
                >
                  Guardar Negocio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
