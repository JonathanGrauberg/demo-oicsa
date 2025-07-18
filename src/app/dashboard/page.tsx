'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    usuarios: 0,
    vehiculos: 0,
    valesPendientes: 0,
    valesAprobados: 0,
    obras: 0, // ✅ nuevo contador
  });

  useEffect(() => {
    const fetchStats = async () => {
      const usuarios = await fetch('/api/usuario').then(res => res.json());
      const vehiculos = await fetch('/api/vehiculo').then(res => res.json());
      const valesPendientes = await fetch('/api/vale?aprobado=false').then(res => res.json());
      const valesAprobados = await fetch('/api/vale/mostrarAprobados').then(res => res.json());
      const obras = await fetch('/api/obra').then(res => res.json()); // ✅ consulta nueva

      setStats({
        usuarios: usuarios.length,
        vehiculos: vehiculos.length,
        valesPendientes: valesPendientes.length,
        valesAprobados: valesAprobados.length,
        obras: obras.length, // ✅ actualización de estado
      });
    };
    fetchStats();
  }, []);

  return (
    <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card title="Usuarios" count={stats.usuarios} href="/users" color="bg-blue-100" />
      <Card title="Vehículos" count={stats.vehiculos} href="/vehicles" color="bg-green-100" />
      <Card title="Vales Pendientes" count={stats.valesPendientes} href="/vales-pendientes" color="bg-yellow-100" />
      <Card title="Vales Aprobados" count={stats.valesAprobados} href="/vales-aprobados" color="bg-purple-100" />
      <Card title="Obras registradas" count={stats.obras} href="/obras" color="bg-red-100" /> {/* ✅ nueva tarjeta */}
    </main>
  );
}

// ✅ Componente de tarjeta
function Card({ title, count, href, color }: { title: string; count: number; href: string; color: string }) {
  return (
    <Link href={href} className={`p-4 rounded-xl shadow-md hover:shadow-lg transition ${color}`}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-2xl font-bold">{count}</p>
      <button className="mt-4 bg-black text-white px-3 py-1 rounded">Ver todos</button>
    </Link>
  );
}
