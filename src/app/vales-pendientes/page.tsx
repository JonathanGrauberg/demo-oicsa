'use client';
export const dynamic = "force-dynamic";


import { useState, useEffect } from 'react';

type Vale = {
  id: number;
  combustible_lubricante: string;
  litros: number;
  vehiculo: number;
  obra: string;
  destino: string;
  encargado: string;
  fecha: string;
  aprobado: boolean;
  kilometraje: number;
  creado_en: string;
  solicitado_nombre: string;
  solicitado_apellido: string;
  marca: string;
  modelo: string;
  patente: string;
  origen: string;
};

export default function ValesPendientes() {
  const [vales, setVales] = useState<Vale[]>([]);

  useEffect(() => {
    fetch('/api/vale?aprobado=false')
      .then(res => res.json())
      .then(data => setVales(data));
  }, []);

  const aprobarVale = async (id: number) => {
    const res = await fetch('/api/vale/aprobar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (res.ok) {
      setVales(prev => prev.filter(v => v.id !== id));
      alert('✅ Vale aprobado correctamente');
    } else {
      alert(`❌ No se pudo aprobar el vale: ${data.error || 'Error desconocido'}`);
    }
  };

  const eliminarVale = async (id: number) => {
    const confirmar = confirm('¿Estás seguro que querés eliminar este vale?');

    if (!confirmar) return;

    const res = await fetch('/api/vale/eliminar', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setVales(prev => prev.filter(v => v.id !== id));
      alert('🗑️ Vale eliminado correctamente');
    } else {
      alert('❌ No se pudo eliminar el vale');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vales Pendientes de Aprobar</h1>
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Solicitado por</th>
            <th className="p-2">Combustible</th>
            <th className="p-2">Litros</th>
            <th className="p-2">Vehículo</th>
            <th className="p-2">Obra</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Chofer</th>
            <th className="p-2">Acciones</th>
            <th className="p-2">Origen de surtidor</th>
          </tr>
        </thead>
        <tbody>
  {vales.map(vale => (
    <tr key={vale.id} className="border-t border-gray-200">
      <td className="p-2">{vale.solicitado_nombre} {vale.solicitado_apellido}</td>
      <td className="p-2">{vale.combustible_lubricante}</td>
      <td className="p-2">{vale.litros}</td>
      <td className="p-2">
        {vale.marca} {vale.modelo} ({vale.patente})
      </td>
      <td className="p-2">{vale.obra}</td>
      <td className="p-2">{new Date(vale.fecha).toLocaleDateString()}</td>
      <td className="p-2">{vale.encargado}</td>
      <td className="p-2">
        <div className="flex gap-2">
          <button
            onClick={() => aprobarVale(vale.id)}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Aprobar
          </button>
          <button
            onClick={() => eliminarVale(vale.id)}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Eliminar
          </button>
        </div>
      </td>
      {/* ✅ Ahora sí, fuera del td de acciones */}
      <td className="p-2">{vale.origen}</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
