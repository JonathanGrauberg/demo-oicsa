import { Usuario as UsuarioType } from "@/lib/types/types";

async function fetchUsuarios() {
  const fetchData = await fetch('http://localhost:3000/api/usuario', {
    headers: {
      "Content-Type": 'application/json'
    }
  });
  const res = await fetchData.json()

  return res

}

export default async function Home() {
  const data: { usuario: Array<UsuarioType> } = await fetchUsuarios();

  return (
    <div>
      <h1 className="text-3xl font-bold pl-auto">esto es parte del menu panel de control</h1>
      <main className="flex min-h-screen flex-col items-center p-24">
        <ul className="w-auto min-h-14 h-auto border round-sm p-3">
          {data.usuario && data.usuario.map((u: UsuarioType) => (
            <li key={u.id}>{u.username} - {u.email}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}
