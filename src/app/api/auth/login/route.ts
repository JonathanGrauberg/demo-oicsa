import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'clave-secreta';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const result = await pool.query(
      `SELECT id, nombre, apellido, email, password, rol FROM usuario WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol, nombre: user.nombre },
      SECRET_KEY,
      { expiresIn: '8h' }
    );

    const response = NextResponse.json({ message: 'Login exitoso' });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
