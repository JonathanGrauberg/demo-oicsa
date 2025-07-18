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
