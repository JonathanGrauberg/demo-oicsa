export type Rol = 'superusuario' | 'administrativo' | 'encargado' | 'aprobador' | 'chofer';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
}

// Crear: password SOLO requerido si NO es chofer
export type UsuarioCreate =
  | { nombre: string; apellido: string; email: string; rol: 'chofer'; password?: never }
  | { nombre: string; apellido: string; email: string; rol: Exclude<Rol, 'chofer'>; password: string };
