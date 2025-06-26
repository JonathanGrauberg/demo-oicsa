import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ existe: false }, { status: 400 }); // Mejor status para indicar error de cliente
  }

  try {
    const result = await pool.query(
      'SELECT 1 FROM usuario WHERE email = $1',
      [email]
    );
    const existe = (result.rowCount ?? 0) > 0;

    return NextResponse.json({ existe }); // Ahora no falla el tipado
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al verificar email' }, { status: 500 }); 
  }
}
