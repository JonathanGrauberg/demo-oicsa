// src/app/api/vale/aprobar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    await pool.query(
      `UPDATE vale SET aprobado = true, aprobado_por = $1 WHERE id = $2`,
      [1, id] // Reemplaza 1 por el id del usuario logueado cuando tengas auth
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al aprobar' }, { status: 500 });
  }
}
