'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      console.log("✅ Token recibido:", data.token);

      let redirectTo = '/';
      if (data.rol) {
        switch (data.rol) {
          case 'superusuario':
            redirectTo = '/dashboard';
            break;
          case 'administrativo':
            redirectTo = '/vales-aprobados';
            break;
          case 'aprobador':
            redirectTo = '/vales-pendientes';
            break;
          case 'encargado':
            redirectTo = '/newvoucher';
            break;
          default:
            redirectTo = '/';
        }
      }

      // 🟢 Esperamos un poco antes de redirigir
      setTimeout(() => {
        router.push(redirectTo);
        window.location.href = redirectTo; // Fallback forzando navegación
      }, 300);

    } catch (err) {
      console.error('Error al conectar:', err);
      setError('Error en el servidor');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
