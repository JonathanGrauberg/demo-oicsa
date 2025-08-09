import { Usuario, UsuarioCreate } from '@/lib/types/usuario';

export async function registrarUsuario(data: UsuarioCreate) {
  const res = await fetch('/api/usuario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al registrar el usuario');
  return res.json();
}

// Para poblar un <select> con choferes
export async function obtenerChoferes(): Promise<Usuario[]> {
  const res = await fetch('/api/usuario?rol=chofer', { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener choferes');
  const json = await res.json();
  return json.usuarios as Usuario[];
}
