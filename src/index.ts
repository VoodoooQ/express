import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { setupSwagger } from './config/swagger.js';

// Rutas
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import boletaRoutes from './routes/boletaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
// Security headers - helmet configuration for production
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
// Configuración de CORS para permitir el frontend React
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173', // Puerto por defecto de Vite
  'http://localhost:3000', // Puerto alternativo común
  'http://localhost:5174', // Puerto alternativo si 5173 está ocupado
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (como apps móviles o Postman)
    if (!origin) return callback(null, true);
    
    // En desarrollo, permitir cualquier localhost
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // Permitir orígenes específicos
    if (allowedOrigins.includes(origin) || process.env.FRONTEND_URL === '*') {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
setupSwagger(app);

// Rutas de la API
app.get('/', (_req, res) => {
  res.json({
    message: 'Level Up Gamer API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      categorias: '/api/categorias',
      productos: '/api/productos',
      boletas: '/api/boletas'
    },
    ...(process.env.NODE_ENV !== 'production' ? {
      dev: {
        usuarios: '/api/dev/usuarios (solo desarrollo - sin auth)',
        productos: '/api/dev/productos (solo desarrollo - sin auth)',
        categorias: '/api/dev/categorias (solo desarrollo - sin auth)'
      }
    } : {})
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/boletas', boletaRoutes);

// ===========================================
// RUTAS DE PRUEBA PARA DESARROLLO
// ===========================================
// Solo disponibles cuando NODE_ENV !== 'production'
if (process.env.NODE_ENV !== 'production') {
  // Ruta de prueba para ver usuarios sin autenticación (solo desarrollo)
  app.get('/api/dev/usuarios', async (_req, res) => {
    try {
      const { supabase } = await import('./config/database.js');
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, rol, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        message: '⚠️ Esta es una ruta de PRUEBA solo para desarrollo',
        warning: 'En producción esta ruta NO estará disponible',
        usuarios: data
      });
    } catch (error: any) {
      console.error('Error en dev/usuarios:', error);
      res.status(500).json({ 
        message: 'Error al obtener usuarios',
        error: error?.message 
      });
    }
  });

  // Ruta de prueba para ver productos sin autenticación (solo desarrollo)
  app.get('/api/dev/productos', async (_req, res) => {
    try {
      const { supabase } = await import('./config/database.js');
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        message: '⚠️ Esta es una ruta de PRUEBA solo para desarrollo',
        warning: 'En producción esta ruta NO estará disponible',
        productos: data || []
      });
    } catch (error: any) {
      console.error('Error en dev/productos:', error);
      res.status(500).json({ 
        message: 'Error al obtener productos',
        error: error?.message 
      });
    }
  });

  // Ruta de prueba para ver categorías sin autenticación (solo desarrollo)
  app.get('/api/dev/categorias', async (_req, res) => {
    try {
      const { supabase } = await import('./config/database.js');
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;

      res.json({
        message: '⚠️ Esta es una ruta de PRUEBA solo para desarrollo',
        warning: 'En producción esta ruta NO estará disponible',
        categorias: data || []
      });
    } catch (error: any) {
      console.error('Error en dev/categorias:', error);
      res.status(500).json({ 
        message: 'Error al obtener categorías',
        error: error?.message 
      });
    }
  });

  console.log('🔧 Rutas de desarrollo habilitadas:');
  console.log('   - GET /api/dev/usuarios (sin autenticación)');
  console.log('   - GET /api/dev/productos (sin autenticación)');
  console.log('   - GET /api/dev/categorias (sin autenticación)');
}

// Manejo de rutas no encontradas
app.use((_req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Iniciar servidor solo si no estamos en Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
    await testConnection();
  });
}

export default app;
