// app/api/vale/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const aprobado = req.nextUrl.searchParams.get('aprobado');
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
        v.creado_en,
        v.origen, -- ✅ nuevo campo
        u.nombre AS solicitado_nombre,
        u.apellido AS solicitado_apellido,
        veh.marca,
        veh.modelo,
        veh.patente
      FROM vale v
      LEFT JOIN usuario u ON v.solicitado_por = u.id
      LEFT JOIN vehiculo veh ON v.vehiculo = veh.patente
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (aprobado !== null) {
      query += ` AND v.aprobado = $${paramIndex++}`;
      params.push(aprobado === 'true');
    }

    if (origen !== null) {
      query += ` AND v.origen = $${paramIndex++}`;
      params.push(origen);
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener vales:', error);
    return NextResponse.json({ error: 'Error al obtener vales' }, { status: 500 });
  }
}
