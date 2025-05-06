import { UsuarioPayload } from "@/types/types"

async function getusuario() {
  const fetchData = await fetch('http://localhost:3000/api/usuario', {
    headers: {
    "content-Type": 'application/json'
  }
  })
  const res = await fetchData.json()

  return res

}

export default async function Home() {
  const usuario: { usuario: Array<UsuarioPayload> }= await getusuario()
  return (
    <div>
      <h1 className="text-3xl font-bold pl-auto">Pagina de usuarios</h1>
      <main className="flex min-h-screen flex-col items-center p-24">
       <ul className="w-auto min-h-14 h-auto border round-sm p-3">
          {usuario && usuario.map((usuario: UsuarioPayload) => (<li key={usuario.id}>{usuario.username} - {usuario.email}</li>))}
       </ul>
      </main>
    </div>  
  );
}
