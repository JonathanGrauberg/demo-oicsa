import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'clave-secreta';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log("📩 POST /api/auth/login ejecutado");
    console.log("🔑 Datos recibidos:", email);

    // ✅ Buscar usuario directamente desde la tabla usuario
    const result = await pool.query(
      `SELECT id, nombre, apellido, email, password, rol 
       FROM usuario 
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      console.warn("❌ Usuario no encontrado:", email);
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const user = result.rows[0];
    console.log("🎯 Rol encontrado en DB:", user.rol);

    // ✅ Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.warn("⚠️ Contraseña incorrecta para:", email);
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    // ✅ Normalizar el rol
    const normalizedRole = user.rol.trim().toLowerCase();
    console.log("🛠 Rol normalizado:", normalizedRole);

    // ✅ Generar token JWT
    const token = jwt.sign(
      { id: user.id, rol: normalizedRole, email: user.email },
      SECRET_KEY,
      { expiresIn: '8h' }
    );

    console.log("🔑 Token generado con rol:", normalizedRole);

    // ✅ Crear respuesta y setear cookie
    const response = NextResponse.json({
      message: 'Login exitoso',
      token,
      rol: normalizedRole,
      nombre: user.nombre,
      apellido: user.apellido
    });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 horas
      path: '/'
    });

    console.log("✅ Login exitoso para:", email);
    return response;
  } catch (error) {
    console.error('🔥 Error en login:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
