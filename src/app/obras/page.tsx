'use client';

import { useEffect, useState } from 'react';

export type Obra = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  ubicacion?: string | null;
  estado: 'en progreso' | 'finalizada' | string;
  creado_en: string;
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

function RowObra({
  o,
  onUpdated,
}: {
  o: Obra;
  onUpdated: (obra: Obra) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState<Obra>(o);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof Obra, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const guardar = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/obra', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: o.id,
          nombre: form.nombre,
          descripcion: form.descripcion ?? '',
          ubicacion: form.ubicacion ?? '',
          estado: form.estado,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        alert(e?.error || 'No se pudo actualizar la obra');
        return;
      }
      const updated = (await res.json()) as Obra;
      onUpdated(updated);
      setForm(updated);
      setExpanded(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <tr className="border-t">
        <td className="px-4 py-2">{o.nombre}</td>
        <td className="px-4 py-2">{o.descripcion || '-'}</td>
        <td className="px-4 py-2">{o.ubicacion || '-'}</td>
        <td className="px-4 py-2 capitalize">{o.estado}</td>
        <td className="px-4 py-2">{new Date(o.creado_en).toLocaleDateString()}</td>
        <td className="px-4 py-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            {expanded ? 'Cerrar' : 'Editar'}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr className="bg-gray-50">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Nombre"
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
              />
              <Input
                label="Ubicación"
                value={form.ubicacion || ''}
                onChange={(e) => set('ubicacion', e.target.value)}
              />
              <Select
                label="Estado"
                value={form.estado || 'en progreso'}
                onChange={(e) => set('estado', e.target.value)}
              >
                <option value="en progreso">En progreso</option>
                <option value="finalizada">Finalizada</option>
              </Select>
              <div />
              <div className="md:col-span-4">
                <TextArea
                  label="Descripción"
                  rows={3}
                  value={form.descripcion || ''}
                  onChange={(e) => set('descripcion', e.target.value)}
                />
              </div>

              <div className="md:col-span-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="px-3 py-2 rounded bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={guardar}
                  className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-50"
                >
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function ObrasPage() {
  const [obras, setObras] = useState<Obra[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/api/obra`, { cache: 'no-store' });
        const data = await res.json();
        setObras(data);
      } catch (e) {
        console.error(e);
        setObras([]);
      }
    })();
  }, [baseUrl]);

  const onUpdated = (obra: Obra) => {
    setObras((prev) => prev.map((x) => (x.id === obra.id ? { ...x, ...obra } : x)));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Listado de obras registradas</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-left">Ubicación</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Fecha creación</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {obras.length ? (
              obras.map((o) => <RowObra key={o.id} o={o} onUpdated={onUpdated} />)
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  No hay obras registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
