'use client';
import React, { useState } from 'react';

const NewUser = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_alta: '',
    fecha_baja: null,
    fecha_nacimiento: '',
    numero_documento: '',
    cargo: '',
    username: '',
    password: '',
    rol: '',
    estado_empleado: 'Activo',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Usuario registrado correctamente');
        setFormData({
          nombre: '',
          apellido: '',
          fecha_alta: '',
          fecha_baja: null,
          fecha_nacimiento: '',
          numero_documento: '',
          cargo: 'Administrativo',
          username: '',
          password: '',
          rol: 'Chofer',
          estado_empleado: 'Activo',
        });
      } else {
        alert('Error al registrar usuario: ' + result.error);
      }
    } catch (err) {
      alert('Error en la conexión con el servidor');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Alta de Usuario</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Datos de la Persona */}
            <div>
              <h2 className="text-xl font-bold text-black mb-4">Datos de la Persona</h2>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="input text-black" />

              <label className="block text-sm font-medium text-gray-700 mt-2">Apellido</label>
              <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} className="input text-black" />

              <label className="block text-sm font-medium text-gray-700 mt-2">Fecha Nacimiento</label>
              <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} className="input text-black" />

              <label className="block text-sm font-medium text-gray-700 mt-2">Documento</label>
              <input type="number" name="documento" value={formData.numero_documento} onChange={handleChange} className="input text-black" />
            </div>

            {/* Datos como Empleado */}
            <div>
              <h2 className="text-xl font-bold text-black mb-4">Datos como Empleado</h2>
              <label className="block text-sm font-medium text-gray-700">Cargo</label>
              <select name="cargo" value={formData.cargo} onChange={handleChange} className="input text-black">
                <option>Administrativo</option>
                <option>Chofer</option>
              </select>
              <label className="block text-sm font-medium text-gray-700">Se encuentra:</label>
              <select name="estado_empleado" value={formData.estado_empleado} onChange={handleChange} className="input text-black">
                <option>Activo</option>
                <option>Inactivo</option>
                <option>Licencia</option>
              </select>
              <label className="block text-sm font-medium text-gray-700 mt-2">Fecha de alta</label>
              <input type="date" name="fecha_alta" value={formData.fecha_alta} onChange={handleChange} className="input text-black" />
            </div>

            {/* Datos como Usuario */}
            <div>
              <h2 className="text-xl font-bold text-black mb-4">Datos como Usuario</h2>
              <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="input text-black" />

              <label className="block text-sm font-medium text-gray-700 mt-2">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input text-black" />
            </div>

            {/* Rol de Usuario */}
            <div>
              <h2 className="text-xl font-bold text-black mb-4">Rol de Usuario</h2>
              <label className="block text-sm font-medium text-gray-700">Tipo de Usuario</label>
              <select name="rol" value={formData.rol} onChange={handleChange} className="input text-black">
                <option>Chofer</option>
                <option>Supervisor</option>
                <option>Administrativo</option>
                <option>Super Usuario</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => setFormData({
              nombre: '',
              apellido: '',
              fecha_alta: '',
              fecha_baja: null,
              fecha_nacimiento: '',
              numero_documento: '',
              cargo: 'Administrativo',
              username: '',
              password: '',
              rol: 'Chofer',
              estado_empleado: 'Activo',
            })} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Registrar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewUser;
