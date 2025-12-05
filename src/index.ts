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
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://level-up-gamer-react-lake.vercel.app',
    process.env.FRONTEND_URL || ''
  ].filter(url => url !== ''),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/boletas', boletaRoutes);

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
    console.log(`ðŸš€ Server running on http://localhost:${PORT}`);
    console.log(`ðŸ“š API Documentation available at http://localhost:${PORT}/api-docs`);
    await testConnection();
  });
}

export default app;


