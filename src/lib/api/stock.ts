import { StockItem } from '@/lib/types/stock';

// 👉 Obtener todo el stock
export async function obtenerStock(): Promise<StockItem[]> {
  const res = await fetch('http://localhost:3000/api/stock', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Error al obtener el stock');
  return res.json();
}
