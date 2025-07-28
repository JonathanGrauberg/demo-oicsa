'use client';
import React, { useState } from 'react';

const menuGroups = [
  {
    title: '📊 Panel y Reportes',
    items: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Panel de Control', path: '/' },
    ],
  },
  {
    title: '🚜 Vehículos y Obras',
    items: [
      { label: 'Vehículos y Máquinas', path: '/vehicles' },
      { label: 'Registrar Vehículo', path: '/vehicleregistration' },
      { label: 'Obras', path: '/obras' },
      { label: 'Registrar Obras', path: '/newObra' },
    ],
  },
  {
    title: '👥 Usuarios',
    items: [
      { label: 'Lista de Usuarios', path: '/users' },
      { label: 'Registrar Usuario', path: '/newUser' },
    ],
  },
  {
    title: '⛽ Vales',
    items: [
      { label: 'Solicitud de Vale', path: '/newvoucher' },
      { label: 'Vales Pendientes', path: '/vales-pendientes' },
      { label: 'Vales Aprobados', path: '/vales-aprobados' },
      { label: 'Historial de Vales', path: '/vales' },
    ],
  },
  {
    title: '📦 Stock e Insumos',
    items: [
      { label: 'Stock Actual', path: '/stock' },
      { label: 'Crear Insumos de Obrador', path: '/newStock' },
    ],
  },
];

const Sidebar = () => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (title: string) => {
    setOpenGroup(prev => (prev === title ? null : title));
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="space-y-2">
        {menuGroups.map((group) => (
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
                {group.items.map((item) => (
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
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
