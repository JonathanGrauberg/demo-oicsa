'use client';

import { useEffect, useState } from 'react';
import { StockItem } from '@/lib/types/stock';

export default function StockPage() {
  const [stock, setStock] = useState<StockItem[]>([]);

  const ordenarPorNombre = (items: StockItem[]) =>
    [...items].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );

  useEffect(() => {
    async function fetchStock() {
      try {
        const res = await fetch('/api/stock', { cache: 'no-store' });
        const data: StockItem[] = await res.json();
        setStock(ordenarPorNombre(data));
      } catch (error) {
        console.error('Error al obtener el stock:', error);
      }
    }
    fetchStock();
  }, []);

  const actualizarCantidad = async (id: number, nuevaCantidad: number) => {
    try {
      const res = await fetch(`/api/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, cantidad: nuevaCantidad }),
      });

      if (res.ok) {
        const actualizado = await res.json();
        setStock((prev) =>
          ordenarPorNombre(
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    cantidad: actualizado.cantidad,
                    creado_en: actualizado.creado_en,
                  }
                : item
            )
          )
        );
      } else {
        alert('❌ Error al actualizar cantidad');
      }
    } catch (err) {
      console.error('Error al actualizar cantidad:', err);
    }
  };

  const eliminarItem = async (id: number) => {
    const ok = confirm(
      '¿Seguro que querés eliminar este ítem de stock? Esta acción no se puede deshacer.'
    );
    if (!ok) return;

    try {
      const res = await fetch('/api/stock', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setStock((prev) => ordenarPorNombre(prev.filter((i) => i.id !== id)));
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || '❌ No se pudo eliminar el ítem');
      }
    } catch (e) {
      console.error(e);
      alert('❌ Error de conexión al eliminar');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Stock de Combustibles y Lubricantes
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Cantidad</th>
              <th className="px-4 py-2 text-left">Unidad</th>
              <th className="px-4 py-2 text-left">Fecha de carga</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {stock.length > 0 ? (
              stock.map((item) => (
                <EditableStockRow
                  key={item.id}
                  item={item}
                  onSave={actualizarCantidad}
                  onDelete={eliminarItem}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-gray-500 py-4"
                >
                  No hay stock registrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EditableStockRow({
  item,
  onSave,
  onDelete,
}: {
  item: StockItem;
  onSave: (id: number, nuevaCantidad: number) => void;
  onDelete: (id: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [nuevaCantidad, setNuevaCantidad] = useState(item.cantidad);

  const guardar = () => {
    onSave(item.id, nuevaCantidad);
    setIsEditing(false);
  };

  return (
    <tr className="border-t">
      <td className="px-4 py-2">{item.nombre}</td>
      <td className="px-4 py-2">{item.tipo}</td>
      <td className="px-4 py-2">
        {isEditing ? (
          <input
            type="number"
            value={nuevaCantidad}
            onChange={(e) =>
              setNuevaCantidad(parseFloat(e.target.value))
            }
            className="border p-1 w-20"
          />
        ) : (
          item.cantidad
        )}
      </td>
      <td className="px-4 py-2">{item.unidad}</td>
      <td className="px-4 py-2">
        {new Date(item.creado_en).toLocaleDateString()}
      </td>
      <td className="px-4 py-2 space-x-2">
        {isEditing ? (
          <button
            onClick={guardar}
            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
          >
            Guardar
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Editar
          </button>
        )}

        <button
          onClick={() => onDelete(item.id)}
          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}
