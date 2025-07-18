// src/app/api/vale/aprobar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    // Obtener datos del vale
    const valeRes = await pool.query(
      `SELECT combustible_lubricante, litros FROM vale WHERE id = $1`,
      [id]
    );

    if (valeRes.rows.length === 0) {
      return NextResponse.json({ error: 'Vale no encontrado' }, { status: 404 });
    }

    const { combustible_lubricante, litros } = valeRes.rows[0];

    // Buscar insumo en stock
    const stockRes = await pool.query(
      `SELECT id, cantidad FROM stock WHERE nombre = $1`,
      [combustible_lubricante]
    );

    if (stockRes.rows.length === 0) {
      return NextResponse.json({ error: 'Insumo no encontrado en stock' }, { status: 404 });
    }

    const { id: stockId, cantidad: cantidadActual } = stockRes.rows[0];

// Asegurar conversión a número (PostgreSQL NUMERIC llega como string)
const cantidadEnNumero = Number(cantidadActual);
const litrosEnNumero = Number(litros);

if (cantidadEnNumero < litrosEnNumero) {
  return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 });
}

const nuevaCantidad = cantidadEnNumero - litrosEnNumero;

    await pool.query(
      `UPDATE stock SET cantidad = $1 WHERE id = $2`,
      [nuevaCantidad, stockId]
    );

    // Marcar vale como aprobado
    await pool.query(
      `UPDATE vale SET aprobado = true, aprobado_por = $1 WHERE id = $2`,
      [1, id] // Cambiar 1 por el id del usuario real si tenés auth
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al aprobar vale:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
