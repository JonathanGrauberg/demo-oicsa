export interface StockItem {
  id: number;
  nombre: string;
  tipo: 'Combustible' | 'Lubricante';
  cantidad: number;
  unidad: 'litros';
  creado_en: string;
}
