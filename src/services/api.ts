import axios from 'axios';

// Interfaces para los tipos de datos (coinciden con el backend)
export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
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
  categorias?: Categoria;
}

export interface Boleta {
  id?: number;
  usuario_id: number;
  fecha: string;
  total: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada';
  created_at?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
}

// Configuración de la URL base del backend
// En desarrollo: http://localhost:3000 (puerto del backend Express)
// En producción: usar la URL de producción del backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para agregar el token de autenticación a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🔄 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received:`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    // Si el token expiró o es inválido, limpiar el localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// ==================== AUTENTICACIÓN ====================
export const authService = {
  register: async (userData: {
    nombre: string;
    email: string;
    password: string;
    rol?: 'Cliente' | 'Vendedor' | 'Administrador';
  }): Promise<LoginResponse> => {
    const response = await api.post('/api/auth/register', userData);
    const { token, user } = response.data;
    
    // Guardar token y usuario en localStorage
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, user } = response.data;
    
    // Guardar token y usuario en localStorage
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<Usuario> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getUser: (): Usuario | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// ==================== PRODUCTOS ====================
export const productoService = {
  getAll: async (categoriaId?: number): Promise<Producto[]> => {
    const params = categoriaId ? { categoria_id: categoriaId } : {};
    const response = await api.get('/api/productos', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Producto> => {
    const response = await api.get(`/api/productos/${id}`);
    return response.data;
  },

  create: async (producto: Omit<Producto, 'id' | 'created_at' | 'updated_at'>): Promise<Producto> => {
    const response = await api.post('/api/productos', producto);
    return response.data.producto;
  },

  update: async (id: number, producto: Partial<Producto>): Promise<Producto> => {
    const response = await api.put(`/api/productos/${id}`, producto);
    return response.data.producto;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/productos/${id}`);
  },
};

// ==================== CATEGORÍAS ====================
export const categoriaService = {
  getAll: async (): Promise<Categoria[]> => {
    const response = await api.get('/api/categorias');
    return response.data;
  },

  getById: async (id: number): Promise<Categoria> => {
    const response = await api.get(`/api/categorias/${id}`);
    return response.data;
  },

  create: async (categoria: Omit<Categoria, 'id' | 'created_at'>): Promise<Categoria> => {
    const response = await api.post('/api/categorias', categoria);
    return response.data.categoria;
  },

  update: async (id: number, categoria: Partial<Categoria>): Promise<Categoria> => {
    const response = await api.put(`/api/categorias/${id}`, categoria);
    return response.data.categoria;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/categorias/${id}`);
  },
};

// ==================== USUARIOS ====================
export const usuarioService = {
  getAll: async (): Promise<Usuario[]> => {
    const response = await api.get('/api/usuarios');
    return response.data;
  },

  getById: async (id: number): Promise<Usuario> => {
    const response = await api.get(`/api/usuarios/${id}`);
    return response.data;
  },

  update: async (id: number, usuario: Partial<Usuario>): Promise<Usuario> => {
    const response = await api.put(`/api/usuarios/${id}`, usuario);
    return response.data.usuario;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/usuarios/${id}`);
  },
};

// ==================== BOLETAS ====================
export const boletaService = {
  getAll: async (): Promise<Boleta[]> => {
    const response = await api.get('/api/boletas');
    return response.data;
  },

  getById: async (id: number): Promise<Boleta> => {
    const response = await api.get(`/api/boletas/${id}`);
    return response.data;
  },

  create: async (boleta: Omit<Boleta, 'id' | 'created_at'>): Promise<Boleta> => {
    const response = await api.post('/api/boletas', boleta);
    return response.data.boleta;
  },
};

// Health check
export const healthCheck = async (): Promise<{ message: string; version: string }> => {
  const response = await api.get('/');
  return response.data;
};

export default api;