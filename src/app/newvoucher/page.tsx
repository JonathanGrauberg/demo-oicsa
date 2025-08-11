'use client';
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';

interface UserInfo {
  id: number;
  nombre: string;
  apellido: string;
  rol: string;
}

interface Chofer {
  id: number;
  nombre: string;
  apellido: string;
  rol: 'chofer';
}

type StockItem = {
  id: number;
  nombre: string;
  tipo: string;
  cantidad: number;
  unidad: string;
  creado_en: string;
};

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
    origen: 'obrador',
  });

  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [obras, setObras] = useState<any[]>([]);
  const [insumos, setInsumos] = useState<StockItem[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);

  const [choferes, setChoferes] = useState<Chofer[]>([]);
  const [choferId, setChoferId] = useState<string>('');

  // 👀 stock disponible del insumo seleccionado (solo informativo)
  const [stockDisponible, setStockDisponible] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const vehiculos = await fetch('/api/vehiculo', { cache: 'no-store' }).then(r => r.json());
      const obras = await fetch('/api/obra', { cache: 'no-store' }).then(r => r.json());
      const stock = await fetch('/api/stock', { cache: 'no-store' }).then(r => r.json());
      setVehiculos(vehiculos);
      setObras(obras);
      setInsumos(stock);
    };

    const fetchUser = async () => {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (res.ok) {
        const data: UserInfo = await res.json();
        setUser(data);
        // Autocompletar encargado SIEMPRE
        setFormData(prev => ({
          ...prev,
          encargado: `${data.nombre} ${data.apellido}`,
        }));
      }
    };

    const fetchChoferes = async () => {
      try {
        const r = await fetch('/api/usuario?rol=chofer', { cache: 'no-store' });
        if (!r.ok) throw new Error('No se pudieron cargar choferes');
        const json = await r.json();
        setChoferes(Array.isArray(json.usuarios) ? json.usuarios : json);
      } catch (e) {
        console.error(e);
        setChoferes([]);
      }
    };

    fetchData();
    fetchUser();
    fetchChoferes();

    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, fecha: today }));
  }, []);

  // Actualiza el “stockDisponible” cuando cambia el insumo seleccionado o el listado
  useEffect(() => {
    if (!formData.combustible_lubricante) {
      setStockDisponible(null);
      return;
    }
    const sel = insumos.find(
      s => s.nombre.toLowerCase() === formData.combustible_lubricante.toLowerCase()
    );
    setStockDisponible(sel ? Number(sel.cantidad) : null);
  }, [formData.combustible_lubricante, insumos]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Usuario no identificado');
      return;
    }

    // ✅ Validación previa si el origen es OBRADOR
    if (formData.origen === 'obrador') {
      const litrosNum = Number(formData.litros);
      if (!litrosNum || litrosNum <= 0) {
        alert('Ingresá una cantidad de litros válida.');
        return;
      }

      const insumoSel = insumos.find(
        s => s.nombre.toLowerCase() === String(formData.combustible_lubricante).toLowerCase()
      );

      if (!insumoSel) {
        alert('Insumo no encontrado en el stock del obrador.');
        return;
      }

      const disponible = Number(insumoSel.cantidad);
      if (disponible < litrosNum) {
        alert(
          `Stock insuficiente en obrador.\nDisponibles: ${disponible}\nSolicitados: ${litrosNum}`
        );
        return;
      }
    }
    // 🔹 Si es “estación”, no validamos stock.

    const solicitado_por = choferId ? Number(choferId) : user.id;

    const vale = {
      ...formData,
      solicitado_por,
    };

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
        encargado: `${user.nombre} ${user.apellido}`, // mantener autocompletado
        fecha: new Date().toISOString().split('T')[0],
        kilometraje: '',
        origen: 'obrador',
      });
      setChoferId('');
      setStockDisponible(null);
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err?.error || 'Error al generar vale');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pedido de Nuevo Vale</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select name="origen" value={formData.origen} onChange={handleChange} className="input-style" required>
          <option value="obrador">Obrador</option>
          <option value="estacion">Estación de servicio</option>
        </select>

        <div className="flex flex-col">
          <select
            name="combustible_lubricante"
            value={formData.combustible_lubricante}
            onChange={handleChange}
            className="input-style"
            required
          >
            <option value="">Seleccione insumo</option>
            {insumos.map((item) => (
              <option key={item.id} value={item.nombre}>
                {item.nombre} - {item.tipo}
              </option>
            ))}
          </select>
          {/* Info de stock solo si origen=obrador */}
          {formData.origen === 'obrador' && (
            <span className="text-xs text-gray-600 mt-1">
              {stockDisponible === null
                ? 'Seleccioná un insumo para ver stock disponible.'
                : `Stock disponible en obrador: ${stockDisponible}`}
            </span>
          )}
        </div>

        <input
          name="litros"
          type="number"
          value={formData.litros}
          onChange={handleChange}
          placeholder="Litros"
          className="input-style"
          required
        />

        <select name="vehiculo" value={formData.vehiculo} onChange={handleChange} className="input-style" required>
          <option value="">Seleccione un vehículo</option>
          {vehiculos.map((v: any) => (
            <option key={v.id} value={v.id}>
              {v.marca} - {v.modelo} ({v.patente})
            </option>
          ))}
        </select>

        <select name="obra" value={formData.obra} onChange={handleChange} className="input-style" required>
          <option value="">Seleccione una obra</option>
          {obras.map((obra: any) => (
            <option key={obra.id} value={obra.nombre}>
              {obra.nombre} {obra.ubicacion ? `- ${obra.ubicacion}` : ''}
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

        {/* Encargado autocompletado y readonly */}
        <input
          name="encargado"
          value={formData.encargado}
          readOnly
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

        <input type="date" name="fecha" value={formData.fecha} readOnly className="input-style" required />

        {/* Select de Chofer (opcional) */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Chofer (opcional)</label>
          <select
            value={choferId}
            onChange={(e) => setChoferId(e.target.value)}
            className="input-style"
          >
            <option value="">— Seleccionar chofer —</option>
            {choferes.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.apellido}, {c.nombre}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Si no seleccionás chofer, se usará tu propio usuario como solicitante.
          </p>
        </div>

        <div className="col-span-full flex justify-end gap-2 mt-4">
          <button
            type="reset"
            onClick={() => {
              setFormData({
                combustible_lubricante: '',
                litros: '',
                vehiculo: '',
                obra: '',
                destino: '',
                encargado: user ? `${user.nombre} ${user.apellido}` : '',
                fecha: new Date().toISOString().split('T')[0],
                kilometraje: '',
                origen: 'obrador',
              });
              setChoferId('');
              setStockDisponible(null);
            }}
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
