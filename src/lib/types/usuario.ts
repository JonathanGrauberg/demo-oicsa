export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'superusuario' | 'administrativo' | 'encargado' | 'aprobador';
}


// Si querés mantener uno separado para crear:
export interface UsuarioCreate {
  nombre: string;
  apellido: string;
  email: string;
  rol: 'superusuario' | 'administrativo' | 'encargado' | 'aprobador';
  password: string;
}
