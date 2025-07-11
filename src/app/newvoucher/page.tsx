'use client';
import { useState, useEffect } from 'react';

const CrearVale = () => {
  const [formData, setFormData] = useState({
    combustible_lubricante: '',
    litros: '' as number | '',
    vehiculo: '',
    obra: '',
    destino: '',
    encargado: '',
    fecha: '',
    kilometraje: '' as number | '',

  });
  const [vehiculos, setVehiculos] = useState([] as any[]);

  const userId = 1;

  // Carga de vehículos al montar
  useEffect(() => {
    const fetchVehiculos = async () => {
      const res = await fetch('/api/vehiculo');
      const data = await res.json();
      setVehiculos(data);
    };
    fetchVehiculos();
  }, []);

  useEffect(() => {
  const today = new Date().toISOString().split('T')[0];
  setFormData(prev => ({ ...prev, fecha: today }));
  }, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('No se pudo identificar al usuario');
      return;
    }

    const vale = { ...formData, solicitado_por: userId };
    const res = await fetch('/api/vale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vale),
    });

    if (res.ok) {
      alert('Vale generado correctamente. Pendiente de aprobación.');
      setFormData({
        combustible_lubricante: '',
        litros: '' as number | '',
        vehiculo: '',
        obra: '',
        destino: '',
        encargado: '',
        fecha: '',
        kilometraje: '' as number | '',

      });
    } else {
      alert('Error al generar vale');
    }
  };

//ADMINISTRATIVO SOLO VE IMPRIMIR UNA VEZ APROVADO POR EL SUPERUSUARIO

//ADMINISTRATIVO VER CARGAR VEHICULO OBRA 

//GEREAR CREAR TABLA OBRA CON DESTINO QUE PUEDE VARIAR


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pedido de Nuevo Vale</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="combustible_lubricante"
          value={formData.combustible_lubricante}
          onChange={handleChange}
          placeholder="Combustible o Lubricante"
          className="input-style"
          required
        />
        <input
          name="litros"
          type="number"
          value={formData.litros}
          onChange={handleChange}
          placeholder="Litros"
          className="input-style"
          required
        />
        <select
          name="vehiculo"
          value={formData.vehiculo}
          onChange={handleChange}
          className="input-style"
          required
        >
          <option value="">Seleccione un vehículo</option>
          {vehiculos.map((v: any) => (
            <option key={v.id} value={v.id}>
              {v.marca} - {v.modelo} ({v.patente})
            </option>
          ))}
        </select>
        <input
          name="obra"
          value={formData.obra}
          onChange={handleChange}
          placeholder="Obra"
          className="input-style"
          required
        />
        <input
          name="destino"
          value={formData.destino}
          onChange={handleChange}
          placeholder="Destino"
          className="input-style"
          required
        />
        <input
          name="encargado"
          value={formData.encargado}
          onChange={handleChange}
          placeholder="encargado"
          className="input-style"
          required
        />
        <input
          name="kilometraje"
          type="number"
          value={formData.kilometraje}
          onChange={handleChange}
          placeholder="Kilometraje"
          className="input-style"
          required
        />

        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          readOnly
          className="input-style"
          required
        />

        <div className="col-span-full flex justify-end gap-2 mt-4">
          <button
            type="reset"
            onClick={() =>
              setFormData({
                combustible_lubricante: '',
                litros: '',
                vehiculo: '', 
                obra: '',
                destino: '',
                encargado: '',
                fecha: '',
                kilometraje: '',
              })
            }
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Crear Vale
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearVale;
