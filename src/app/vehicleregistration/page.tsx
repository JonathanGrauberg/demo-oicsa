'use client';
export const dynamic = "force-dynamic";

import React, { useMemo, useState } from 'react';

type FormData = {
  tipo: string;
  marca: string;
  modelo: string;
  patente: string;
  ano: string;
  kilometraje: string;
  chasis: string;
  motor: string;
  neumaticos_delantero: string;
  neumaticos_traseros: string;
  aceite_motor: string;
  aceite_caja: string;
  filtro_aceite: string;
  combustible: string;
  filtro_aire_primario: string;
  filtro_aire_secundario: string;
  filtro_combustible_primario: string;
  filtro_combustible_secundario: string;
  observaciones: string;
};

// 🔹 Componente reutilizable: Select con opción "Otro…" que habilita input de texto
function SelectOrOther({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = 'Escribir…',
}: {
  label: string;
  name: keyof FormData;
  value: string;
  options: string[];
  onChange: (name: keyof FormData, value: string) => void;
  placeholder?: string;
}) {
  // si el value actual no está en options (o es vacío), decidimos el modo
  const isKnown = useMemo(() => (value ? options.includes(value) : true), [value, options]);
  const [useOther, setUseOther] = useState(!isKnown);

  // Si el valor cambia externamente a uno existente en options, volvemos al modo select
  React.useEffect(() => {
    const nowKnown = value ? options.includes(value) : true;
    setUseOther(!nowKnown);
  }, [value, options]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    if (v === '__OTRO__') {
      setUseOther(true);
      // si venías de una opción conocida, limpiamos para escribir
      if (options.includes(value)) onChange(name, '');
      return;
    }
    setUseOther(false);
    onChange(name, v);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {!useOther ? (
        <select
          name={name}
          value={options.includes(value) ? value : ''}
          onChange={handleSelectChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
        >
          <option value="">Seleccionar...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
          <option value="__OTRO__">Otro…</option>
        </select>
      ) : (
        <div className="mt-1 flex items-center gap-2">
          <input
            name={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
          />
          <button
            type="button"
            onClick={() => {
              // si el texto coincide con una opción, volvemos a select; si no, seguimos en “otro”
              if (options.includes(value)) setUseOther(false);
            }}
            className="text-sm text-gray-600 underline"
            title="Volver al selector si coincide con una opción"
          >
            ↩︎
          </button>
        </div>
      )}
    </div>
  );
}

const VehicleRegistration = () => {
  const [formData, setFormData] = useState<FormData>({
    tipo: '',
    marca: '',
    modelo: '',
    patente: '',
    ano: '',
    kilometraje: '',
    chasis: '',
    motor: '',
    neumaticos_delantero: '',
    neumaticos_traseros: '',
    aceite_motor: '',
    aceite_caja: '',
    filtro_aceite: '',
    combustible: '',
    filtro_aire_primario: '',
    filtro_aire_secundario: '',
    filtro_combustible_primario: '',
    filtro_combustible_secundario: '',
    observaciones: '',
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((p) => ({ ...p, [e.target.name as keyof FormData]: e.target.value }));
  };

  const handleChangeField = (name: keyof FormData, value: string) => {
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${baseUrl}/api/vehiculo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Vehículo registrado con éxito');
        setFormData({
          tipo: '',
          marca: '',
          modelo: '',
          patente: '',
          ano: '',
          kilometraje: '',
          chasis: '',
          motor: '',
          neumaticos_delantero: '',
          neumaticos_traseros: '',
          aceite_motor: '',
          aceite_caja: '',
          filtro_aceite: '',
          combustible: '',
          filtro_aire_primario: '',
          filtro_aire_secundario: '',
          filtro_combustible_primario: '',
          filtro_combustible_secundario: '',
          observaciones: '',
        });
      } else {
        const error = await res.json().catch(() => ({}));
        alert(`Error: ${error?.message || 'No se pudo registrar'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  // Opciones base (ajustá/extendé cuando quieras)
  const opcionesTipo = ['Camión', 'Retroexcavadora', 'Grúa', 'Cargadora', 'Auto', 'Camioneta'];
  const opcionesMarca = ['Honda', 'Fiat', 'Mercedez', 'BMW', 'Audi', 'VolksWagen'];
  const opcionesModelo = ['Kangoo', 'Gol', 'Vento', 'A4', 'A3', 'Berlingo'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-black">Alta de Vehículos</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* 🔹 Tipo / Marca / Modelo con “Otro…” */}
            <SelectOrOther
              label="Tipo de Vehículo"
              name="tipo"
              value={formData.tipo}
              options={opcionesTipo}
              onChange={handleChangeField}
              placeholder="Ej: Excavadora oruga"
            />
            <SelectOrOther
              label="Marca"
              name="marca"
              value={formData.marca}
              options={opcionesMarca}
              onChange={handleChangeField}
              placeholder="Ej: Toyota"
            />
            <SelectOrOther
              label="Modelo"
              name="modelo"
              value={formData.modelo}
              options={opcionesModelo}
              onChange={handleChangeField}
              placeholder="Ej: Hilux"
            />

            <input
              name="patente"
              value={formData.patente}
              onChange={handleChange}
              placeholder="Patente"
              className="input-style"
            />
            <input
              name="ano"
              type="number"
              value={formData.ano}
              onChange={handleChange}
              placeholder="Año"
              className="input-style"
            />
            <input
              name="kilometraje"
              type="number"
              value={formData.kilometraje}
              onChange={handleChange}
              placeholder="Kilometraje"
              className="input-style"
            />
            <input
              name="chasis"
              value={formData.chasis}
              onChange={handleChange}
              placeholder="Chasis"
              className="input-style"
            />
            <input
              name="motor"
              value={formData.motor}
              onChange={handleChange}
              placeholder="Motor"
              className="input-style"
            />
            <input
              name="neumaticos_delantero"
              value={formData.neumaticos_delantero}
              onChange={handleChange}
              placeholder="Neumáticos Delantero"
              className="input-style"
            />
            <input
              name="neumaticos_traseros"
              value={formData.neumaticos_traseros}
              onChange={handleChange}
              placeholder="Neumáticos Traseros"
              className="input-style"
            />
            <input
              name="aceite_motor"
              value={formData.aceite_motor}
              onChange={handleChange}
              placeholder="Aceite Motor"
              className="input-style"
            />
            <input
              name="aceite_caja"
              value={formData.aceite_caja}
              onChange={handleChange}
              placeholder="Aceite Caja"
              className="input-style"
            />
            <input
              name="filtro_aceite"
              value={formData.filtro_aceite}
              onChange={handleChange}
              placeholder="Filtro de Aceite"
              className="input-style"
            />
            <input
              name="combustible"
              value={formData.combustible}
              onChange={handleChange}
              placeholder="Combustible"
              className="input-style"
            />
            <input
              name="filtro_aire_primario"
              value={formData.filtro_aire_primario}
              onChange={handleChange}
              placeholder="Filtro Aire Primario"
              className="input-style"
            />
            <input
              name="filtro_aire_secundario"
              value={formData.filtro_aire_secundario}
              onChange={handleChange}
              placeholder="Filtro Aire Secundario"
              className="input-style"
            />
            <input
              name="filtro_combustible_primario"
              value={formData.filtro_combustible_primario}
              onChange={handleChange}
              placeholder="Filtro Combustible Primario"
              className="input-style"
            />
            <input
              name="filtro_combustible_secundario"
              value={formData.filtro_combustible_secundario}
              onChange={handleChange}
              placeholder="Filtro Combustible Secundario"
              className="input-style"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  tipo: '',
                  marca: '',
                  modelo: '',
                  patente: '',
                  ano: '',
                  kilometraje: '',
                  chasis: '',
                  motor: '',
                  neumaticos_delantero: '',
                  neumaticos_traseros: '',
                  aceite_motor: '',
                  aceite_caja: '',
                  filtro_aceite: '',
                  combustible: '',
                  filtro_aire_primario: '',
                  filtro_aire_secundario: '',
                  filtro_combustible_primario: '',
                  filtro_combustible_secundario: '',
                  observaciones: '',
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Registrar Vehículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleRegistration;
