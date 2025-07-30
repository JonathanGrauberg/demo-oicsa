import { Usuario } from "@/lib/types/types"

async function getUsuarios() {
  const fetchData = await fetch('http://localhost:3000/api/usuario', {
    headers: {
      "Content-Type": 'application/json'
    }
  });
  const res = await fetchData.json();

  return res;
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
