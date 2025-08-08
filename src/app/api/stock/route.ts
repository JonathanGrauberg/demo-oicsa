import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Asegurate de tener tu pool configurado

// ✅ GET: Listar todos los productos en stock
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, nombre, tipo, cantidad, unidad, creado_en
      FROM stock
      ORDER BY tipo, nombre
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener stock:', error);
    return NextResponse.json({ error: 'Error al obtener stock' }, { status: 500 });
  }
}

// ✅ POST: Crear nuevo producto en stock
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, tipo, cantidad, unidad } = body;

    // Validaciones básicas
    if (!nombre || !tipo || !cantidad || !unidad) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO stock (nombre, tipo, cantidad, unidad)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombre, tipo, cantidad, unidad]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear stock:', error);
    return NextResponse.json({ error: 'Error al crear insumo' }, { status: 500 });
  }
}

// ✅ PUT: Actualizar cantidad de un insumo en stock
export async function PUT(req: NextRequest) {
  try {
    const { id, cantidad } = await req.json();

    if (!id || cantidad === undefined) {
      return NextResponse.json({ error: 'Faltan datos para actualizar' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE stock
       SET cantidad = $1, creado_en = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [cantidad, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    return NextResponse.json({ error: 'Error al actualizar stock' }, { status: 500 });
  }
}
