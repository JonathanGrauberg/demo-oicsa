'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

type Vale = {
  id: number;
  combustible_lubricante: string;
  litros: number;
  vehiculo: number;
  obra: string;
  destino: string;
  encargado: string; // fallback si no vienen los solicitado_*
  fecha: string;     // viene como 'YYYY-MM-DD' o 'YYYY-MM-DDTHH:mm:ss.sssZ' desde Postgres
  aprobado: boolean;
  kilometraje: number;
  creado_en: string;
  solicitado_nombre: string;
  solicitado_apellido: string;
  marca: string;
  modelo: string;
  patente: string;
  origen: 'obrador' | 'estacion' | string;
};

export default function ValesAprobados() {
  const [vales, setVales] = useState<Vale[]>([]);
  const [obra, setObra] = useState('');
  const [fecha, setFecha] = useState('');
  const [origen, setOrigen] = useState('');
  const [encargadoLogueado, setEncargadoLogueado] = useState<string>('Encargado');

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/auth/me', { cache: 'no-store' });
        if (r.ok) {
          const me = await r.json();
          const nombre = [me?.nombre, me?.apellido].filter(Boolean).join(' ').trim();
          if (nombre) setEncargadoLogueado(nombre);
        }
      } catch {}
    })();
  }, []);

  const fetchVales = () => {
    const params = new URLSearchParams();
    if (obra) params.append('obra', obra);
    if (fecha) params.append('fecha', fecha);
    if (origen) params.append('origen', origen);

    fetch(`/api/vale/mostrarAprobados?${params.toString()}`)
      .then(res => res.json())
      .then(data => setVales(Array.isArray(data) ? data : []))
      .catch(() => setVales([]));
  };

  useEffect(() => {
    fetchVales();
  }, []);

  // helpers
  const loadImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

  // ✅ Formatear fecha de string plano a DD-MM-YYYY sin Date()
  const formatFechaPlano = (s: string) => {
    if (!s) return '';
    // Caso timestamp ISO: 2025-08-13T03:00:00.000Z
    const mTs = /^(\d{4})-(\d{2})-(\d{2})T/.exec(s);
    if (mTs) {
      const [, y, mm, dd] = mTs;
      return `${dd}-${mm}-${y}`;
    }
    // Caso simple: 2025-08-13
    const mSimple = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (mSimple) {
      const [, y, mm, dd] = mSimple;
      return `${dd}-${mm}-${y}`;
    }
    // Cualquier otro formato: devolver tal cual
    return s;
  };

  // nombre del chofer desde solicitado_* con fallback a encargado
  const nombreChoferDe = (v: Vale) =>
    [v.solicitado_nombre, v.solicitado_apellido].filter(Boolean).join(' ').trim() || v.encargado || '';

  const imprimirVale = async (vale: Vale) => {
    // ===== Config rápidos =====
    const TOP_OFFSET = -2;        // ⬆️ sube/baja TODO el recuadro (mm)
    const SIGN_LABEL_OFFSET = 14; // ⬇️ distancia desde el borde inferior del recuadro a las firmas (mm)

    // 👉 Documento A4 vertical (vale A6 apaisado centrado arriba)
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'A4' });

    // ===== Geometría base del vale (A6 landscape) =====
    const A6_W = 148; // ancho en mm
    const A6_H = 105; // alto en mm
    const baseMargin = 8;
    const baseW = A6_W;
    const baseH = A6_H;

    // ===== Posicionamiento en A4 (arriba, centrado) =====
    const A4_W = doc.internal.pageSize.getWidth(); // 210 mm
    const topOffset = TOP_OFFSET;
    const leftOffset = (A4_W - baseW) / 2; // centrado horizontal

    // Helpers para trasladar todo el layout original
    const TX = (x: number) => leftOffset + x;
    const TY = (y: number) => topOffset + y;

    // ===== Layout ORIGINAL (A6 landscape) =====
    const margin = baseMargin;
    const pageW = baseW;
    const pageH = baseH;
    const cardX = margin;
    const cardY = margin;
    const cardW = pageW - margin * 2;
    const cardH = pageH - margin * 2 - 8; // dejamos 8mm libres abajo (las firmas van fuera)
    const radius = 4;

    // marca de agua
    try {
      const logo = await loadImage('/img/oicsa.png');
      const wmW = cardW * 0.85;
      const ratio = logo.height / logo.width;
      const wmH = wmW * ratio;
      const wmX = cardX + (cardW - wmW) / 2;
      const wmY = cardY + (cardH - wmH) / 2;
      doc.addImage(logo, 'PNG', TX(wmX), TY(wmY), wmW, wmH, undefined, 'FAST');
    } catch {}

    // borde
    doc.setDrawColor(0);
    doc.setLineWidth(0.6);
    doc.roundedRect(TX(cardX), TY(cardY), cardW, cardH, radius, radius, 'S');

    // título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('VALE POR INSUMO', TX(cardX + 8), TY(cardY + 10));

    // subtítulo "solo válido en ..."
    const subtitulo =
      'SOLO VÁLIDO EN ' + (vale.origen?.toLowerCase() === 'estacion' ? 'ESTACIÓN' : 'OBRADOR');
    doc.setFontSize(12);
    doc.text(subtitulo, TX(cardX + 8), TY(cardY + 16));

    // línea separadora
    doc.setLineWidth(0.4);
    doc.line(TX(cardX + 8), TY(cardY + 18.5), TX(cardX + cardW - 8), TY(cardY + 18.5));

    // Nº y fecha (arriba derecha) — mostrar fecha formateada DD-MM-YYYY
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const rightX = cardX + cardW - 8;
    doc.text(`Nº: ${vale.id}`, TX(rightX), TY(cardY + 8), { align: 'right' });
    doc.text(`Fecha: ${formatFechaPlano(vale.fecha)}`, TX(rightX), TY(cardY + 13), { align: 'right' });

    // columnas
    const colGap = 14;
    const colW = (cardW - 8 * 2 - colGap) / 2;
    const col1X = cardX + 8;
    const col2X = col1X + colW + colGap;
    let y = cardY + 28;
    const lineH = 6;

    // Fila con negrita/size para valores de 'Insumo' y 'Lts/Kg'
    const row = (labelL: string, valueL: string, labelR: string, valueR: string) => {
      // izquierda
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(labelL, TX(col1X), TY(y));

      // valor izquierda
      if (labelL === 'Insumo:') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
      }
      const leftLines = doc.splitTextToSize(valueL || '-', colW);
      doc.text(leftLines, TX(col1X), TY(y + 5));

      // derecha
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(labelR, TX(col2X), TY(y));

      // valor derecha
      if (labelR === 'Lts/Kg:') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
      }
      const rightLines = doc.splitTextToSize(valueR || '-', colW);
      doc.text(rightLines, TX(col2X), TY(y + 5));

      const maxLines = Math.max(leftLines.length, rightLines.length);
      y += maxLines * lineH + 6;
    };

    row('KM:', String(vale.kilometraje ?? ''), 'Dominio:', vale.patente || '');
    // chofer correcto
    row('Retiro (Chofer):', nombreChoferDe(vale), 'Obra:', vale.obra || '');
    row('Marca:', vale.marca || '', 'Modelo:', vale.modelo || '');
    row('Insumo:', vale.combustible_lubricante || '', 'Lts/Kg:', String(vale.litros ?? ''));

    // Firmas (fuera del recuadro, más abajo)
    const labelsY = cardY + cardH + SIGN_LABEL_OFFSET;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Firma Chofer: ${nombreChoferDe(vale)}`, TX(col1X), TY(labelsY));
    doc.text(`Firma Encargado: ${encargadoLogueado}`, TX(col2X), TY(labelsY));

    doc.save(`vale_${vale.id}.pdf`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vales Aprobados</h1>

      {/* Filtros */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          className="border rounded p-2"
          placeholder="Filtrar por Obra..."
          value={obra}
          onChange={(e) => setObra(e.target.value)}
        />
        <input
          className="border rounded p-2"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <select
          className="border rounded p-2"
          value={origen}
          onChange={(e) => setOrigen(e.target.value)}
        >
          <option value="">Todos los orígenes</option>
          <option value="obrador">Obrador</option>
          <option value="estacion">Estación de servicio</option>
        </select>
        <button onClick={fetchVales} className="bg-blue-600 text-white px-4 py-2 rounded">
          Buscar
        </button>
      </div>

      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">N°</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Origen</th>
            <th className="p-2">Combustible/Lubricante</th>
            <th className="p-2">Litros</th>
            <th className="p-2">Vehículo</th>
            <th className="p-2">Kilometraje</th>
            <th className="p-2">Obra</th>
            <th className="p-2">Chofer</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vales.length > 0 ? (
            vales.map((vale) => (
              <tr key={vale.id} className="border-t border-gray-200">
                <td className="p-2">{vale.id}</td>
                {/* ✅ Fecha formateada DD-MM-YYYY sin Date() */}
                <td className="p-2">{formatFechaPlano(vale.fecha)}</td>
                <td className="p-2">{vale.origen}</td>
                <td className="p-2">{vale.combustible_lubricante}</td>
                <td className="p-2">{vale.litros}</td>
                <td className="p-2">
                  {vale.marca} {vale.modelo} ({vale.patente})
                </td>
                <td className="p-2">{vale.kilometraje}</td>
                <td className="p-2">{vale.obra}</td>
                {/* chofer correcto también en la tabla */}
                <td className="p-2">{nombreChoferDe(vale)}</td>
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
              <td colSpan={10} className="p-2 text-center text-gray-500">
                No hay vales aprobados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
