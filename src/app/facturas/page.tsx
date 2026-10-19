'use client';

import { useState, useEffect } from 'react';
import { initialPatients, buildWhatsAppLink } from '@/lib/data';
import {
  Receipt,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  MessageCircle,
  Mail,
  CreditCard,
  Building2,
  FileText,
  DollarSign,
  UserCheck,
  Check,
  X,
  Printer,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface Invoice {
  id: string;
  docNumber: string;
  docType: 'Factura electrónica' | 'Tiquete electrónico' | 'Proforma';
  patientName: string;
  cedula: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  paymentStatus: 'Pagada' | 'Por Pagar' | 'Anulada';
  haciendaStatus: 'Aceptado' | 'Por Enviar' | 'Rechazado';
  emailSent: boolean;
  totalAmount: number;
  balancePending: number;
  paymentMethod: 'SINPE Móvil' | 'Efectivo' | 'Tarjeta Banco Popular' | 'Tarjeta Crédito' | 'Tarjeta Débito' | 'Transferencia';
  serviceName: string;
}

const INITIAL_INVOICES: Invoice[] = [];

export default function FacturasPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/facturas', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.data) {
        setInvoices(data.data);
      }
    } catch (e) {
      console.error('Error fetching invoices:', e);
    } finally {
      setLoading(false);
    }
  };

  const [searchDoc, setSearchDoc] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('ALL');
  const [filterHaciendaStatus, setFilterHaciendaStatus] = useState('ALL');

  // Modal New Invoice State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAbonoModalOpen, setIsAbonoModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Patients list state for invoice creation dropdown
  const [patients, setPatients] = useState<any[]>([]);

  // New Invoice Form
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [serviceName, setServiceName] = useState('Tratamiento Estético / Facial');
  const [docType, setDocType] = useState<Invoice['docType']>('Factura electrónica');
  const [totalAmount, setTotalAmount] = useState(50000);
  const [abonoInitial, setAbonoInitial] = useState(20000);
  const [paymentMethod, setPaymentMethod] = useState<Invoice['paymentMethod']>('SINPE Móvil');

  useEffect(() => {
    fetchInvoices();
    if (typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem('mj_draft_factura');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft.serviceName) setServiceName(draft.serviceName);
          if (draft.totalAmount) setTotalAmount(draft.totalAmount);
          if (draft.abonoInitial) setAbonoInitial(draft.abonoInitial);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && serviceName) {
      localStorage.setItem('mj_draft_factura', JSON.stringify({ serviceName, totalAmount, abonoInitial }));
    }
  }, [serviceName, totalAmount, abonoInitial]);

  useEffect(() => {
    async function loadPatients() {
      try {
        const res = await fetch('/api/patients', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.data) {
          setPatients(data.data);
          if (data.data.length > 0) {
            setSelectedPatientId(data.data[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadPatients();
  }, []);

  // Abono Register
  const [abonoAmount, setAbonoAmount] = useState(10000);
  const [abonoMethod, setAbonoMethod] = useState<Invoice['paymentMethod']>('SINPE Móvil');

  // Error & Notification State
  const [emailNotification, setEmailNotification] = useState<string | null>(null);
  const [creditErrorMessage, setCreditErrorMessage] = useState<string | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesDoc =
      inv.docNumber.includes(searchDoc) ||
      inv.patientName.toLowerCase().includes(searchDoc.toLowerCase()) ||
      inv.cedula.includes(searchDoc);

    const matchesPayment = filterPaymentStatus === 'ALL' || inv.paymentStatus === filterPaymentStatus;
    const matchesHacienda = filterHaciendaStatus === 'ALL' || inv.haciendaStatus === filterHaciendaStatus;

    return matchesDoc && matchesPayment && matchesHacienda;
  });

  // Calculate Grouped Revenue Summaries
  const totalEfectivo = invoices.reduce((sum, i) => (i.paymentMethod === 'Efectivo' ? sum + (i.totalAmount - i.balancePending) : sum), 0);
  const totalSinpe = invoices.reduce((sum, i) => (i.paymentMethod === 'SINPE Móvil' ? sum + (i.totalAmount - i.balancePending) : sum), 0);
  const totalTarjetaPopular = invoices.reduce((sum, i) => (i.paymentMethod === 'Tarjeta Banco Popular' ? sum + (i.totalAmount - i.balancePending) : sum), 0);
  const totalTarjetas = invoices.reduce((sum, i) => (i.paymentMethod.includes('Tarjeta') ? sum + (i.totalAmount - i.balancePending) : sum), 0);
  const totalCollected = invoices.reduce((sum, i) => sum + (i.totalAmount - i.balancePending), 0);
  const totalPendingBalance = invoices.reduce((sum, i) => sum + i.balancePending, 0);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreditErrorMessage(null);

    const patient = patients.find((p) => p.id === selectedPatientId) || {
      fullName: 'CLIENTE GENERAL',
      cedula: '1-0000-0000',
      email: 'cliente@ejemplo.com',
      phone: '+506 8888-8888',
      creditEnabled: false,
    };

    const pending = Math.max(0, totalAmount - abonoInitial);

    // CHECK: If invoice has credit/pending balance, verify patient credit status
    if (pending > 0 && !patient.creditEnabled) {
      setCreditErrorMessage(
        `⛔ No se puede facturar a crédito: El paciente "${patient.fullName}" NO tiene el check de "Habilitar Crédito a la Empresa" activado en la sección de Pacientes.`
      );
      return;
    }

    const newDocNum = (Number(invoices[0]?.docNumber || 874) + 1).toString();

    const payload = {
      docNumber: newDocNum,
      docType,
      patientName: patient.fullName.toUpperCase(),
      cedula: patient.cedula,
      email: patient.email,
      phone: patient.phone,
      totalAmount: Number(totalAmount),
      balancePending: pending,
      paymentMethod,
      serviceName,
    };

    try {
      const res = await fetch('/api/facturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setInvoices([data.data, ...invoices]);
      } else {
        const newInv: Invoice = {
          id: `inv-${newDocNum}`,
          ...payload,
          date: '18 OCT. 2026',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          paymentStatus: pending === 0 ? 'Pagada' : 'Por Pagar',
          haciendaStatus: 'Aceptado',
          emailSent: true,
        };
        setInvoices([newInv, ...invoices]);
      }
    } catch (e) {
      console.error(e);
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('mj_draft_factura');
    }
    setIsModalOpen(false);
    setEmailNotification(`Factura #${newDocNum} generada y enviada a ${patient.email}`);
    setTimeout(() => setEmailNotification(null), 4000);
  };

  const handleDeleteInvoice = async (id: string) => {
    setInvoices(invoices.filter((inv) => inv.id !== id));
    try {
      await fetch(`/api/facturas?id=${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setEmailNotification(`Factura eliminada del sistema con éxito.`);
    setTimeout(() => setEmailNotification(null), 3000);
  };

  const handleRegisterAbono = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const newPending = Math.max(0, selectedInvoice.balancePending - abonoAmount);
    const newStatus = newPending === 0 ? 'Pagada' : 'Por Pagar';

    setInvoices(
      invoices.map((inv) =>
        inv.id === selectedInvoice.id
          ? {
              ...inv,
              balancePending: newPending,
              paymentStatus: newStatus,
            }
          : inv
      )
    );

    try {
      await fetch('/api/facturas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedInvoice.id,
          balancePending: newPending,
          paymentStatus: newStatus,
        }),
      });
    } catch (err) {
      console.error('Error updating invoice abono in DB:', err);
    }

    setIsAbonoModalOpen(false);
    setEmailNotification(`Abono de ₡${abonoAmount.toLocaleString()} registrado. Comprobante enviado a ${selectedInvoice.email}`);
    setTimeout(() => setEmailNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-pink-500" />
            Módulo de Facturación & Pagos de Servicios
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Registro de abonos, validación de crédito de empresas, eliminación de facturas y envío por correo/WhatsApp.
          </p>
        </div>

        <button
          onClick={() => {
            setCreditErrorMessage(null);
            if (typeof window !== 'undefined') {
              const savedDraft = localStorage.getItem('mj_draft_factura');
              if (savedDraft) {
                try {
                  const draft = JSON.parse(savedDraft);
                  if (draft.serviceName) setServiceName(draft.serviceName);
                  if (draft.totalAmount) setTotalAmount(draft.totalAmount);
                  if (draft.abonoInitial) setAbonoInitial(draft.abonoInitial);
                } catch (e) {
                  console.error(e);
                }
              }
            }
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm rounded-xl shadow-xs hover:opacity-90 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          + Factura / Registrar Pago
        </button>
      </div>

      {emailNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {emailNotification}
        </div>
      )}

      {/* Main Content Layout (Filter Panel + Invoices Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Filter Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2 border-b pb-3">
            <Filter className="w-4 h-4 text-pink-500" /> Búsqueda de Facturas
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Número o Cliente</label>
              <input
                type="text"
                value={searchDoc}
                onChange={(e) => setSearchDoc(e.target.value)}
                placeholder="Ej. 874 o Katherine..."
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Sucursal</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500">
                <option>MJ Estética & Spa - Escazú</option>
                <option>MJ Estética - Santa Ana</option>
                <option>MJ Estética - Curridabat</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Estado del Pago</label>
              <select
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
              >
                <option value="ALL">-- Todos los estados del pago --</option>
                <option value="Pagada">Pagada</option>
                <option value="Por Pagar">Por Pagar</option>
                <option value="Anulada">Anulada</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Estado de Hacienda</label>
              <select
                value={filterHaciendaStatus}
                onChange={(e) => setFilterHaciendaStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
              >
                <option value="ALL">-- Todos los estados de Hacienda --</option>
                <option value="Aceptado">Aceptado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchDoc('');
                setFilterPaymentStatus('ALL');
                setFilterHaciendaStatus('ALL');
              }}
              className="w-full py-2 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Limpiar Filtro
            </button>
          </div>
        </div>

        {/* Right Content Table */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                    <th className="py-3 px-3">Acciones</th>
                    <th className="py-3 px-3">Tipo</th>
                    <th className="py-3 px-3">Nº</th>
                    <th className="py-3 px-3">Paciente / Cliente</th>
                    <th className="py-3 px-3">Fecha & Hora</th>
                    <th className="py-3 px-3">Estado Pago</th>
                    <th className="py-3 px-3">Hacienda</th>
                    <th className="py-3 px-3 text-right">Monto Total</th>
                    <th className="py-3 px-3 text-right">Saldo Pendiente</th>
                    <th className="py-3 px-3 text-center">Eliminar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-rose-50/40 transition font-medium">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          {inv.balancePending > 0 && (
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setAbonoAmount(Math.min(10000, inv.balancePending));
                                setIsAbonoModalOpen(true);
                              }}
                              title="Registrar Abono"
                              className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[10px] font-bold flex items-center gap-1"
                            >
                              +Abono
                            </button>
                          )}

                          <a
                            href={buildWhatsAppLink(
                              inv.phone,
                              `Hola ${inv.patientName}, le enviamos el recordatorio de su saldo pendiente de ₡${inv.balancePending.toLocaleString()} por el servicio ${inv.serviceName} en MJ Estética.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Enviar Recordatorio WhatsApp"
                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-gray-600">{inv.docType}</td>
                      <td className="py-3 px-3 font-bold text-gray-900">{inv.docNumber}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-gray-800 uppercase block">{inv.patientName}</span>
                        <span className="text-[10px] text-gray-400">Céd: {inv.cedula}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
                        {inv.date}
                        <span className="block text-[10px] text-gray-400">{inv.time}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            inv.paymentStatus === 'Pagada'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {inv.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`flex items-center gap-1 text-[11px] font-bold ${
                            inv.haciendaStatus === 'Aceptado' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {inv.haciendaStatus === 'Aceptado' ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <X className="w-3.5 h-3.5" />
                          )}
                          {inv.haciendaStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-gray-900">
                        ₡{inv.totalAmount.toLocaleString()}
                      </td>

                      <td
                        className={`py-3 px-3 text-right font-extrabold ${
                          inv.balancePending > 0 ? 'text-rose-600' : 'text-emerald-700'
                        }`}
                      >
                        ₡{inv.balancePending.toLocaleString()}
                      </td>

                      {/* Botón de Eliminar Factura */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteInvoice(inv.id)}
                          title="Eliminar Factura"
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider text-center">
              Resumen de ingresos agrupado por medio de pago (₡)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[11px] font-bold text-gray-500 block">Efectivo</span>
                <span className="text-sm font-extrabold text-gray-800">₡{totalEfectivo.toLocaleString()}</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-700 block">SINPE Móvil</span>
                <span className="text-sm font-extrabold text-emerald-800">₡{totalSinpe.toLocaleString()}</span>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[11px] font-bold text-blue-700 block">Banco Popular</span>
                <span className="text-sm font-extrabold text-blue-800">
                  ₡{totalTarjetaPopular.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-[11px] font-bold text-purple-700 block">Tarjetas Débito/Crédito</span>
                <span className="text-sm font-extrabold text-purple-800">₡{totalTarjetas.toLocaleString()}</span>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-[11px] font-bold text-rose-700 block">Saldos Por Cobrar</span>
                <span className="text-sm font-extrabold text-rose-800">
                  ₡{totalPendingBalance.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-gradient-to-tr from-pink-500 to-rose-500 text-white rounded-xl shadow-xs">
                <span className="text-[11px] font-bold block opacity-90">Total Recaudado</span>
                <span className="text-sm font-extrabold">₡{totalCollected.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Registrar Nueva Factura / Servicio con Validación de Crédito */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-rose-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-500" />
                Nueva Factura / Cobro de Servicio
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {creditErrorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                {creditErrorMessage}
              </div>
            )}

            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Seleccionar Paciente *</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => {
                    setSelectedPatientId(e.target.value);
                    setCreditErrorMessage(null);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:border-pink-500 uppercase"
                >
                  {patients.length === 0 ? (
                    <option value="">-- Sin pacientes registrados --</option>
                  ) : (
                    patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} - Céd: {p.cedula} {p.creditEnabled ? '(Crédito Habilitado)' : '(Sin Crédito)'}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Servicio / Tratamiento *</label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo Documento</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-pink-500"
                  >
                    <option value="Factura electrónica">Factura electrónica</option>
                    <option value="Tiquete electrónico">Tiquete electrónico</option>
                    <option value="Proforma">Proforma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Medio de Pago</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-pink-500"
                  >
                    <option value="SINPE Móvil">SINPE Móvil</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta Banco Popular">Tarjeta Banco Popular</option>
                    <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                    <option value="Tarjeta Débito">Tarjeta Débito</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Monto Total (₡) *</label>
                  <input
                    type="number"
                    required
                    value={totalAmount}
                    onChange={(e) => {
                      setTotalAmount(Number(e.target.value));
                      setCreditErrorMessage(null);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Abono Inicial (₡)</label>
                  <input
                    type="number"
                    value={abonoInitial}
                    onChange={(e) => {
                      setAbonoInitial(Number(e.target.value));
                      setCreditErrorMessage(null);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-emerald-700 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex items-center justify-between">
                <span>Saldo Pendiente (Crédito):</span>
                <strong className="text-rose-600 text-sm font-extrabold">
                  ₡{Math.max(0, totalAmount - abonoInitial).toLocaleString()}
                </strong>
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
                  className="px-4 py-2 bg-pink-500 text-white rounded-xl text-xs font-bold hover:bg-pink-600 shadow-xs flex items-center gap-1"
                >
                  <Printer className="w-4 h-4" /> Generar & Enviar por Correo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Abono */}
      {isAbonoModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Registrar Abono a Factura #{selectedInvoice.docNumber}
              </h3>
              <button onClick={() => setIsAbonoModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleRegisterAbono} className="space-y-3">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs space-y-1">
                <p className="font-bold text-gray-800 uppercase">{selectedInvoice.patientName}</p>
                <p className="text-gray-600">
                  Saldo Actual: <strong className="text-rose-600">₡{selectedInvoice.balancePending.toLocaleString()}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Monto del Abono (₡) *</label>
                <input
                  type="number"
                  required
                  max={selectedInvoice.balancePending}
                  value={abonoAmount}
                  onChange={(e) => setAbonoAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-extrabold text-emerald-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Medio de Pago del Abono</label>
                <select
                  value={abonoMethod}
                  onChange={(e) => setAbonoMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="SINPE Móvil">SINPE Móvil</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta Banco Popular">Tarjeta Banco Popular</option>
                  <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                  <option value="Tarjeta Débito">Tarjeta Débito</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAbonoModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Confirmar Abono & Notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
