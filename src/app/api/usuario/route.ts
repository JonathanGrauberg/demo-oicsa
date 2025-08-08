import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'clave-secreta';

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

// PUT - Cambiar rol (solo superusuario)
// PUT - Cambiar rol (solo superusuario)
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
    }

    // Solo superusuario puede cambiar roles
    if (decoded.rol !== 'superusuario') {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 });
    }

    const { id, rol } = await req.json();

    const rolesPermitidos = ['superusuario', 'administrativo', 'encargado', 'aprobador'];
    if (!id || !rol || !rolesPermitidos.includes(rol)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE usuario SET rol = $1 WHERE id = $2 RETURNING id, nombre, apellido, email, rol`,
      [rol, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ usuario: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    return NextResponse.json({ error: 'Error al actualizar rol' }, { status: 500 });
  }
}
