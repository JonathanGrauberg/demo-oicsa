// app/api/vale/mostrarAprobados/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT 
        v.id,
        v.combustible_lubricante,
        v.litros,
        v.vehiculo,
        v.obra,
        v.destino,
        v.encargado,
        v.solicitado_por,
        v.fecha,
        v.aprobado,
        v.kilometraje,
        v.creado_en,
        u.nombre AS solicitado_nombre,
        u.apellido AS solicitado_apellido
      FROM vale v
      LEFT JOIN usuario u ON v.solicitado_por = u.id
      WHERE v.aprobado = true
      ORDER BY v.fecha DESC;
    `;

    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('💥 Error al obtener vales aprobados:', error);
    return NextResponse.json({ error: 'Error al obtener vales aprobados' }, { status: 500 });
  }
}
