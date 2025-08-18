export interface StockItem {
  id: number;
  nombre: string;
  tipo: 'Combustible' | 'Lubricante' | 'Otro';
  cantidad: number;
  unidad: 'litros' | 'kilogramos'; // ✅ ahora acepta ambos
  creado_en: string;
}