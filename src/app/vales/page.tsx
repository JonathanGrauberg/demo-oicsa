'use client';

import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

export default function ValesPage() {
  const [vales, setVales] = useState<any[]>([]);

  useEffect(() => {
    const fetchVales = async () => {
      const res = await fetch('/api/vale');
      if (!res.ok) {
        console.error('Error al obtener vales');
        return;
      }
      const data = await res.json();
      setVales(data);
    };
    fetchVales();
  }, []);

  const generarExcel = () => {
    const data = vales.map(v => ({
      ID: v.id,
      Combustible: v.combustible_lubricante,
      Litros: v.litros,
      Vehiculo: v.vehiculo,
      Obra: v.obra,
      Destino: v.destino,
      Chofer: v.chofer,
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
      doc.text(`Vehiculo: ${vale.vehiculo}`, 20, y + 15);
      doc.text(`Obra: ${vale.obra}`, 20, y + 20);
      doc.text(`Destino: ${vale.destino}`, 20, y + 25);
      doc.text(`Chofer: ${vale.chofer}`, 20, y + 30);
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
      <h1 className="text-2xl font-bold text-black">Todos los Vales</h1>
      <div className="mb-4 flex gap-4 mt-4">
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
      <div className="bg-white rounded-lg p-4 shadow mt-4">
        {vales.length === 0 && <p>No hay vales registrados.</p>}
        <ul>
          {vales.map(vale => (
            <li
              key={vale.id}
              className="border-b border-gray-300 py-2"
            >
              <span>ID: {vale.id}</span> |{' '}
              <span>{vale.vehiculo}</span> |{' '}
              <span>{vale.obra}</span> |{' '}
              <span>{vale.aprobado ? 'Aprobado' : 'Pendiente'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
