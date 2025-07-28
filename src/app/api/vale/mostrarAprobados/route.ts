// app/api/vale/mostrarAprobados/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const obra = req.nextUrl.searchParams.get('obra');
    const fecha = req.nextUrl.searchParams.get('fecha');
    const origen = req.nextUrl.searchParams.get('origen'); // ✅ Nuevo filtro

    let query = `
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
        v.origen, -- ✅ Mostrar origen
        v.creado_en,
        u.nombre AS solicitado_nombre,
        u.apellido AS solicitado_apellido,
        veh.marca,
        veh.modelo,
        veh.patente
      FROM vale v
      LEFT JOIN usuario u ON v.solicitado_por = u.id
      LEFT JOIN vehiculo veh ON v.vehiculo = veh.patente
      WHERE v.aprobado = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (obra) {
      query += ` AND LOWER(v.obra) LIKE LOWER($${paramIndex++})`;
      params.push(`%${obra}%`);
    }

    if (fecha) {
      query += ` AND DATE(v.fecha) = $${paramIndex++}`;
      params.push(fecha);
    }

    if (origen) { 
      query += ` AND v.origen = $${paramIndex++}`;
      params.push(origen);
    }

    query += ` ORDER BY v.fecha DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('💥 Error al obtener vales aprobados:', error);
    return NextResponse.json({ error: 'Error al obtener vales aprobados' }, { status: 500 });
  }
}
