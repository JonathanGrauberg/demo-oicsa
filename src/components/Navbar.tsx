'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserInfo {
  nombre: string;
  apellido: string;
  rol: string;
  email: string;
}

const Navbar = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data: UserInfo = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error obteniendo datos del usuario:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="bg-blue-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo o Nombre Empresa */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">OICSA</span>
        </div>

        {/* Datos del Usuario */}
        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end text-right">
              <span className="font-semibold">{user.nombre} {user.apellido}</span>
              <span className="text-sm text-gray-200 capitalize">{user.rol}</span>
              <span className="text-xs text-gray-300">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
