import { Obra } from '@/lib/types/obra';

export async function obtenerObras(): Promise<Obra[]> {
  const res = await fetch(`/api/obra`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Error al obtener obras');
  }

  return res.json();
}
