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
  encargado: string; // ← quien solicita (logueado)
  fecha: string;     // 'YYYY-MM-DD'
  aprobado: boolean;
  kilometraje: number;
  creado_en: string;
  solicitado_nombre: string;     // ← chofer (nombre)
  solicitado_apellido: string;   // ← chofer (apellido)
  marca: string;
  modelo: string;
  patente: string;
  origen: string;
};

export default function ValesPendientes() {
  const [vales, setVales] = useState<Vale[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  useEffect(() => {
    fetch(`${baseUrl}/api/vale?aprobado=false`)
      .then(res => res.json())
      .then(data => setVales(Array.isArray(data) ? data : []))
      .catch(() => setVales([]));
  }, [baseUrl]);

  const aprobarVale = async (id: number) => {
    const res = await fetch(`${baseUrl}/api/vale/aprobar`, {
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

    const res = await fetch(`${baseUrl}/api/vale/eliminar`, {
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

  // Helpers
  const nombreChoferDe = (v: Vale) =>
    [v.solicitado_nombre, v.solicitado_apellido].filter(Boolean).join(' ').trim() || v.encargado || '';

  const formatFechaLocal = (isoDateOnly: string, addDays = 0) => {
    if (!isoDateOnly) return '';
    const [y, m, d] = isoDateOnly.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    if (addDays) dt.setDate(dt.getDate() + addDays);
    return dt.toLocaleDateString('es-AR');
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
            <th className="p-2">Origen de surtidor</th>{/* ← movido antes de Acciones */}
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vales.map(vale => (
            <tr key={vale.id} className="border-t border-gray-200">
              {/* 👇 ahora muestra al encargado/logueado */}
              <td className="p-2">{vale.encargado}</td>
              <td className="p-2">{vale.combustible_lubricante}</td>
              <td className="p-2">{vale.litros}</td>
              <td className="p-2">
                {vale.marca} {vale.modelo} ({vale.patente})
              </td>
              <td className="p-2">{vale.obra}</td>
              <td className="p-2">{formatFechaLocal(vale.fecha, 1)}</td>
              {/* 👇 chofer correcto */}
              <td className="p-2">{nombreChoferDe(vale)}</td>
              {/* 👇 origen antes de Acciones */}
              <td className="p-2">{vale.origen}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
