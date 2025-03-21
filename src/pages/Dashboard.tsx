import React from 'react';

const Dashboard = () => {
    const stats = [
      { title: 'Vehículos Activos', value: 24, color: 'bg-blue-500', link: '/vehicles' },
      { title: 'Choferes', value: 45, color: 'bg-green-500', link: '/drivers' },
      { title: 'Obras en Curso', value: 8, color: 'bg-yellow-500', link: '/projects' },
      { title: 'Vales Pendientes', value: 12, color: 'bg-purple-500', link: '/vouchers' },
    ];
    
  
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de Control</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <h1>acá otra cosa</h1>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <h1>acá carta de usuarios</h1>
        </div>
       
      </div>
    );
  };
  
  export default Dashboard;