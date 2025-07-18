import { obtenerStock } from "@/lib/api/stock";
import { StockItem } from "@/lib/types/stock";

export default async function StockPage() {
  let stock: StockItem[] = [];

  try {
    stock = await obtenerStock();
  } catch (error) {
    console.error("Error al obtener el stock:", error);
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Stock de Combustibles y Lubricantes</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Cantidad</th>
              <th className="px-4 py-2 text-left">Unidad</th>
              <th className="px-4 py-2 text-left">Fecha de carga</th>
            </tr>
          </thead>
          <tbody>
            {stock.length > 0 ? (
              stock.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.nombre}</td>
                  <td className="px-4 py-2">{item.tipo}</td>
                  <td className="px-4 py-2">{item.cantidad}</td>
                  <td className="px-4 py-2">{item.unidad}</td>
                  <td className="px-4 py-2">
                    {new Date(item.creado_en).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan={5}>
                  No hay stock registrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
