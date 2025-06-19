export interface Rol {
    id: number;
    nombre: 'Chofer' | 'Supervisor' | 'Autorizador' | 'Super Usuario' | 'Administrativo';
  }
  {/*}
  export const rolDescripcionToId: Record<Rol['nombre'], number> = {
    Chofer: 1,
    Supervisor: 2,
    Autorizador: 3,
    'Super Usuario': 4,
    Administrativo: 5,
  };
  */}