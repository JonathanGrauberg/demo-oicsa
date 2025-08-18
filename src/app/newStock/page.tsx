'use client';
export const dynamic = "force-dynamic";

import { useState } from 'react';

const NewStock = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    cantidad: '' as string,
    unidad: 'litros'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // ✨ Limpieza de formato de número (quita puntos y reemplaza coma decimal por punto)
    const cantidadNumerica = Number(String(formData.cantidad).replace(/\./g, '').replace(',', '.'));

    const data = {
      ...formData,
      cantidad: cantidadNumerica
    };

    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          nombre: '',
          tipo: '',
          cantidad: '',
          unidad: 'litros',
        });
      } else {
        const error = await res.json();
        alert('Error al registrar: ' + error.error);
      }
    } catch (err) {
      alert('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registrar nuevo insumo de Obrador</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm text-black"
            required
          >
            <option value="">Seleccionar tipo...</option>
            <option value="Combustible">Combustible</option>
            <option value="Lubricante">Lubricante</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Unidad</label>
          <select
            name="unidad"
            value={formData.unidad}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm text-black"
            required
          >
            <option value="litros">litros</option>
          </select>
        </div>

        <div className="col-span-full flex justify-end gap-2 mt-4">
          <button
            type="reset"
            onClick={() => setFormData({ nombre: '', tipo: '', cantidad: '', unidad: 'litros' })}
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? 'Guardando...' : 'Registrar'}
          </button>
        </div>

        {success && (
          <p className="text-green-600 text-sm mt-2 col-span-full">
            ✅ Insumo registrado correctamente.
          </p>
        )}
      </form>
    </div>
  );
};

export default NewStock;
