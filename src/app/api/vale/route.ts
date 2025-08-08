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
        v.origen,
        u.nombre AS solicitado_nombre,
        u.apellido AS solicitado_apellido,
        COALESCE(veh.marca, '') AS marca,
        COALESCE(veh.modelo, '') AS modelo,
        COALESCE(veh.patente, '') AS patente
      FROM vale v
      LEFT JOIN usuario u ON v.solicitado_por = u.id
      LEFT JOIN vehiculo veh 
        ON v.vehiculo ~ '^[0-9]+$' 
        AND CAST(v.vehiculo AS INTEGER) = veh.id
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



// ✅ POST para registrar nuevo vale
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 Datos recibidos para crear vale:", body); // 🟢 DEBUG

    const {
      combustible_lubricante,
      litros,
      vehiculo,
      obra,
      destino,
      encargado,
      solicitado_por,
      fecha,
      kilometraje,
      origen
    } = body;

    // Validaciones
    if (
      !combustible_lubricante ||
      !litros ||
      !vehiculo ||
      !obra ||
      !destino ||
      !encargado ||
      !solicitado_por ||
      !fecha ||
      !origen
    ) {
      console.warn("⚠️ Campos faltantes:", body);
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Insertar en la DB
    const result = await pool.query(
      `INSERT INTO vale 
      (combustible_lubricante, litros, vehiculo, obra, destino, encargado, solicitado_por, fecha, kilometraje, origen, aprobado) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,false)
      RETURNING *`,
      [combustible_lubricante, litros, vehiculo, obra, destino, encargado, solicitado_por, fecha, kilometraje, origen]
    );

    console.log("✅ Vale creado correctamente:", result.rows[0]);
    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error("🔥 Error al crear vale:", error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
