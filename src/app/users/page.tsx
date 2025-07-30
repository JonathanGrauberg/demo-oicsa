export const dynamic = "force-dynamic";

import { Usuario } from "@/lib/types/types";

async function getUsuarios() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/usuario`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // para forzar siempre datos frescos
  });

  if (!res.ok) {
    throw new Error("Error al obtener usuarios");
  }

  return res.json();
}

export default async function Home() {
  const data: { usuarios: Array<Usuario> } = await getUsuarios();

  return (
    <div>
      <h1 className="text-3xl font-bold pl-auto">Página de usuarios</h1>
      <main className="flex min-h-screen flex-col items-center p-24">
        <ul className="w-auto min-h-14 h-auto border round-sm p-3">
          {data.usuarios && data.usuarios.map((u: Usuario) => (
            <li key={u.id}>{u.nombre} {u.apellido} - {u.email}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}
