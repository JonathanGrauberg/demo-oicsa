import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// NUEVO GET seguro y compatible con UI
export async function GET(req: NextRequest) {
  try {
    const aprobado = req.nextUrl.searchParams.get('aprobado'); // 'true' | 'false' | null

    // Resolvemos vehículo de forma segura:
    // - Si v.vehiculo es numérico -> lo tomamos como id
    // - Si no -> buscamos por patente (case-insensitive)
    let query = `
      SELECT
        v.id,
        v.combustible_lubricante,
        v.litros,
        v.vehiculo,               -- lo devolvemos igual por compatibilidad
        v.obra,
        v.destino,
        v.encargado,              -- si tu tabla usa 'chofer', cámbialo aquí o haz alias
        v.solicitado_por,
        v.fecha,
        v.aprobado,
        v.kilometraje,
        v.creado_en,
        v.origen,
        u.nombre  AS solicitado_nombre,
        u.apellido AS solicitado_apellido,
        veh.marca,
        veh.modelo,
        -- si no hay match por id/patente dejamos patente null;
        -- si quisieras, podrías hacer un COALESCE con v.vehiculo
        veh.patente
      FROM vale v
      LEFT JOIN usuario u ON u.id = v.solicitado_por
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
      WHERE 1=1
    `;

    const params: any[] = [];
    let i = 1;

    if (aprobado !== null) {
      query += ` AND v.aprobado = $${i++}`;
      params.push(aprobado === 'true');
    }

    query += ` ORDER BY v.id DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('🔥 Error al obtener vales:', error);
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
