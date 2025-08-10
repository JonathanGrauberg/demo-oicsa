'use client';
export const dynamic = "force-dynamic";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    usuarios: 0,
    vehiculos: 0,
    valesPendientes: 0,
    valesAprobados: 0,
    obras: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [uRes, vRes, vpRes, vaRes, oRes] = await Promise.all([
          fetch('/api/usuario', { cache: 'no-store' }),
          fetch('/api/vehiculo', { cache: 'no-store' }),
          fetch('/api/vale?aprobado=false', { cache: 'no-store' }),
          fetch('/api/vale/mostrarAprobados', { cache: 'no-store' }),
          fetch('/api/obra', { cache: 'no-store' }),
        ]);

        const [uJson, vJson, vpJson, vaJson, oJson] = await Promise.all([
          uRes.json(),
          vRes.json(),
          vpRes.json(),
          vaRes.json(),
          oRes.json(),
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
        // opcional: podrías setear 0s o mantener anteriores
      }
    };
    fetchStats();
  }, []);

  return (
    <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card title="Usuarios" count={stats.usuarios} href="/users" color="bg-gray-200" />
      <Card title="Vehículos" count={stats.vehiculos} href="/vehicles" color="bg-gray-100" />
      <Card title="Vales Pendientes" count={stats.valesPendientes} href="/vales-pendientes" color="bg-gray-200" />
      <Card title="Vales Aprobados" count={stats.valesAprobados} href="/vales-aprobados" color="bg-gray-100" />
      <Card title="Obras registradas" count={stats.obras} href="/obras" color="bg-gray-200" />
    </main>
  );
}

function Card({ title, count, href, color }: { title: string; count: number; href: string; color: string }) {
  return (
    <Link href={href} className={`p-4 rounded-xl shadow-md hover:shadow-lg transition ${color}`}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-2xl font-bold">{count}</p>
      <button className="mt-4 bg-black text-white px-3 py-1 rounded">Ver todos</button>
    </Link>
  );
}
