export const dynamic = "force-dynamic";

import { Obra } from "@/lib/types/obra";


async function getObras() {
  const res = await fetch('http://localhost:3000/api/obra', {
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Error al obtener obras');
  }

  return res.json();
}

export default async function ObrasPage() {
  const obras: Obra[] = await getObras();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Listado de obras registradas</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-left">Ubicación</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Fecha creación</th>
            </tr>
          </thead>
          <tbody>
            {obras.length > 0 ? (
              obras.map((obra) => (
                <tr key={obra.id} className="border-t">
                  <td className="px-4 py-2">{obra.nombre}</td>
                  <td className="px-4 py-2">{obra.descripcion || '-'}</td>
                  <td className="px-4 py-2">{obra.ubicacion || '-'}</td>
                  <td className="px-4 py-2">{obra.estado}</td>
                  <td className="px-4 py-2">{new Date(obra.creado_en).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan={5}>
                  No hay obras registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
