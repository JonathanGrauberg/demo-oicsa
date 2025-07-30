import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'clave-secreta';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { id: number; rol: string };

    // 🔹 Obtener datos completos del usuario
    const result = await pool.query(
      `SELECT id, nombre, apellido, email, rol 
       FROM usuario 
       WHERE id = $1`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const user = result.rows[0];

    return NextResponse.json({
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
    });
  } catch (error) {
    console.error('Error en /api/auth/me:', error);
    return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 403 });
  }
}
