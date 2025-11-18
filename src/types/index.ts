import { Request } from 'express';

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password: string;
  rol: 'Cliente' | 'Vendedor' | 'Administrador';
  created_at?: string;
  updated_at?: string;
}

export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
}

export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria_id: number;
  imagen_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Boleta {
  id?: number;
  usuario_id: number;
  fecha: string;
  total: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada';
  created_at?: string;
}

export interface DetalleBoleta {
  id?: number;
  boleta_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface JWTPayload {
  userId: number;
  email: string;
  rol: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}
