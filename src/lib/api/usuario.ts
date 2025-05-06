import { Usuario } from '@/lib/types/usuario';

export async function registrarUsuario(data: Usuario) {
  const res = await fetch('/api/usuario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error al registrar el usuario');
  }

  return res.json();
}
