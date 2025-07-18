export interface Obra {
  id: number;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  estado: 'En progreso' | 'Finalizada' | 'Pausada';
  creado_en: string; // formato ISO (timestamp)
}
