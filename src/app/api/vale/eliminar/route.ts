// app/api/vale/eliminar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    await pool.query('DELETE FROM vale WHERE id = $1', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar vale:', error);
    return NextResponse.json({ error: 'Error al eliminar vale' }, { status: 500 });
  }
}
