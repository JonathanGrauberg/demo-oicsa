import React from 'react';


const menuItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Panel de Control', path: '/' },
  { label: 'Vehículos y Máquinas', path: '/vehicles' },
  { label: 'Obras', path: '/obras' },
  { label: 'Registrar Obras', path: '/newObra' },
  { label: 'Usuarios', path: '/users' },
  { label: 'Generar Vale', path: '/newvoucher' },
  { label: 'Registrar Vehículo', path: '/vehicleregistration' }, 
  { label: 'Registrar Usuario', path: '/newUser' },
  { label: 'Vales Pendientes', path: '/vales-pendientes' },
  { label: 'Vales Aprobados', path: '/vales-aprobados' },
  { label: 'Ver Vales', path: '/vales' },
  { label: 'Stock', path: '/stock' },
  { label: 'Crear Insumos', path: '/newStock' },
  
  
];
const Sidebar = () => {
    return (
      <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
        <div className="space-y-4">
          
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className="block p-2 hover:bg-gray-700 rounded"
            >
              {item.label}
            </a>
          ))}
          
        </div>
      </div>
    );
  };
  
  export default Sidebar;