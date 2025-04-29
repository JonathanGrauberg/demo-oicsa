"use client";

import React, { useState } from 'react';

const modelosPorMarca = {
  Honda: ['Civic', 'Fit', 'CR-V', 'HR-V'],
  Toyota: ['Corolla', 'Hilux', 'Etios', 'RAV4'],
  Fiat: ['Cronos', 'Argo', 'Palio', 'Uno'],
};

function SelectsDependientes() {
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('');
  const [modelos, setModelos] = useState([]);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(''); 

  const handleMarcaChange = (event) => {
    const marca = event.target.value;
    setMarcaSeleccionada(marca);
    setModelos(marca ? modelosPorMarca[marca] || [] : []);
    setModeloSeleccionado('');
  };

  const handleModeloChange = (event) => {
    setModeloSeleccionado(event.target.value);
  };

  return (
    <>
    <div>
      <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca:</label>
      <select id="marca" value={marcaSeleccionada} onChange={handleMarcaChange} className="mt-1 block w-full md-p-4 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black">
        <option value="">Seleccione una marca</option>
        {Object.keys(modelosPorMarca).map((marca) => (
          <option key={marca} value={marca}>
            {marca}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">Modelo:</label>
      <select
        id="modelo"
        value={modeloSeleccionado}
        onChange={handleModeloChange} 
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
      >
        <option value="">{marcaSeleccionada ? 'Seleccione un modelo' : 'Seleccione una marca primero'}</option>
        {modelos.map((modelo) => (
          <option key={modelo} value={modelo}>
            {modelo}
          </option>
        ))}
      </select>
    </div>  
    </>
  );
}

export default SelectsDependientes;