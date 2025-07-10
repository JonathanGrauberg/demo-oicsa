// app/api/vehiculo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      tipo,
      marca,
      modelo,
      patente,
      ano,
      kilometraje,
      chasis,
      motor,
      neumaticos_delantero,
      neumaticos_traseros,
      aceite_motor,
      aceite_caja,
      filtro_aceite,
      combustible,
      filtro_aire_primario,
      filtro_aire_secundario,
      filtro_combustible_primario,
      filtro_combustible_secundario,
      observaciones,
    } = body;

    const query = `
      INSERT INTO vehiculo (
        tipo, marca, modelo, patente, ano, kilometraje, chasis, motor,
        neumaticos_delantero, neumaticos_traseros,
        aceite_motor, aceite_caja,
        filtro_aceite, combustible,
        filtro_aire_primario, filtro_aire_secundario,
        filtro_combustible_primario, filtro_combustible_secundario,
        observaciones
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10,
        $11, $12,
        $13, $14,
        $15, $16,
        $17, $18,
        $19
      )
      RETURNING *;
    `;

    const values = [
      tipo,
      marca,
      modelo,
      patente,
      ano,
      kilometraje,
      chasis,
      motor,
      neumaticos_delantero,
      neumaticos_traseros,
      aceite_motor,
      aceite_caja,
      filtro_aceite,
      combustible,
      filtro_aire_primario,
      filtro_aire_secundario,
      filtro_combustible_primario,
      filtro_combustible_secundario,
      observaciones,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({ vehiculo: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error al registrar vehículo:', error);
    return NextResponse.json({ message: 'Error al registrar vehículo', error }, { status: 500 });
  }
}
// ✅ AQUÍ AGREGAMOS EL GET
export async function GET(req: NextRequest) {
  try {
    const result = await pool.query('SELECT id, marca, modelo, patente FROM vehiculo');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener vehículos' }, { status: 500 });
  }
}

