import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { nombre, descripcion, ubicacion, estado } = await req.json();

    const result = await pool.query(
      `INSERT INTO obra (nombre, descripcion, ubicacion, estado)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombre, descripcion, ubicacion, estado || 'En progreso']
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creando obra:', error);
    return NextResponse.json({ error: 'Error creando obra' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await pool.query(`SELECT * FROM obra ORDER BY creado_en DESC`);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo obras:', error);
    return NextResponse.json({ error: 'Error obteniendo obras' }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    const { id, nombre, descripcion, ubicacion, estado } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Falta id' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE obra
       SET nombre = COALESCE($2, nombre),
           descripcion = $3,
           ubicacion = $4,
           estado = COALESCE($5, estado)
       WHERE id = $1
       RETURNING id, nombre, descripcion, ubicacion, estado, creado_en`,
      [id, nombre ?? null, descripcion ?? null, ubicacion ?? null, estado ?? null]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Obra no encontrada' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (e) {
    console.error('Error al actualizar obra:', e);
    return NextResponse.json({ error: 'Error al actualizar obra' }, { status: 500 });
  }
}