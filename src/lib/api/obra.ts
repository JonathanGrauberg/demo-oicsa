import { Obra } from '@/lib/types/obra';

export async function obtenerObras(): Promise<Obra[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/obra`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Error al obtener obras');
  }

  return res.json();
}
