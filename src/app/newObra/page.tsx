'use client';
export const dynamic = "force-dynamic";

import React, { useState } from 'react';

const NuevaObra = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    estado: 'En progreso'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/obra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ nombre: '', descripcion: '', ubicacion: '', estado: 'En progreso' });
      } else {
        const error = await res.json();
        alert('Error al crear la obra: ' + error.error);
      }
    } catch (err) {
      alert('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Registrar nueva obra</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre de la obra</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
          >
            <option value="En progreso">En progreso</option>
            <option value="Finalizada">Finalizada</option>
            <option value="Pausada">Pausada</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setFormData({ nombre: '', descripcion: '', ubicacion: '', estado: 'En progreso' })}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {loading ? 'Guardando...' : 'Registrar obra'}
          </button>
        </div>

        {success && (
          <p className="text-green-600 text-sm mt-4">Obra registrada correctamente ✅</p>
        )}
      </form>
    </div>
  );
};

export default NuevaObra;
