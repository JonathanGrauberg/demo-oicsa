'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

type Vale = {
  id: number;
  combustible_lubricante: string;
  litros: number;
  vehiculo: string;
  encargado: string;
  aprobado: boolean;
  kilometraje: number;
};

export default function ValesAprobados() {
  const [vales, setVales] = useState<Vale[]>([]);

  useEffect(() => {
    fetch('/api/vale?aprobado=true') // Aprobados
      .then(res => res.json())
      .then(data => setVales(data));
  }, []);

  const imprimirVale = (vale: Vale) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('VALE DE COMBUSTIBLE', 20, 20);

  doc.setFontSize(12);
  let y = 35;

  doc.text(`ID: ${vale.id}`, 20, y); y += 8;
  doc.text(`Vehículo: ${vale.vehiculo}`, 20, y); y += 8;
  doc.text(`Encargado/Supervisor: ${vale.encargado}`, 20, y); y += 8;
  doc.text(`Combustible/Lubricante: ${vale.combustible_lubricante}`, 20, y); y += 8;
  doc.text(`Litros: ${vale.litros}`, 20, y); y += 8;
  doc.text(`Kilometraje: ${vale.kilometraje}`, 20, y); y += 16;

  // Línea de firma
  doc.text("Firma del encargado/supervisor:", 20, y);
  doc.line(20, y + 5, 100, y + 5); // línea para firmar

  doc.save(`vale_${vale.id}.pdf`);
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vales Aprobados</h1>
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Combustible</th>
            <th className="p-2">Litros</th>
            <th className="p-2">Vehículo</th>
            <th className="p-2">encargado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vales.map(vale => (
            <tr key={vale.id} className="border-t border-gray-200">
              <td className="p-2">{vale.id}</td>
              <td className="p-2">{vale.combustible_lubricante}</td>
              <td className="p-2">{vale.litros}</td>
              <td className="p-2">{vale.vehiculo}</td>
              <td className="p-2">{vale.encargado}</td>
              <td className="p-2">
                <button
                  onClick={() => imprimirVale(vale)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Imprimir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
