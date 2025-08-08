'use client';

import { useEffect, useState } from 'react';
import { Vehiculo } from '@/lib/types/vehiculo';

function VehiculoRow({
  item,
  onActualizarKilometraje,
}: {
  item: Vehiculo;
  onActualizarKilometraje: (id: number, nuevoKm: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [nuevoKm, setNuevoKm] = useState<string>(item.kilometraje?.toString() || '');

  const guardarCambio = async () => {
    try {
      const kmInt = parseInt(nuevoKm.replace(/\D/g, ''));
      const res = await fetch('/api/vehiculo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, kilometraje: kmInt }),
      });

      if (res.ok) {
        onActualizarKilometraje(item.id, kmInt);
        setIsEditing(false);
      } else {
        alert('❌ Error al actualizar kilometraje');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <tr className="border-t">
      <td className="px-4 py-2">{item.marca}</td>
      <td className="px-4 py-2">{item.modelo}</td>
      <td className="px-4 py-2">{item.patente}</td>
      <td className="px-4 py-2">
        {isEditing ? (
          <input
            type="number"
            value={nuevoKm}
            onChange={(e) => setNuevoKm(e.target.value)}
            className="border p-1 w-24"
          />
        ) : item.kilometraje != null ? (
          item.kilometraje.toLocaleString('es-AR')
        ) : (
          'Sin datos'
        )}
      </td>
      <td className="px-4 py-2">
        {isEditing ? (
          <button
            onClick={guardarCambio}
            disabled={!nuevoKm}
            className="bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50"
          >
            Guardar
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Editar
          </button>
        )}
      </td>
    </tr>
  );
}

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    async function fetchVehiculos() {
      try {
        const res = await fetch('/api/vehiculo');
        const data = await res.json();
        setVehiculos(data);
      } catch (error) {
        console.error('Error al obtener vehículos:', error);
      }
    }

    fetchVehiculos();
  }, []);

  const actualizarKilometraje = (id: number, nuevoKm: number) => {
    setVehiculos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, kilometraje: nuevoKm } : v))
    );
  };

  const vehiculosFiltrados = vehiculos.filter((v) =>
    `${v.marca} ${v.modelo} ${v.patente}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Vehículos registrados</h1>

      <input
        type="text"
        placeholder="Buscar por marca, modelo o patente..."
        className="mb-4 p-2 border border-gray-300 rounded w-full sm:w-96"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Marca</th>
              <th className="px-4 py-2 text-left">Modelo</th>
              <th className="px-4 py-2 text-left">Patente</th>
              <th className="px-4 py-2 text-left">Kilometraje</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehiculosFiltrados.length > 0 ? (
              vehiculosFiltrados.map((item) => (
                <VehiculoRow
                  key={item.id}
                  item={item}
                  onActualizarKilometraje={actualizarKilometraje}
                />
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan={5}>
                  No hay vehículos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
