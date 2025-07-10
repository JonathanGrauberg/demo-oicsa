import { Vehiculo } from "@/lib/types/vehiculo";

async function getVehiculos() {
  const fetchData = await fetch('http://localhost:3000/api/vehiculo', {
    headers: {
      "Content-Type": 'application/json'
    },
    cache: 'no-store'
  });

  return fetchData.json();
}

export default async function VehiculosPage() {
  const vehiculos: Array<Vehiculo> = await getVehiculos();

  return (
    <div>
      <h1 className="text-3xl font-bold">Vehículos registrados</h1>
      <main className="flex min-h-screen flex-col items-center p-6">
        <ul className="w-full max-w-3xl border rounded p-4 space-y-2">
          {vehiculos && vehiculos.length > 0 ? (
            vehiculos.map((v) => (
              <li key={v.id} className="border-b pb-2">
                <strong>{v.marca} {v.modelo}</strong> - Patente: {v.patente} - Motor: {v.motor}
              </li>
            ))
          ) : (
            <li>No hay vehículos registrados.</li>
          )}
        </ul>
      </main>
    </div>
  );
}
