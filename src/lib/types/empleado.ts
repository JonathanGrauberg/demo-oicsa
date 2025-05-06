export interface Empleado {
    id: number;
    id_persona: number;
    id_cargo: number;
    fecha_alta: string; // formato YYYY-MM-DD o null si no tiene fecha de alta
    fecha_baja: string | null;
    id_estado_empleado: number;
  }
  