'use client';
export const dynamic = "force-dynamic";


import React, { useState } from 'react';

const VehicleRegistration = () => {
  const [formData, setFormData] = useState({
          tipo: '',
          marca: '',
          modelo: '',
          patente: '',
          ano: '',
          kilometraje: '',
          chasis: '',
          motor: '',
          neumaticos_delantero: '',
          neumaticos_traseros: '',
          aceite_motor: '',
          aceite_caja: '',
          filtro_aceite: '',
          combustible: '',
          filtro_aire_primario: '',
          filtro_aire_secundario: '',
          filtro_combustible_primario: '',
          filtro_combustible_secundario: '',
          observaciones: '',
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${baseUrl}/api/vehiculo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Vehículo registrado con éxito');
        setFormData({
          tipo: '',
          marca: '',
          modelo: '',
          patente: '',
          ano: '',
          kilometraje: '',
          chasis: '',
          motor: '',
          neumaticos_delantero: '',
          neumaticos_traseros: '',
          aceite_motor: '',
          aceite_caja: '',
          filtro_aceite: '',
          combustible: '',
          filtro_aire_primario: '',
          filtro_aire_secundario: '',
          filtro_combustible_primario: '',
          filtro_combustible_secundario: '',
          observaciones: '',
        });
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-black">Alta de Vehículos</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Vehículo</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
              >
                <option value="">Seleccionar...</option>
                <option>Camión</option>
                <option>Retroexcavadora</option>
                <option>Grúa</option>
                <option>Cargadora</option>
                <option>Auto</option>
                <option>Camioneta</option>
                <option>otro auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Marca</label>
              <select
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
              >
                <option value="">Seleccionar...</option>
                <option>Honda</option>
                <option>Fiat</option>
                <option>Mercedez</option>
                <option>BMW</option>
                <option>Audi</option>
                <option>VolksWagen</option>
                <option>otro</option>
              </select>
            </div> 
            <div>
              <label className="block text-sm font-medium text-gray-700">Modelo</label>
              <select
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
              >
                <option value="">Seleccionar...</option>
                <option>Kangoo</option>
                <option>Gol</option>
                <option>Vento</option>
                <option>A4</option>
                <option>A3</option>
                <option>Berlingo</option>
                <option>otro</option>
              </select>
            </div>

            <input name="patente" value={formData.patente} onChange={handleChange} placeholder="Patente" className="input-style" />
            <input name="ano" type="number" value={formData.ano} onChange={handleChange} placeholder="Año" className="input-style" />
            <input name="kilometraje" type="number" value={formData.kilometraje} onChange={handleChange} placeholder="Kilometraje" className="input-style" />
            <input name="chasis" value={formData.chasis} onChange={handleChange} placeholder="Chasis" className="input-style" />
            <input name="motor" value={formData.motor} onChange={handleChange} placeholder="Motor" className="input-style" />
            <input name="neumaticos_delantero" value={formData.neumaticos_delantero} onChange={handleChange} placeholder="Neumáticos Delantero" className="input-style" />
            <input name="neumaticos_traseros" value={formData.neumaticos_traseros} onChange={handleChange} placeholder="Neumáticos Traseros" className="input-style" />
            <input name="aceite_motor" value={formData.aceite_motor} onChange={handleChange} placeholder="Aceite Motor" className="input-style" />
            <input name="aceite_caja" value={formData.aceite_caja} onChange={handleChange} placeholder="Aceite Caja" className="input-style" />
            <input name="filtro_aceite" value={formData.filtro_aceite} onChange={handleChange} placeholder="Filtro de Aceite" className="input-style" />
            <input name="combustible" value={formData.combustible} onChange={handleChange} placeholder="Combustible" className="input-style" />
            <input name="filtro_aire_primario" value={formData.filtro_aire_primario} onChange={handleChange} placeholder="Filtro Aire Primario" className="input-style" />
            <input name="filtro_aire_secundario" value={formData.filtro_aire_secundario} onChange={handleChange} placeholder="Filtro Aire Secundario" className="input-style" />
            <input name="filtro_combustible_primario" value={formData.filtro_combustible_primario} onChange={handleChange} placeholder="Filtro Combustible Primario" className="input-style" />
            <input name="filtro_combustible_secundario" value={formData.filtro_combustible_secundario} onChange={handleChange} placeholder="Filtro Combustible Secundario" className="input-style" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Registrar Vehículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleRegistration;
