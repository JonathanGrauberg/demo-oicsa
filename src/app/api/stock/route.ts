import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

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
    let { nombre, tipo, cantidad, unidad } = body;

    // Normalizaciones básicas
    nombre = String(nombre ?? '').trim();
    tipo = String(tipo ?? '').trim();
    const unidadNorm = String(unidad ?? '').trim().toLowerCase(); // 👉 'litros' | 'kilogramos'
    const cantidadNum = Number(cantidad);

    // Validaciones
    if (!nombre || !tipo || !unidadNorm || Number.isNaN(cantidadNum)) {
      return NextResponse.json(
        { error: 'Faltan campos o cantidad inválida' },
        { status: 400 }
      );
    }
    if (!['litros', 'kilogramos'].includes(unidadNorm)) {
      return NextResponse.json(
        { error: "Unidad inválida. Use 'litros' o 'kilogramos'." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO stock (nombre, tipo, cantidad, unidad)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombre, tipo, cantidadNum, unidadNorm]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error al crear stock:', error);
    // Mostrar detalle de Postgres si existe
    const pgDetail = error?.detail || error?.message || 'Error al crear insumo';
    return NextResponse.json({ error: pgDetail }, { status: 500 });
  }
}

// ✅ PUT: Actualizar cantidad de un insumo en stock
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = Number(body?.id);
    const cantidadNum = Number(body?.cantidad);

    if (!id || Number.isNaN(cantidadNum)) {
      return NextResponse.json({ error: 'Faltan datos para actualizar' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE stock
       SET cantidad = $1
       WHERE id = $2
       RETURNING *`,
      [cantidadNum, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Ítem no encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    return NextResponse.json({ error: 'Error al actualizar stock' }, { status: 500 });
  }
}

// ✅ DELETE: Eliminar ítem de stock
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Falta id' }, { status: 400 });
    }

    const result = await pool.query('DELETE FROM stock WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Ítem no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Error al eliminar stock:', e);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
