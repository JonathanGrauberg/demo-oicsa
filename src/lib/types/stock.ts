export interface StockItem {
  id: number;
  nombre: string;
  tipo: 'Combustible' | 'Lubricante' | 'Otro';
  cantidad: number;
  unidad: 'litros';
  creado_en: string;
}
