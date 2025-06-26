import { Vale } from '@/lib/types/vale';

export async function registrarVale(data: Vale) {
  const res = await fetch('/api/vale', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error al registrar el vale');
  }

  return res.json();
}
