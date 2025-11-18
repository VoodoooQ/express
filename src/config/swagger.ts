import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Level Up Gamer API',
      version: '1.0.0',
      description: 'API REST para tienda de videojuegos con autenticación JWT y roles de usuario',
      contact: {
        name: 'API Support',
        email: 'support@levelupgamer.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://your-app.vercel.app',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            email: { type: 'string' },
            rol: { type: 'string', enum: ['Cliente', 'Vendedor', 'Administrador'] },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Categoria: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Producto: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            precio: { type: 'number' },
            stock: { type: 'integer' },
            categoria_id: { type: 'integer' },
            imagen_url: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Boleta: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            usuario_id: { type: 'integer' },
            fecha: { type: 'string', format: 'date-time' },
            total: { type: 'number' },
            estado: { type: 'string', enum: ['Pendiente', 'Completada', 'Cancelada'] },
            created_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Autenticación y registro de usuarios' },
      { name: 'Usuarios', description: 'Gestión de usuarios' },
      { name: 'Categorias', description: 'Gestión de categorías de productos' },
      { name: 'Productos', description: 'Gestión de productos' },
      { name: 'Boletas', description: 'Gestión de órdenes de compra' }
    ]
  },
  apis: ['./src/controllers/*.ts', './src/routes/*.ts']
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Level Up Gamer API Docs'
  }));
};
