import React, { useState } from 'react';
import SelectsDependientes from '../../components/SelectsDependientes';

const VehicleRegistration = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-black">Alta de Vehículos</h1>
        <div className="bg-white rounded-1g shadow-md p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Vehículo</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black">
                  <option>Camión</option>
                  <option>Retroexcavadora</option>
                  <option>Grúa</option>
                  <option>Cargadora</option>
                  <option>Auto</option>
                  <option>Camioneta</option>
                  <option>otro auto</option>
                </select>
              </div>
              <SelectsDependientes />
              <div>
                <label className="block text-sm font-medium text-gray-700">Patente</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Año</label>
                <input type="number" min="0" max="9999" pattern="[0-9]{4}" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kilometraje</label>
                <input type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Chásis</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Motor</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Neumáticos Delantero</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Neumáticos Traseros</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Aceite Motor</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Aceite Caja</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Filtro de Aceite</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Combustible</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Filtros de Aire Primario</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Filtros de Aire Secundario</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Filtros de Combustible Primario</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Filtros de Combustible Secundario</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Observaciones</label>
              <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Registrar Vehículo
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default VehicleRegistration;