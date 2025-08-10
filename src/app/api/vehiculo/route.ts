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
    const id = req.nextUrl.searchParams.get('id');
    if (id) {
      const r = await pool.query(`SELECT * FROM vehiculo WHERE id = $1`, [id]);
      if (r.rowCount === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      return NextResponse.json(r.rows[0], { status: 200 });
    }
    const result = await pool.query(
      `SELECT id, marca, modelo, patente, kilometraje FROM vehiculo ORDER BY id DESC`
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener vehículos' }, { status: 500 });
  }
}

// PUT: actualización dinámica (múltiples campos)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body || {};
    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 });

    // Campos permitidos a actualizar
    const allowed = [
      'tipo','marca','modelo','patente','ano','kilometraje','chasis','motor',
      'neumaticos_delantero','neumaticos_traseros',
      'aceite_motor','aceite_caja',
      'filtro_aceite','combustible',
      'filtro_aire_primario','filtro_aire_secundario',
      'filtro_combustible_primario','filtro_combustible_secundario',
      'observaciones'
    ] as const;

    const sets: string[] = [];
    const values: any[] = [];
    let i = 1;

    for (const key of allowed) {
      if (key in rest) {
        sets.push(`${key} = $${++i}`);
        values.push((rest as any)[key]);
      }
    }

    if (sets.length === 0) {
      return NextResponse.json({ error: 'Nada para actualizar' }, { status: 400 });
    }

    const sql = `
      UPDATE vehiculo SET ${sets.join(', ')}
      WHERE id = $1
      RETURNING *`;
    const result = await pool.query(sql, [id, ...values]);

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    return NextResponse.json({ error: 'Error al actualizar vehículo' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const client = await pool.connect();
  try {
    const { id, unlink } = await req.json();
    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 });

    // Traer patente
    const { rows: vehRows } = await client.query('SELECT patente FROM vehiculo WHERE id = $1', [id]);
    if (vehRows.length === 0) return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
    const patente: string = vehRows[0].patente;

    // Contar referencias en vales: por id numérico o por patente
    const { rows: refRows } = await client.query(
      `
      SELECT COUNT(*)::int AS c
      FROM vale v
      WHERE
        (v.vehiculo ~ '^[0-9]+$' AND CAST(v.vehiculo AS INTEGER) = $1)
        OR (LOWER(v.vehiculo) = LOWER($2))
      `,
      [id, patente]
    );
    const refs = refRows[0]?.c ?? 0;

    if (refs > 0 && !unlink) {
      return NextResponse.json(
        { error: 'Vehículo referenciado en vales', referencias: refs },
        { status: 409 }
      );
    }

    await client.query('BEGIN');

    if (refs > 0 && unlink) {
      // Desvincular: pasar todo a patente en texto
      await client.query(
        `
        UPDATE vale
        SET vehiculo = $2
        WHERE
          (vehiculo ~ '^[0-9]+$' AND CAST(vehiculo AS INTEGER) = $1)
          OR (LOWER(vehiculo) = LOWER($2))
        `,
        [id, patente]
      );
    }

    const del = await client.query('DELETE FROM vehiculo WHERE id = $1', [id]);
    if (del.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
    }

    await client.query('COMMIT');
    return NextResponse.json({ success: true });
  } catch (e) {
    try { await client.query('ROLLBACK'); } catch {}
    console.error('Error al eliminar vehiculo:', e);
    return NextResponse.json({ error: 'Error al eliminar vehículo' }, { status: 500 });
  } finally {
    client.release();
  }
}