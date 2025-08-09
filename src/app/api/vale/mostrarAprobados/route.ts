// app/api/vale/mostrarAprobados/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const obra   = req.nextUrl.searchParams.get('obra');
    const fecha  = req.nextUrl.searchParams.get('fecha');
    const origen = req.nextUrl.searchParams.get('origen');

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
        v.origen,
        v.creado_en,
        u.nombre  AS solicitado_nombre,
        u.apellido AS solicitado_apellido,
        veh.marca,
        veh.modelo,
        veh.patente
      FROM vale v
      LEFT JOIN usuario u ON v.solicitado_por = u.id
      -- 👇 Match por id numérico O por patente (case-insensitive)
      LEFT JOIN LATERAL (
        SELECT vv.marca, vv.modelo, vv.patente
        FROM vehiculo vv
        WHERE (
          (v.vehiculo ~ '^[0-9]+$' AND vv.id = CAST(v.vehiculo AS INTEGER))
          OR
          (LOWER(vv.patente) = LOWER(v.vehiculo))
        )
        ORDER BY vv.id
        LIMIT 1
      ) AS veh ON TRUE
      WHERE v.aprobado = true
    `;

    const params: any[] = [];
    let i = 1;

    if (obra) {
      query += ` AND LOWER(v.obra) LIKE LOWER($${i++})`;
      params.push(`%${obra}%`);
    }
    if (fecha) {
      query += ` AND DATE(v.fecha) = $${i++}`;
      params.push(fecha);
    }
    if (origen) {
      query += ` AND v.origen = $${i++}`;
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