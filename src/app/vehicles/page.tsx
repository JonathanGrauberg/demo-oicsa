'use client';

import { useEffect, useMemo, useState } from 'react';

export type Vehiculo = {
  id: number;
  tipo?: string;
  marca: string;
  modelo: string;
  patente: string;
  ano?: number | string;
  kilometraje?: number | null;
  chasis?: string;
  motor?: string;
  neumaticos_delantero?: string;
  neumaticos_traseros?: string;
  aceite_motor?: string;
  aceite_caja?: string;
  filtro_aceite?: string;
  combustible?: string;
  filtro_aire_primario?: string;
  filtro_aire_secundario?: string;
  filtro_combustible_primario?: string;
  filtro_combustible_secundario?: string;
  observaciones?: string;
};

function Input({
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-700">{label}</label>}
      <input {...rest} className={`border p-2 rounded ${rest.className || ''}`} />
    </div>
  );
}

function Select({
  label,
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-700">{label}</label>}
      <select {...rest} className={`border p-2 rounded text-black ${rest.className || ''}`}>
        {children}
      </select>
    </div>
  );
}

function TextArea({
  label,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-700">{label}</label>}
      <textarea {...rest} className={`border p-2 rounded ${rest.className || ''}`} />
    </div>
  );
}

function VehiculoRow({
  item,
  onActualizarFila,
  onDelete,
}: {
  item: Vehiculo;
  onActualizarFila: (v: Vehiculo) => void;
  onDelete: (id: number) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Vehiculo>(item);
  const [saving, setSaving] = useState(false);

  const abrir = async () => {
    if (expanded) return setExpanded(false);
    setExpanded(true);
    if (!form.filtro_aceite && !loading) {
      try {
        setLoading(true);
        const r = await fetch(`/api/vehiculo?id=${item.id}`, { cache: 'no-store' });
        if (r.ok) {
          const full = (await r.json()) as Vehiculo;
          setForm(full);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const set = (k: keyof Vehiculo, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const guardar = async () => {
    try {
      setSaving(true);
      const payload = { ...form, id: item.id };
      const r = await fetch('/api/vehiculo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        alert(e?.error || 'No se pudo actualizar el vehículo');
        return;
      }
      const actualizado = (await r.json()) as Vehiculo;
      onActualizarFila(actualizado);
      setForm(actualizado);
      setExpanded(false);
    } finally {
      setSaving(false);
    }
  };

  const eliminar = async () => {
    const ok = confirm(`¿Eliminar el vehículo ${item.marca} ${item.modelo} (${item.patente})?`);
    if (!ok) return;

    const res = await fetch('/api/vehiculo', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id }),
    });

    if (res.ok) {
      await onDelete(item.id);
      return;
    }

    const err = await res.json().catch(() => ({}));
    if (res.status === 409 && err?.referencias > 0) {
      const ok2 = confirm(
        `Este vehículo está referenciado por ${err.referencias} vale(s).\n` +
          `¿Querés DESVINCULAR esos vales (dejando la patente como texto) y eliminar el vehículo igualmente?`
      );
      if (!ok2) return;

      const res2 = await fetch('/api/vehiculo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, unlink: true }),
      });

      if (res2.ok) {
        await onDelete(item.id);
      } else {
        const e2 = await res2.json().catch(() => ({}));
        alert(e2?.error || 'No se pudo eliminar el vehículo');
      }
    } else {
      alert(err?.error || 'No se pudo eliminar el vehículo');
    }
  };

  return (
    <>
      <tr className="border-t">
        <td className="px-4 py-2">{item.marca}</td>
        <td className="px-4 py-2">{item.modelo}</td>
        <td className="px-4 py-2">{item.patente}</td>
        <td className="px-4 py-2">
          {item.kilometraje != null ? item.kilometraje.toLocaleString('es-AR') : 'Sin datos'}
        </td>
        <td className="px-4 py-2 space-x-2">
          <button onClick={abrir} className="bg-blue-500 text-white px-2 py-1 rounded">
            {expanded ? 'Cerrar' : 'Editar'}
          </button>
          <button onClick={eliminar} className="bg-red-600 text-white px-2 py-1 rounded">
            Eliminar
          </button>
        </td>
      </tr>

      {expanded && (
        <tr className="bg-gray-50">
          <td colSpan={5} className="px-4 py-4">
            {loading ? (
              <div className="text-gray-500">Cargando…</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input label="Tipo" value={form.tipo || ''} onChange={(e) => set('tipo', e.target.value)} />
                <Input label="Marca" value={form.marca || ''} onChange={(e) => set('marca', e.target.value)} />
                <Input label="Modelo" value={form.modelo || ''} onChange={(e) => set('modelo', e.target.value)} />

                <Input label="Patente" value={form.patente || ''} onChange={(e) => set('patente', e.target.value)} />

                <Input label="Año" type="number" value={(form.ano as any) || ''} onChange={(e) => set('ano', e.target.value)} />
                <Input label="Kilometraje" type="number" value={form.kilometraje ?? ''} onChange={(e) => set('kilometraje', Number(e.target.value))} />
                <Input label="Chasis" value={form.chasis || ''} onChange={(e) => set('chasis', e.target.value)} />
                <Input label="Motor" value={form.motor || ''} onChange={(e) => set('motor', e.target.value)} />

                <Input label="Neumáticos Delantero" value={form.neumaticos_delantero || ''} onChange={(e) => set('neumaticos_delantero', e.target.value)} />
                <Input label="Neumáticos Traseros" value={form.neumaticos_traseros || ''} onChange={(e) => set('neumaticos_traseros', e.target.value)} />

                <Input label="Aceite Motor" value={form.aceite_motor || ''} onChange={(e) => set('aceite_motor', e.target.value)} />
                <Input label="Aceite Caja" value={form.aceite_caja || ''} onChange={(e) => set('aceite_caja', e.target.value)} />

                <Input label="Filtro de Aceite" value={form.filtro_aceite || ''} onChange={(e) => set('filtro_aceite', e.target.value)} />
                <Input label="Combustible" value={form.combustible || ''} onChange={(e) => set('combustible', e.target.value)} />

                <Input label="Filtro Aire Primario" value={form.filtro_aire_primario || ''} onChange={(e) => set('filtro_aire_primario', e.target.value)} />
                <Input label="Filtro Aire Secundario" value={form.filtro_aire_secundario || ''} onChange={(e) => set('filtro_aire_secundario', e.target.value)} />

                <Input label="Filtro Combustible Primario" value={form.filtro_combustible_primario || ''} onChange={(e) => set('filtro_combustible_primario', e.target.value)} />
                <Input label="Filtro Combustible Secundario" value={form.filtro_combustible_secundario || ''} onChange={(e) => set('filtro_combustible_secundario', e.target.value)} />

                <div className="md:col-span-4">
                  <TextArea label="Observaciones" rows={3} value={form.observaciones || ''} onChange={(e) => set('observaciones', e.target.value)} />
                </div>

                <div className="md:col-span-4 flex gap-2 justify-end mt-2">
                  <button onClick={() => setExpanded(false)} type="button" className="px-3 py-2 rounded bg-gray-300">
                    Cancelar
                  </button>
                  <button onClick={guardar} disabled={saving} type="button" className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-50">
                    {saving ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/vehiculo', { cache: 'no-store' });
      const data = await res.json();
      setVehiculos(data);
    })();
  }, []);

  const onActualizarFila = (v: Vehiculo) => {
    setVehiculos((prev) => prev.map((x) => (x.id === v.id ? { ...x, ...v } : x)));
  };

  const onDelete = async (id: number) => {
    setVehiculos((prev) => prev.filter((x) => x.id !== id));
  };

  // Helpers para ordenar por patente (no vacíos primero)
  const normalize = (v: unknown) => (v ?? '').toString().trim();
  const cmpPatente = (a: Vehiculo, b: Vehiculo) => {
    const ap = normalize(a.patente);
    const bp = normalize(b.patente);
    const aHas = ap.length > 0;
    const bHas = bp.length > 0;
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;
    return ap.localeCompare(bp, 'es', { sensitivity: 'base', numeric: true });
  };

  const vehiculosFiltrados = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    let lista = [...vehiculos];

    if (t) {
      lista = lista.filter((v) =>
        `${v.patente} ${v.marca} ${v.modelo}`.toLowerCase().includes(t)
      );
    }

    // Ordenar por patente (los vacíos al final)
    lista.sort(cmpPatente);
    return lista;
  }, [vehiculos, busqueda]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Vehículos registrados</h1>

      <input
        type="text"
        placeholder="Buscar por patente, marca o modelo..."
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
            {vehiculosFiltrados.length ? (
              vehiculosFiltrados.map((item) => (
                <VehiculoRow
                  key={item.id}
                  item={item}
                  onActualizarFila={onActualizarFila}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
