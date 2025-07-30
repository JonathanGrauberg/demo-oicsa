import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';

// POST - Crear nuevo usuario
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { nombre, apellido, email, rol, password } = data;

    if (!nombre || !apellido || !email || !rol || !password) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO usuario (nombre, apellido, email, rol, password)
       VALUES ($1, $2, $3, $4, $5)`,
      [nombre, apellido, email, rol.toLowerCase(), hashedPassword]
    );

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 });
  }
}

// GET - Obtener todos los usuarios
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, nombre, apellido, email, rol FROM usuario ORDER BY id DESC`
    );

    return NextResponse.json({ usuarios: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}
