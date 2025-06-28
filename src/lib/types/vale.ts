// lib/types/vale.ts

export interface Vale {
  id?: number;
  combustible_lubricante: string;
  litros: string;
  vehiculo: string;
  obra: string;
  destino: string;
  encargado: string;
  solicitado_por: number; // id del usuario
  fecha: string;
  aprobado: boolean;
  aprobado_por?: number | null;
  creado_en?: string;
  kilometraje?: number;
}
