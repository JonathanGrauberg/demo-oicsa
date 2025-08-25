'use client';
import React, { useState, useEffect } from 'react';

interface TokenPayload {
  rol: string;
  nombre?: string;
}

const DASHBOARD_ITEM = {
  label: 'Dashboard',
  path: '/dashboard',
  roles: ['superusuario', 'administrativo'] as const,
};

const menuGroups = [
  {
    title: '🚜 Vehículos y Obras',
    items: [
      { label: 'Vehículos y Máquinas', path: '/vehicles', roles: ['superusuario', 'administrativo'] },
      { label: 'Registrar Vehículo', path: '/vehicleregistration', roles: ['superusuario', 'administrativo'] },
      { label: 'Obras', path: '/obras', roles: ['superusuario', 'administrativo'] },
      { label: 'Registrar Obras', path: '/newObra', roles: ['superusuario', 'administrativo'] },
    ],
  },
  {
    title: '👥 Usuarios',
    items: [
      { label: 'Lista de Usuarios', path: '/users', roles: ['superusuario'] },
      { label: 'Registrar Usuario', path: '/newUser', roles: ['superusuario'] },
    ],
  },
  {
    title: '⛽ Vales',
    items: [
      { label: 'Solicitud de Vale', path: '/newvoucher', roles: ['superusuario', 'encargado', 'administrativo'] },
      { label: 'Vales Pendientes', path: '/vales-pendientes', roles: ['superusuario', 'aprobador', 'encargado', 'administrativo'] },
      { label: 'Vales Aprobados', path: '/vales-aprobados', roles: ['superusuario', 'administrativo'] },
      { label: 'Historial de Vales', path: '/vales', roles: ['superusuario', 'administrativo'] },
    ],
  },
  {
    title: '📦 Stock e Insumos',
    items: [
      { label: 'Stock Actual', path: '/stock', roles: ['superusuario', 'administrativo'] },
      { label: 'Crear Insumos', path: '/newStock', roles: ['superusuario', 'administrativo'] },
    ],
  },
];

const Sidebar = () => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data: TokenPayload = await res.json();
          setUserRole(data.rol?.trim().toLowerCase() || null);
        } else {
          setUserRole(null);
        }
      } catch {
        setUserRole(null);
      }
    };
    fetchUserRole();
  }, []);

  const toggleGroup = (title: string) => {
    setOpenGroup(prev => (prev === title ? null : title));
  };

  const canSee = (roles: readonly string[]) =>
    userRole === 'superusuario' || (userRole && roles.map(r => r.toLowerCase()).includes(userRole));

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="space-y-2">
        {/* Link directo a Dashboard (sin grupo "Panel") */}
        {canSee(DASHBOARD_ITEM.roles as unknown as string[]) && (
          <a
            href={DASHBOARD_ITEM.path}
            className="block p-2 text-sm hover:bg-gray-700 rounded"
          >
            {DASHBOARD_ITEM.label}
          </a>
        )}

        {/* Resto de grupos */}
        {menuGroups.map((group) => {
          const visibleItems = group.items.filter(item =>
            canSee(item.roles as unknown as string[])
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title}>
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex justify-between items-center w-full p-2 hover:bg-gray-700 rounded"
              >
                <span>{group.title}</span>
                <span>{openGroup === group.title ? '▲' : '▼'}</span>
              </button>
              {openGroup === group.title && (
                <div className="ml-4 mt-1 space-y-1">
                  {visibleItems.map(item => (
                    <a
                      key={item.label}
                      href={item.path}
                      className="block p-2 text-sm hover:bg-gray-700 rounded"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
