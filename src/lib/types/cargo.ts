export interface Cargo {
    id: number;
    nombre: 'Administrativo' | 'Chofer';
  }
  
  export const cargoNombreToId: Record<Cargo['nombre'], number> = {
    Administrativo: 1,
    Chofer: 2,
  };
  