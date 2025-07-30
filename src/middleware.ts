import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'clave-secreta');

async function verifyToken(token: string) {
  const [header, payload, signature] = token.split('.');

  if (!header || !payload || !signature) return null;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    SECRET_KEY,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const data = encoder.encode(`${header}.${payload}`);
  const signatureBytes = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

  const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, data);
  if (!isValid) return null;

  const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  return decodedPayload;
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith('/login')) return NextResponse.next();
  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.redirect(new URL('/login', req.url));

    const { rol } = decoded;

    if (pathname.startsWith('/vales-aprobados') && !['superusuario', 'administrativo'].includes(rol)) {
      return NextResponse.redirect(new URL('/no-autorizado', req.url));
    }

    if (pathname.startsWith('/vales-pendientes') && !['superusuario', 'aprobador'].includes(rol)) {
      return NextResponse.redirect(new URL('/no-autorizado', req.url));
    }

    if (pathname.startsWith('/stock') && !['superusuario', 'administrativo'].includes(rol)) {
      return NextResponse.redirect(new URL('/no-autorizado', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('❌ Error verificando token:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/vales/:path*',
    '/vales-aprobados/:path*',
    '/vales-pendientes/:path*',
    '/stock/:path*',
    '/vehicles/:path*',
    '/vehicleregistration/:path*',
    '/users/:path*',
    '/newUser/:path*',
    '/newStock/:path*',
    '/newObra/:path*',
    '/obras/:path*',
    '/newvoucher/:path*',
  ],
};
