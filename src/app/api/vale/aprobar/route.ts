import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'clave-secreta';

export async function POST(req: NextRequest) {
  let client: any;
  try {
    // 1) Auth: sacar aprobador desde el token
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const decoded = jwt.verify(token, SECRET_KEY) as { id: number; rol: string };
    const aprobadorId = decoded.id;

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID de vale requerido' }, { status: 400 });

    // 2) Traer vale
    const valeRes = await pool.query(
      `SELECT combustible_lubricante, litros, origen
       FROM vale
       WHERE id = $1`,
      [id]
    );
    if (valeRes.rows.length === 0) {
      return NextResponse.json({ error: 'Vale no encontrado' }, { status: 404 });
    }

    const { combustible_lubricante, litros, origen } = valeRes.rows[0];

    // 3) Si es estación: aprobar sin tocar stock
    if (origen === 'estacion') {
      await pool.query(
        `UPDATE vale SET aprobado = true, aprobado_por = $1 WHERE id = $2`,
        [aprobadorId, id]
      );
      return NextResponse.json({ success: true, message: 'Vale aprobado (sin descuento de stock).' });
    }

    // 4) Obrador: transacción para descontar stock y aprobar
    client = await pool.connect();
    await client.query('BEGIN');

    // Bloqueo pesimista del ítem de stock
    const stockRes = await client.query(
      `SELECT id, cantidad
       FROM stock
       WHERE nombre = $1
       FOR UPDATE`,
      [combustible_lubricante]
    );
    if (stockRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Insumo no encontrado en stock' }, { status: 404 });
    }

    const { id: stockId, cantidad } = stockRes.rows[0];
    const disponible = Number(cantidad);
    const reqLitros = Number(litros);

    if (Number.isNaN(reqLitros) || reqLitros <= 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Cantidad de litros inválida' }, { status: 400 });
    }

    if (disponible < reqLitros) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 });
    }

    const nuevaCantidad = disponible - reqLitros;

    await client.query(
      `UPDATE stock SET cantidad = $1 WHERE id = $2`,
      [nuevaCantidad, stockId]
    );

    await client.query(
      `UPDATE vale SET aprobado = true, aprobado_por = $1 WHERE id = $2`,
      [aprobadorId, id]
    );

    await client.query('COMMIT');

    return NextResponse.json({ success: true, message: 'Vale aprobado y stock actualizado.' });
  } catch (error) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch {}
    }
    console.error('Error al aprobar vale:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  } finally {
    if (client) client.release?.();
  }
}
