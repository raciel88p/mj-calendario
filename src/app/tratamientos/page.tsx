'use client';

import { useState } from 'react';
import { initialTreatments } from '@/lib/data';
import { Treatment } from '@/types';
import { Sparkles, Plus, Edit, CheckCircle2, Clock, DollarSign } from 'lucide-react';

import { useEffect } from 'react';

export default function TratamientosPage() {
  const [treatments, setTreatments] = useState<Treatment[]>(initialTreatments);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedT, setSelectedT] = useState<Treatment | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Treatment['category']>('Faciales');
  const [durationMins, setDurationMins] = useState(60);
  const [price, setPrice] = useState(35000);
  const [color, setColor] = useState('#3B82F6');
  const [description, setDescription] = useState('');

  const fetchTreatments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/treatments', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setTreatments(data.data);
      }
    } catch (e) {
      console.error('Error fetching treatments:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const openNewModal = () => {
    setSelectedT(null);
    setName('');
    setCategory('Faciales');
    setDurationMins(60);
    setPrice(35000);
    setColor('#3B82F6');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      category,
      durationMins: Number(durationMins),
      price: Number(price),
      color,
      description,
    };

    if (selectedT) {
      setTreatments(
        treatments.map((t) =>
          t.id === selectedT.id ? { ...t, ...payload } : t
        )
      );
      try {
        await fetch('/api/treatments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedT.id, ...payload }),
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch('/api/treatments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setTreatments([...treatments, data.data]);
        } else {
          const newT: Treatment = {
            id: `t-${Date.now()}`,
            ...payload,
            active: true,
          };
          setTreatments([...treatments, newT]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Catálogo de Tratamientos
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configuración de servicios, precios, duraciones y colores identificadores.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm rounded-xl shadow-sm hover:opacity-90 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Tratamiento
        </button>
      </div>

      {/* Treatment Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {treatments.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm hover:border-amber-300 transition space-y-3 border-t-8"
            style={{ borderTopColor: t.color }}
          >
            <div className="flex items-center justify-between">
              <span
                className="px-2.5 py-1 text-xs font-bold rounded-full text-white shadow-2xs"
                style={{ backgroundColor: t.color }}
              >
                {t.category}
              </span>
              <button
                onClick={() => {
                  setSelectedT(t);
                  setName(t.name);
                  setCategory(t.category);
                  setDurationMins(t.durationMins);
                  setPrice(t.price);
                  setColor(t.color);
                  setDescription(t.description || '');
                  setIsModalOpen(true);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-bold text-gray-800 text-base">{t.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{t.description || 'Sin descripción'}</p>

            <div className="flex items-center justify-between border-t pt-3 border-gray-100 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> {t.durationMins} min
              </span>
              <span className="font-bold text-gray-800 text-sm">₡{t.price.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-rose-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-3">
              {selectedT ? 'Editar Tratamiento' : 'Agregar Nuevo Tratamiento'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Servicio</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                >
                  <option value="Faciales">Faciales (Azul)</option>
                  <option value="Masajes">Masajes (Verde)</option>
                  <option value="Láser">Láser (Morado)</option>
                  <option value="Depilación">Depilación (Rosado)</option>
                  <option value="Corporales">Corporales (Naranja)</option>
                  <option value="Otros">Otros (Gris)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Duración (min)</label>
                  <input
                    type="number"
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Precio (₡)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Color Identificador</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10 border border-gray-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
