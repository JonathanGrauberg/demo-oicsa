'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

type Vale = {
  id: number;
  combustible_lubricante: string;
  litros: number;
  vehiculo: number;
  obra: string;
  destino: string;
  encargado: string;
  fecha: string;
  aprobado: boolean;
  kilometraje: number;
  creado_en: string;
  solicitado_nombre: string;
  solicitado_apellido: string;
  marca: string;
  modelo: string;
  patente: string;
};

export default function ValesAprobados() {
  const [vales, setVales] = useState<Vale[]>([]);

  useEffect(() => {
  fetch('/api/vale/mostrarAprobados')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) setVales(data);
      else {
        console.error('❌ Respuesta inesperada del backend:', data);
        setVales([]);
      }
    })
    .catch(err => {
      console.error('❌ Error al obtener vales aprobados:', err);
      setVales([]);
    });
}, []);


  const imprimirVale = (vale: Vale) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('VALE DE COMBUSTIBLE', 20, 20);

    let y = 35;
    doc.setFontSize(12);
    doc.text(`ID: ${vale.id}`, 20, y); y += 8;
    doc.text(`Solicitado por: ${vale.solicitado_nombre} ${vale.solicitado_apellido}`, 20, y); y += 8;
    doc.text(`Vehículo: ${vale.marca} ${vale.modelo} (${vale.patente})`, 20, y); y += 8;
    doc.text(`Chofer: ${vale.encargado}`, 20, y); y += 8;
    doc.text(`Obra: ${vale.obra}`, 20, y); y += 8;
    doc.text(`Destino: ${vale.destino}`, 20, y); y += 8;
    doc.text(`Combustible: ${vale.combustible_lubricante}`, 20, y); y += 8;
    doc.text(`Litros: ${vale.litros}`, 20, y); y += 8;
    doc.text(`Kilometraje: ${vale.kilometraje}`, 20, y); y += 16;

    doc.text('Firma del encargado/supervisor:', 20, y);
    doc.line(20, y + 5, 100, y + 5);

    doc.save(`vale_${vale.id}.pdf`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vales Aprobados</h1>
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Solicitado por</th>
            <th className="p-2">Combustible</th>
            <th className="p-2">Litros</th>
            <th className="p-2">Vehículo</th>
            <th className="p-2">Obra</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Chofer</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vales.length > 0 ? (
            vales.map(vale => (
              <tr key={vale.id} className="border-t border-gray-200">
                <td className="p-2">{vale.solicitado_nombre} {vale.solicitado_apellido}</td>
                <td className="p-2">{vale.combustible_lubricante}</td>
                <td className="p-2">{vale.litros}</td>
                <td className="p-2">{vale.vehiculo}</td>
                <td className="p-2">{vale.obra}</td>
                <td className="p-2">{new Date(vale.fecha).toLocaleDateString()}</td>
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
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-2 text-center text-gray-500">
                No hay vales aprobados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
