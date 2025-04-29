import React from 'react';


const menuItems = [
  { label: 'Panel de Control', path: '/' },
  { label: 'Vehículos y Máquinas', path: '/vehicles' },
  { label: 'Choferes', path: '/Drivers' },
  { label: 'Obras', path: '/projects' },
  { label: 'Usuaios', path: '/users' },
  { label: 'Generar Vale', path: '/newvoucher' },
  { label: 'Registrar Vehículo', path: '/vehicleregistration' },
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