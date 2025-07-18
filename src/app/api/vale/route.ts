// app/api/vale/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { Vale } from '@/lib/types/vale';

export async function POST(req: Request) {
  try {
    const data: Vale = await req.json();
    const {
      combustible_lubricante,
      litros,
      vehiculo,
      obra,
      destino,
      encargado,
      solicitado_por,
      fecha,
      kilometraje
    } = data;

    const query = `
      INSERT INTO vale (
        combustible_lubricante, litros, vehiculo, obra, destino, encargado,
        solicitado_por, fecha, kilometraje, aprobado, creado_en
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,false,NOW())
      RETURNING *;
    `;

    const values = [
      combustible_lubricante,
      litros,
      vehiculo,
      obra,
      destino,
      encargado,
      solicitado_por,
      fecha,
      kilometraje
    ];

    const result = await pool.query(query, values);
    return NextResponse.json({ vale: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error al crear vale:', error);
    return NextResponse.json({ error: 'Error al crear vale' }, { status: 500 });
  }
}

// GET corregido para vales pendientes y aprobados
export async function GET(req: NextRequest) {
  try {
    const aprobado = req.nextUrl.searchParams.get('aprobado'); 

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
        u.nombre AS solicitado_nombre,
        u.apellido AS solicitado_apellido,
        veh.marca,
        veh.modelo,
        veh.patente
      FROM vale v
      LEFT JOIN usuario u ON v.solicitado_por = u.id
      LEFT JOIN vehiculo veh ON v.vehiculo::int = veh.id
    `;

    const params: any[] = [];

    if (aprobado !== null) {
      query += ` WHERE v.aprobado = $1`;
      params.push(aprobado === 'true');
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener vales:', error);
    return NextResponse.json({ error: 'Error al obtener vales' }, { status: 500 });
  }
}
