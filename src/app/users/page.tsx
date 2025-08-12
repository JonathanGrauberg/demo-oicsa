'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Usuario } from '@/lib/types/usuario';

type Me = { id: number; rol: string; nombre: string; apellido: string; email: string } | null;

const ROLES: Array<Usuario['rol']> = [
  'superusuario',
  'administrativo',
  'encargado',
  'aprobador',
  'chofer',
];

function RowUser({
  u,
  puedeEditar,
  onChangeRol,
  onDelete,
  meId,
}: {
  u: Usuario;
  puedeEditar: boolean;
  onChangeRol: (id: number, nuevo: Usuario['rol']) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  meId?: number | null;
}) {
  const [editando, setEditando] = useState(false);
  const [rol, setRol] = useState<Usuario['rol']>(u.rol);
  const [saving, setSaving] = useState(false);
  const soyYo = meId === u.id;

  const guardar = async () => {
    try {
      setSaving(true);
      await onChangeRol(u.id, rol);
      setEditando(false);
    } finally {
      setSaving(false);
    }
  };

  const eliminar = async () => {
    if (soyYo) {
      alert('No podés eliminar tu propio usuario.');
      return;
    }
    const ok = confirm(`¿Eliminar al usuario "${u.apellido}, ${u.nombre}"? Esta acción no se puede deshacer.`);
    if (!ok) return;
    await onDelete(u.id);
  };

  return (
    <tr className="border-t">
      {/* Apellido primero */}
      <td className="px-4 py-2">{u.apellido}</td>
      <td className="px-4 py-2">{u.nombre}</td>
      <td className="px-4 py-2">{u.email}</td>
      <td className="px-4 py-2 capitalize">
        {editando ? (
          <select
            className="border p-1 rounded"
            value={rol}
            onChange={(e) => setRol(e.target.value as Usuario['rol'])}
            disabled={saving}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        ) : (
          u.rol
        )}
      </td>
      <td className="px-4 py-2">
        {puedeEditar ? (
          editando ? (
            <div className="flex gap-2">
              <button
                onClick={guardar}
                disabled={saving}
                className="bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50"
              >
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
              <button
                onClick={() => {
                  setRol(u.rol);
                  setEditando(false);
                }}
                className="bg-gray-300 px-2 py-1 rounded"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditando(true)} className="bg-blue-500 text-white px-2 py-1 rounded">
                Editar
              </button>
              <button
                onClick={eliminar}
                className="bg-red-600 text-white px-2 py-1 rounded"
                title={soyYo ? 'No podés eliminarte' : 'Eliminar usuario'}
                disabled={soyYo}
              >
                Eliminar
              </button>
            </div>
          )
        ) : (
          <span className="text-gray-400">Solo lectura</span>
        )}
      </td>
    </tr>
  );
}

export default function UsersPage() {
  const [me, setMe] = useState<Me>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [q, setQ] = useState('');

  // Carga de datos
  useEffect(() => {
    const load = async () => {
      try {
        const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
        setMe(meRes.ok ? await meRes.json() : null);

        const uRes = await fetch('/api/usuario', { cache: 'no-store' });
        const data = await uRes.json();
        setUsuarios(data.usuarios ?? []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  // filtro + orden por apellido y nombre
  const usuariosFiltrados = useMemo(() => {
    const term = q.trim().toLowerCase();
    let filtrados = usuarios;

    if (term) {
      filtrados = usuarios.filter((u) =>
        `${u.apellido} ${u.nombre} ${u.email} ${u.rol}`.toLowerCase().includes(term)
      );
    }

    return [...filtrados].sort((a, b) => {
      const cmpApellido = a.apellido.localeCompare(b.apellido, 'es', { sensitivity: 'base' });
      if (cmpApellido !== 0) return cmpApellido;
      return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
    });
  }, [usuarios, q]);

  const puedeEditar = me?.rol === 'superusuario';

  const cambiarRol = async (id: number, nuevo: Usuario['rol']) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, rol: nuevo } : u)));
    const res = await fetch('/api/usuario', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, rol: nuevo }),
    });
    if (!res.ok) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, rol: (prev.find((p) => p.id === id)?.rol as Usuario['rol']) } : u))
      );
      const err = await res.json().catch(() => ({}));
      alert(err?.error || 'No se pudo actualizar el rol');
    }
  };

  const eliminarUsuario = async (id: number) => {
    try {
      const res = await fetch('/api/usuario', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || 'No se pudo eliminar el usuario');
        return;
      }
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      console.error(e);
      alert('Error de conexión');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Usuarios</h1>

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          className="border rounded p-2 w-full sm:w-96"
          placeholder="Buscar por apellido, nombre, email o rol…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="text-sm text-gray-600 self-center">
          {puedeEditar ? 'Podés editar y eliminar usuarios' : 'Solo lectura'}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Apellido</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((u) => (
                <RowUser
                  key={u.id}
                  u={u}
                  puedeEditar={!!puedeEditar}
                  onChangeRol={cambiarRol}
                  onDelete={eliminarUsuario}
                  meId={me?.id ?? null}
                />
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan={5}>
                  {usuarios.length === 0 ? 'No hay usuarios.' : 'Sin coincidencias.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
