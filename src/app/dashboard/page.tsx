'use client';
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Role = 'superusuario' | 'administrativo' | 'encargado' | 'aprobador' | 'chofer';

export default function Dashboard() {
  const [role, setRole] = useState<Role | null>(null);
  const [stats, setStats] = useState({
    usuarios: 0,
    vehiculos: 0,
    valesPendientes: 0,
    valesAprobados: 0,
    obras: 0,
  });

  const canSeePending = role === 'superusuario' || role === 'aprobador';

  useEffect(() => {
    const load = async () => {
      try {
        // 1) Obtener rol
        const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
        if (meRes.ok) {
          const me = await meRes.json();
          const r = String(me?.rol || '').toLowerCase() as Role;
          setRole(r);
        } else {
          setRole(null);
        }
      } catch {
        setRole(null);
      }
    };
    load();
  }, []);

  useEffect(() => {
    // Esperar a conocer el rol para decidir qué endpoints consultar
    if (role === null) return;

    const fetchStats = async () => {
      try {
        const baseFetches = [
          fetch('/api/usuario', { cache: 'no-store' }),
          fetch('/api/vehiculo', { cache: 'no-store' }),
          fetch('/api/vale/mostrarAprobados', { cache: 'no-store' }),
          fetch('/api/obra', { cache: 'no-store' }),
        ] as const;

        // Solo pedir vales pendientes si corresponde
        const pendingFetch = canSeePending
          ? fetch('/api/vale?aprobado=false', { cache: 'no-store' })
          : null;

        const [uRes, vRes, vaRes, oRes, vpRes] = await Promise.all([
          ...baseFetches,
          pendingFetch ?? Promise.resolve(new Response(JSON.stringify([]))),
        ]);

        const [uJson, vJson, vaJson, oJson, vpJson] = await Promise.all([
          uRes.json(),
          vRes.json(),
          vaRes.json(),
          oRes.json(),
          vpRes.json(),
        ]);

        const usuariosCount = Array.isArray(uJson)
          ? uJson.length
          : Array.isArray(uJson?.usuarios)
          ? uJson.usuarios.length
          : 0;

        setStats({
          usuarios: usuariosCount,
          vehiculos: Array.isArray(vJson) ? vJson.length : 0,
          valesPendientes: Array.isArray(vpJson) ? vpJson.length : 0,
          valesAprobados: Array.isArray(vaJson) ? vaJson.length : 0,
          obras: Array.isArray(oJson) ? oJson.length : 0,
        });
      } catch (e) {
        console.error('Error cargando estadísticas', e);
      }
    };

    fetchStats();
  }, [role, canSeePending]);

  return (
    <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card title="Usuarios" count={stats.usuarios} href="/users" color="bg-gray-200" />
      <Card title="Vehículos" count={stats.vehiculos} href="/vehicles" color="bg-gray-100" />
      {canSeePending && (
        <Card
          title="Vales Pendientes"
          count={stats.valesPendientes}
          href="/vales-pendientes"
          color="bg-gray-200"
        />
      )}
      <Card title="Vales Aprobados" count={stats.valesAprobados} href="/vales-aprobados" color="bg-gray-100" />
      <Card title="Obras registradas" count={stats.obras} href="/obras" color="bg-gray-200" />
    </main>
  );
}

function Card({
  title,
  count,
  href,
  color,
}: {
  title: string;
  count: number;
  href: string;
  color: string;
}) {
  return (
    <Link href={href} className={`p-4 rounded-xl shadow-md hover:shadow-lg transition ${color}`}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-2xl font-bold">{count}</p>
      <button className="mt-4 bg-black text-white px-3 py-1 rounded">Ver todos</button>
    </Link>
  );
}
