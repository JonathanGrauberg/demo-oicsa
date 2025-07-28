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
    origen: 'obrador', // 🆕
  });

  const [vehiculos, setVehiculos] = useState([] as any[]);
  const [obras, setObras] = useState([] as any[]);
  const [insumos, setInsumos] = useState([] as any[]);

  const userId = 1;

  useEffect(() => {
    const fetchData = async () => {
      const vehiculos = await fetch('/api/vehiculo').then(r => r.json());
      const obras = await fetch('/api/obra').then(r => r.json());
      const stock = await fetch('/api/stock').then(r => r.json());
      setVehiculos(vehiculos);
      setObras(obras);
      setInsumos(stock);
    };
    fetchData();

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
        litros: '',
        vehiculo: '',
        obra: '',
        destino: '',
        encargado: '',
        fecha: '',
        kilometraje: '',
        origen: 'obrador',
      });
    } else {
      alert('Error al generar vale');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pedido de Nuevo Vale</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* 🆕 Selector de Origen */}
        <select
          name="origen"
          value={formData.origen}
          onChange={handleChange}
          className="input-style"
          required
        >
          <option value="obrador">Obrador</option>
          <option value="estacion">Estación de servicio</option>
        </select>

        <select
          name="combustible_lubricante"
          value={formData.combustible_lubricante}
          onChange={handleChange}
          className="input-style"
          required
        >
          <option value="">Seleccione insumo</option>
          {insumos.map((item: any) => (
            <option key={item.id} value={item.nombre}>
              {item.nombre} - {item.tipo}
            </option>
          ))}
        </select>

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

        <select
          name="obra"
          value={formData.obra}
          onChange={handleChange}
          className="input-style"
          required
        >
          <option value="">Seleccione una obra</option>
          {obras.map((obra: any) => (
            <option key={obra.id} value={obra.nombre}>
              {obra.nombre} - {obra.ubicacion || ''}
            </option>
          ))}
        </select>

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
          placeholder="Encargado"
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
                origen: 'obrador',
              })
            }
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Crear pedido
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearVale;
