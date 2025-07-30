import { StockItem } from '@/lib/types/stock';

export async function obtenerStock(): Promise<StockItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/stock`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Error al obtener el stock');
  return res.json();
}
