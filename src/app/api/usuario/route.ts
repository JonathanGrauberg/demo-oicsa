import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { Persona } from '@/lib/types/persona';
import { Empleado } from '@/lib/types/empleado';
import { Usuario } from '@/lib/types/usuario';

export async function POST(req: Request) {
  const data = await req.json();

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insertar persona
    const persona: Omit<Persona, 'id'> = {
      nombre: data.nombre,
      apellido: data.apellido,
      fecha_nacimiento: data.fecha_nacimiento,
      numero_documento: parseInt(data.numero_documento),
    };

    const personaResult = await client.query(
      `INSERT INTO personas (nombre, apellido, fecha_nacimiento, numero_documento)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [persona.nombre, persona.apellido, persona.fecha_nacimiento, persona.numero_documento]
    );

    const id_persona = personaResult.rows[0].id;

    // 2. Insertar empleado
    const empleado: Omit<Empleado, 'id' | 'fecha_baja'> = {
      id_persona,
      id_cargo: cargoToId(data.cargo),
      id_estado_empleado: estadoToId(data.estado_empleado),
      fecha_alta: data.fecha_alta,
    };

    const empleadoResult = await client.query(
      `INSERT INTO empleado (id_persona, id_cargo, id_estado_empleado, fecha_alta)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [empleado.id_persona, empleado.id_cargo, empleado.id_estado_empleado, empleado.fecha_alta]
    );

    const id_empleado = empleadoResult.rows[0].id;

    // 3. Insertar usuario
    const usuario: Omit<Usuario, 'id'> = {
      username: data.username,
      password: data.password,
      id_rol: rolToId(data.rol),
      id_empleado,
      email: '' // lo podés omitir si no usás email por ahora
    };

    await client.query(
      `INSERT INTO usuario (username, password, id_rol, id_empleado, email)
       VALUES ($1, $2, $3, $4, $5)`,
      [usuario.username, usuario.password, usuario.id_rol, usuario.id_empleado, usuario.email]
    );

    await client.query('COMMIT');
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al registrar usuario:', error);
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 });

  } finally {
    client.release();
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.email, r.nombre AS rol
       FROM usuario u
       JOIN rol r ON u.id_rol = r.id`
    );

    return NextResponse.json({ usuario: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}


// Función auxiliar: convierte nombre de cargo a id
function cargoToId(cargo: string): number {
  switch (cargo.toLowerCase()) {
    case 'administrativo': return 1;
    case 'chofer': return 2;
    default: return 1;
  }
}

// Función auxiliar: convierte nombre de rol a id
function rolToId(rol: string): number {
  switch (rol.toLowerCase()) {
    case 'chofer': return 1;
    case 'supervisor': return 2;
    case 'administrativo': return 3;
    case 'super usuario': return 4;
    default: return 1;
  }
}

// Función auxiliar: convierte nombre de estado a id
function estadoToId(estado: string): number {
  switch (estado.toLowerCase()) {
    case 'activo': return 1;
    case 'inactivo': return 2;
    case 'licencia': return 3;
    default: return 1;
  }
}

