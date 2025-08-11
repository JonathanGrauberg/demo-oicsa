// NUEVO GET seguro y compatible con UI
// src/app/api/vale/route.ts  
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const aprobado = url.searchParams.get('aprobado');      // 'true' | 'false' | null
    const obra     = url.searchParams.get('obra');          // string | null
    const origen   = url.searchParams.get('origen');        // 'obrador' | 'estacion' | '' | null
    const desde    = url.searchParams.get('desde');         // 'YYYY-MM-DD' | null
    const hasta    = url.searchParams.get('hasta');         // 'YYYY-MM-DD' | null

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
        u.nombre  AS solicitado_nombre,
        u.apellido AS solicitado_apellido,
        veh.marca,
        veh.modelo,
        veh.patente
      FROM vale v
      LEFT JOIN usuario u ON u.id = v.solicitado_por
      LEFT JOIN LATERAL (
        SELECT vv.marca, vv.modelo, vv.patente
        FROM vehiculo vv
        WHERE (
          (v.vehiculo ~ '^[0-9]+$' AND vv.id = CAST(v.vehiculo AS INTEGER))
          OR (LOWER(vv.patente) = LOWER(v.vehiculo))
        )
        ORDER BY vv.id
        LIMIT 1
      ) AS veh ON TRUE
      WHERE 1=1
    `;

    const params: any[] = [];
    let i = 1;
    const choferId = url.searchParams.get('chofer_id'); // nuevo

    if (aprobado !== null) {
      query += ` AND v.aprobado = $${i++}`;
      params.push(aprobado === 'true');
    }
    if (obra) {
      query += ` AND v.obra ILIKE $${i++}`;
      params.push(`%${obra}%`);
    }
    if (origen) {
      query += ` AND v.origen = $${i++}`;
      params.push(origen);
    }

    // 🔸 Rango de fechas (inclusivo). Si tu columna v.fecha es TIMESTAMP, usá el bloque A.
    // A) v.fecha es TIMESTAMP -> 'hasta' exclusivo + 1 día (cubre todo el día)
    if (desde) {
      query += ` AND v.fecha >= $${i++}::date`;
      params.push(desde);
    }
    if (hasta) {
      query += ` AND v.fecha < ($${i++}::date + INTERVAL '1 day')`;
      params.push(hasta);
    }

    if (choferId) {
       query += ` AND v.solicitado_por = $${i++}`;
        params.push(Number(choferId));
}

    // // B) Si v.fecha es DATE puro, reemplazá las 2 líneas de 'hasta' por esta:
    // if (hasta) {
    //   query += ` AND v.fecha <= $${i++}::date`;
    //   params.push(hasta);
    // }

    query += ` ORDER BY v.fecha DESC, v.id DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('🔥 Error al obtener vales:', error);
    return NextResponse.json({ error: 'Error al obtener vales' }, { status: 500 });
  }
}





/** ✅ POST: crea vale, pero si origen = 'obrador' valida stock ANTES de insertar */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
      origen,
    } = body ?? {};

    // Validaciones básicas
    if (
      !combustible_lubricante ||
      litros === undefined ||
      !vehiculo ||
      !obra ||
      !destino ||
      !encargado ||
      !solicitado_por ||
      !fecha ||
      !origen
    ) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Normalizo valores
    const origenNorm = String(origen).toLowerCase();
    const litrosNum = Number(litros);

    if (!Number.isFinite(litrosNum) || litrosNum <= 0) {
      return NextResponse.json({ error: 'Litros inválidos' }, { status: 400 });
    }

    // ✅ Validación previa de stock SOLO si es obrador
    if (origenNorm === 'obrador') {
      const stockRes = await pool.query(
        `SELECT cantidad FROM stock WHERE LOWER(nombre) = LOWER($1) LIMIT 1`,
        [combustible_lubricante]
      );

      if (stockRes.rows.length === 0) {
        return NextResponse.json(
          { error: 'Insumo no existe en el stock del obrador' },
          { status: 400 }
        );
      }

      const disponible = Number(stockRes.rows[0].cantidad ?? 0);
      if (!Number.isFinite(disponible) || disponible < litrosNum) {
        return NextResponse.json(
          { error: `Stock insuficiente en obrador. Disponible: ${disponible}` },
          { status: 400 }
        );
      }
    }

    // 👇 Insertar (sin descontar stock; eso ocurre al APROBAR)
    const result = await pool.query(
      `INSERT INTO vale
        (combustible_lubricante, litros, vehiculo, obra, destino, encargado,
         solicitado_por, fecha, kilometraje, origen, aprobado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,false)
       RETURNING *`,
      [
        combustible_lubricante,
        litrosNum,
        vehiculo,
        obra,
        destino,
        encargado,
        solicitado_por,
        fecha,
        kilometraje ?? null,
        origenNorm,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('🔥 Error al crear vale:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}