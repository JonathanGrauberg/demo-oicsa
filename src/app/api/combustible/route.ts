import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT DISTINCT combustible FROM vehiculo 
      WHERE combustible IS NOT NULL AND TRIM(combustible) <> ''
    `);
    const combustibles = result.rows.map((row) => row.combustible);
    return NextResponse.json(combustibles);
  } catch (error) {
    console.error('Error al obtener combustibles:', error);
    return NextResponse.json({ error: 'Error al obtener combustibles' }, { status: 500 });
  }
}
