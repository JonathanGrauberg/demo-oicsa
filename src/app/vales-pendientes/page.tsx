// app/vales-pendientes/page.tsx
'use client';

import { useState, useEffect } from 'react';

type Vale = {
  id: number;
  combustible_lubricante: string;
  litros: number;
  vehiculo: string;
  chofer: string;
  aprobado: boolean;
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

    if (res.ok) {
      setVales(prev => prev.filter(v => v.id !== id));
      alert('Vale aprobado correctamente');
    } else {
      alert('Error al aprobar el vale');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vales Pendientes de Aprobar</h1>
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Combustible</th>
            <th className="p-2">Litros</th>
            <th className="p-2">Vehículo</th>
            <th className="p-2">Chofer</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vales.map(vale => (
            <tr key={vale.id} className="border-t border-gray-200">
              <td className="p-2">{vale.id}</td>
              <td className="p-2">{vale.combustible_lubricante}</td>
              <td className="p-2">{vale.litros}</td>
              <td className="p-2">{vale.vehiculo}</td>
              <td className="p-2">{vale.chofer}</td>
              <td className="p-2">
                <button
                  onClick={() => aprobarVale(vale.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Aprobar
                </button>
                //si el usuario es administrativo no mostrar el botón de aprobar
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
