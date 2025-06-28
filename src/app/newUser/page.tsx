'use client';
import React, { useState, useEffect } from 'react';

const NewUser = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailExists, setEmailExists] = useState(false); // 🆕
  const [checkingEmail, setCheckingEmail] = useState(false); // 🆕

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'password' || name === 'confirmPassword') {
        setPasswordsMatch(updated.password === updated.confirmPassword);
      }
      return updated;
    });
  };

  // 🆕 Verificación de e‑mail cuando cambia
  useEffect(() => {
    const checkEmail = async () => {
      if (!formData.email.includes('@')) {
        setEmailExists(false);
        return;
      }
      setCheckingEmail(true);
      const res = await fetch(`/api/usuario/existe?email=${encodeURIComponent(formData.email)}`);
      const data = await res.json();
      setEmailExists(data.existe);
      setCheckingEmail(false);
    };
    if (formData.email) {
      const timeout = setTimeout(checkEmail, 500);
      return () => clearTimeout(timeout);
    }
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (emailExists) {
      alert('El email ya existe. Elige otro.');
      return;
    }

    try {
      const res = await fetch('/api/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          rol: formData.rol,
          password: formData.password
        })
      });
      const result = await res.json();

      if (res.ok) {
        alert('Usuario registrado correctamente');
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          rol: '',
          password: '',
          confirmPassword: ''
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
      <h1 className="text-2xl font-bold text-black mb-6">Alta de Usuario</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm"
                required
              />

              <label className="block text-sm font-medium text-gray-700 mt-2">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm"
                required
              />

              <label className="block text-sm font-medium text-gray-700 mt-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${emailExists ? 'border-red-500' : 'border-gray-300'} shadow-sm`}
                  required
                />
                {checkingEmail && (
                  <span className="text-gray-500 text-sm">Comprobando...</span> // 🆕
                )}
                {emailExists && (
                  <span className="text-red-500 text-sm">Email ya existente</span> // 🆕
                )}
              </div>

              <label className="block text-sm font-medium text-gray-700 mt-2">Rol</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm text-black"
                required
              >
                <option value="">Seleccionar rol...</option>
                <option value="Encargado">Encargado</option>
                <option value="administrativo">Administrativo</option>
                <option value="superusuario">Superusuario</option>
              </select>

              <label className="block text-sm font-medium text-gray-700 mt-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 text-gray-500"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <label className="block text-sm font-medium text-gray-700 mt-2">Confirmar Contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full rounded-md border ${passwordsMatch ? 'border-gray-300' : 'border-red-500'} shadow-sm`}
                required
              />
              {!passwordsMatch && (
                <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 col-span-full">
              <button
                type="button"
                onClick={() =>
                  setFormData({ nombre: '', apellido: '', email: '', rol: '', password: '', confirmPassword: '' })
                }
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!passwordsMatch || emailExists}
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${!passwordsMatch || emailExists ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Registrar Usuario
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default NewUser;
