import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'clave-secreta';

// POST - Crear nuevo usuario (chofer: sin password)
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { nombre, apellido, email, rol, password } = data ?? {};

    if (!nombre || !apellido || !email || !rol) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const rolLower = String(rol).toLowerCase();

    // Validar roles permitidos
    const rolesPermitidos = ['superusuario', 'administrativo', 'encargado', 'aprobador', 'chofer'];
    if (!rolesPermitidos.includes(rolLower)) {
      return NextResponse.json({ error: 'Rol inválido' }, { status: 400 });
    }

    // Si no es chofer, password es obligatorio
    let hashedPassword: string | null = null;
    if (rolLower !== 'chofer') {
      if (!password || typeof password !== 'string' || password.length < 6) {
        return NextResponse.json({ error: 'La contraseña es requerida y debe tener al menos 6 caracteres' }, { status: 400 });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await pool.query(
      `INSERT INTO usuario (nombre, apellido, email, rol, password)
       VALUES ($1, $2, $3, $4, $5)`,
      [nombre, apellido, email, rolLower, hashedPassword]
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 });
  }
}

// GET - Obtener usuarios (opcional: filtrar por rol)
export async function GET(req: NextRequest) {
  try {
    const rol = req.nextUrl.searchParams.get('rol')?.toLowerCase();
    let query = `SELECT id, nombre, apellido, email, rol FROM usuario`;
    const params: any[] = [];

    if (rol) {
      query += ` WHERE rol = $1`;
      params.push(rol);
    }
    query += ` ORDER BY id DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json({ usuarios: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

// PUT - Cambiar rol (solo superusuario)
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
    }

    if (decoded.rol !== 'superusuario') {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 });
    }

    const { id, rol } = await req.json();
    const rolLower = String(rol).toLowerCase();

    const rolesPermitidos = ['superusuario', 'administrativo', 'encargado', 'aprobador', 'chofer'];
    if (!id || !rolLower || !rolesPermitidos.includes(rolLower)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE usuario SET rol = $1 WHERE id = $2 RETURNING id, nombre, apellido, email, rol`,
      [rolLower, id]
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


export async function DELETE(req: NextRequest) {
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

    if (decoded.rol !== 'superusuario') {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    // No permitir eliminarse a sí mismo
    if (decoded.id === id) {
      return NextResponse.json({ error: 'No podés eliminar tu propio usuario' }, { status: 400 });
    }

    // (Opcional) Evitar quedarte sin superusuarios:
    // const { rows } = await pool.query(`SELECT COUNT(*)::int AS c FROM usuario WHERE rol='superusuario'`);
    // if (rows[0].c <= 1) {
    //   return NextResponse.json({ error: 'Debe quedar al menos un superusuario' }, { status: 400 });
    // }

    const result = await pool.query(`DELETE FROM usuario WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}
