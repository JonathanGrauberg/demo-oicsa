'use client';
export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

export default function ValesPage() {
  const [vales, setVales] = useState<any[]>([]);
  const [filtroObra, setFiltroObra] = useState('');
  const [filtroDesde, setFiltroDesde] = useState(''); // nuevo
  const [filtroHasta, setFiltroHasta] = useState(''); // nuevo
  const [filtroOrigen, setFiltroOrigen] = useState('');

  // ✅ Usar baseUrl correctamente
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // 🔹 Función para obtener datos
  const fetchVales = async () => {
    const params = new URLSearchParams();
    if (filtroObra) params.append('obra', filtroObra);
    if (filtroDesde) params.append('desde', filtroDesde);
    if (filtroHasta) params.append('hasta', filtroHasta);
    if (filtroOrigen) params.append('origen', filtroOrigen);

    try {
      const query = params.toString();
      const res = await fetch(`${baseUrl}/api/vale${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error('Error al obtener vales');

      const data = await res.json();
      setVales(data);
    } catch (error) {
      console.error(error);
      setVales([]);
    }
  };

  useEffect(() => {
    fetchVales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generarExcel = () => {
    const data = vales.map(v => ({
      Nro: v.id,
      Fecha: new Date(v.fecha).toLocaleDateString(),
      Origen: v.origen,
      Insumo: v.combustible_lubricante,
      Litros: v.litros,
      Vehículo: `${v.marca} ${v.modelo} (${v.patente ?? v.vehiculo ?? ''})`,
      Kilometraje: v.kilometraje,
      Obra: v.obra,
      Encargado: v.encargado,
    }));

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Vales');
    XLSX.writeFile(workbook, 'vales.xlsx');
  };

  const generarPDFTodos = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Listado de Vales', 20, 20);
    doc.setFontSize(12);

    let y = 30;
    vales.forEach(vale => {
      doc.text(`N°: ${vale.id}`, 20, y);
      doc.text(`Fecha: ${new Date(vale.fecha).toLocaleDateString()}`, 20, y + 5);
      doc.text(`Origen: ${vale.origen}`, 20, y + 10);
      doc.text(`Insumo: ${vale.combustible_lubricante}`, 20, y + 15);
      doc.text(`Litros: ${vale.litros}`, 20, y + 20);
      doc.text(`Vehículo: ${vale.marca} ${vale.modelo} (${vale.patente ?? vale.vehiculo ?? ''})`, 20, y + 25);
      doc.text(`Kilometraje: ${vale.kilometraje}`, 20, y + 30);
      doc.text(`Obra: ${vale.obra}`, 20, y + 35);
      doc.text(`Encargado: ${vale.encargado}`, 20, y + 40);

      y += 55;
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save('todos_los_vales.pdf');
  };

  const limpiarFiltros = () => {
    setFiltroObra('');
    setFiltroDesde('');
    setFiltroHasta('');
    setFiltroOrigen('');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black">Historial de Vales</h1>

      {/* 🔎 Filtros */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4 mt-4">
        <input
          className="border rounded p-2"
          placeholder="Filtrar por Obra..."
          value={filtroObra}
          onChange={(e) => setFiltroObra(e.target.value)}
        />

        {/* Desde / Hasta */}
        <div className="flex gap-2">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600">Desde</label>
            <input
              className="border rounded p-2"
              type="date"
              value={filtroDesde}
              onChange={(e) => setFiltroDesde(e.target.value)}
              max={filtroHasta || undefined}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600">Hasta</label>
            <input
              className="border rounded p-2"
              type="date"
              value={filtroHasta}
              onChange={(e) => setFiltroHasta(e.target.value)}
              min={filtroDesde || undefined}
            />
          </div>
        </div>

        <select
          className="border rounded p-2"
          value={filtroOrigen}
          onChange={(e) => setFiltroOrigen(e.target.value)}
        >
          <option value="">Todos los orígenes</option>
          <option value="obrador">Obrador</option>
          <option value="estacion">Estación de servicio</option>
        </select>

        <button
          onClick={fetchVales}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>

        <button
          onClick={() => { limpiarFiltros(); fetchVales(); }}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
        >
          Limpiar
        </button>

        <div className="flex gap-2">
          <button
            onClick={generarExcel}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Exportar a Excel
          </button>
          <button
            onClick={generarPDFTodos}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Exportar a PDF
          </button>
        </div>
      </div>

      {/* 📋 Tabla */}
      <div className="bg-white rounded-lg p-4 shadow mt-4">
        {vales.length === 0 && <p>No hay vales registrados.</p>}
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">N°</th>
              <th className="border border-gray-300 p-2">Fecha</th>
              <th className="border border-gray-300 p-2">Origen</th>
              <th className="border border-gray-300 p-2">Insumo</th>
              <th className="border border-gray-300 p-2">Litros</th>
              <th className="border border-gray-300 p-2">Vehículo</th>
              <th className="border border-gray-300 p-2">Kilometraje</th>
              <th className="border border-gray-300 p-2">Obra</th>
              <th className="border border-gray-300 p-2">Encargado</th>
            </tr>
          </thead>
          <tbody>
            {vales.map(vale => (
              <tr key={vale.id}>
                <td className="border border-gray-300 p-2">{vale.id}</td>
                <td className="border border-gray-300 p-2">{new Date(vale.fecha).toLocaleDateString()}</td>
                <td className="border border-gray-300 p-2">{vale.origen}</td>
                <td className="border border-gray-300 p-2">{vale.combustible_lubricante}</td>
                <td className="border border-gray-300 p-2">{vale.litros}</td>
                <td className="p-2">
                  {vale.marca} {vale.modelo} ({vale.patente ?? vale.vehiculo ?? ''})
                </td>
                <td className="border border-gray-300 p-2">{vale.kilometraje}</td>
                <td className="border border-gray-300 p-2">{vale.obra}</td>
                <td className="border border-gray-300 p-2">{vale.encargado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
