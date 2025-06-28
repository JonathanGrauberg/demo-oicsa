'use client';

import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

export default function ValesPage() {
  const [vales, setVales] = useState<any[]>([]);
  const [filtroObra, setFiltroObra] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  useEffect(() => {
    const fetchVales = async () => {
      const params = new URLSearchParams();
      if (filtroObra) params.append('obra', filtroObra);
      if (filtroFecha) params.append('fecha', filtroFecha);

      const res = await fetch(`/api/vale?${params.toString()}`);
      if (!res.ok) {
        console.error('Error al obtener vales');
        return;
      }
      const data = await res.json();
      setVales(data);
    };
    fetchVales();
  }, [filtroObra, filtroFecha]);

  const generarExcel = () => {
    const data = vales.map(v => ({
      ID: v.id,
      Combustible: v.combustible_lubricante,
      Litros: v.litros,
      Vehiculo: `${v.marca} ${v.modelo} (${v.vehiculo})`,
      Obra: v.obra,
      Destino: v.destino,
      encargado: v.encargado,
      Fecha: v.fecha,
      Aprobado: v.aprobado ? 'Sí' : 'No',
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
      doc.text(`ID: ${vale.id}`, 20, y);
      doc.text(`Combustible: ${vale.combustible_lubricante}`, 20, y + 5);
      doc.text(`Litros: ${vale.litros}`, 20, y + 10);
      doc.text(`Vehiculo: ${vale.marca} ${vale.modelo} (${vale.vehiculo})`, 20, y + 15);
      doc.text(`Obra: ${vale.obra}`, 20, y + 20);
      doc.text(`Destino: ${vale.destino}`, 20, y + 25);
      doc.text(`encargado: ${vale.encargado}`, 20, y + 30);
      doc.text(`Fecha: ${vale.fecha}`, 20, y + 35);
      doc.text(`Aprobado: ${vale.aprobado ? 'Sí' : 'No'}`, 20, y + 40);

      y += 55;

      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save('todos_los_vales.pdf');
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black">Historial de Vales</h1>

      <div className="mb-4 flex flex-col sm:flex-row gap-4 mt-4">
        <input
          className="border rounded p-2"
          placeholder="Filtrar por Obra..."
          value={filtroObra}
          onChange={(e) => setFiltroObra(e.target.value)}
        />
        <input
          className="border rounded p-2"
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />
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

      <div className="bg-white rounded-lg p-4 shadow mt-4">
        {vales.length === 0 && <p>No hay vales registrados.</p>}
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Fecha</th>
              <th className="border border-gray-300 p-2">Obra</th>
              <th className="border border-gray-300 p-2">Destino</th>
              <th className="border border-gray-300 p-2">Vehiculo</th>
              <th className="border border-gray-300 p-2">encargado</th>
              <th className="border border-gray-300 p-2">Aprobado</th>
            </tr>
          </thead>
          <tbody>
            {vales.map(vale => (
              <tr key={vale.id}>
                <td className="border border-gray-300 p-2">{vale.id}</td>
                <td className="border border-gray-300 p-2">{vale.fecha}</td>
                <td className="border border-gray-300 p-2">{vale.obra}</td>
                <td className="border border-gray-300 p-2">{vale.destino}</td>
                <td className="border border-gray-300 p-2">
                  {vale.marca} {vale.modelo} ({vale.vehiculo})
                </td>
                <td className="border border-gray-300 p-2">{vale.encargado}</td>
                <td className="border border-gray-300 p-2">{vale.aprobado ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
