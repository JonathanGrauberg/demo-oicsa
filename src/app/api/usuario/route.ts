import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM usuario');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nombre, apellido, fecha_nacimiento, documento, cargo, username, password, rol } = await req.json();

    // Insertar en tabla persona
    const personaResult = await query(
      `INSERT INTO persona (nombre, apellido, fecha_nacimiento, documento)
       VALUES ($1, $2, $3, $4) RETURNING id_persona`,
      [nombre, apellido, fecha_nacimiento, documento]
    );

    const id_persona = personaResult[0]?.id_persona;
    if (!id_persona) throw new Error('No se pudo crear persona');

    // Insertar en tabla empleado
    const empleadoResult = await query(
      `INSERT INTO empleado (id_persona, cargo) VALUES ($1, $2) RETURNING id_empleado`,
      [id_persona, cargo]
    );

    const id_empleado = empleadoResult[0]?.id_empleado;
    if (!id_empleado) throw new Error('No se pudo crear empleado');

    // Insertar en tabla usuario
    const usuarioResult = await query(
      `INSERT INTO usuario (id_empleado, username, password, rol) VALUES ($1, $2, $3, $4) RETURNING id_usuario`,
      [id_empleado, username, password, rol]
    );

    const id_usuario = usuarioResult[0]?.id_usuario;
    if (!id_usuario) throw new Error('No se pudo crear usuario');

    return NextResponse.json({ success: true, id_usuario });
  } catch (error: any) {
    console.error('Error al registrar usuario:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
