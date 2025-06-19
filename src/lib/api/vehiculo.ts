import { Vehiculo } from '@/lib/types/vehiculo';

export async function registrarVehiculo(data: Vehiculo) {
  const res = await fetch('/api/vehiculo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error al registrar el vehículo');
  }

  return res.json();
}
