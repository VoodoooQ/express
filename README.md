# Level Up Gamer - Backend API

API REST desarrollada con Express.js y TypeScript para la tienda de videojuegos Level Up Gamer, con autenticación JWT, roles de usuario y conexión a Supabase.

##  Características

-  API REST completa con operaciones CRUD
-  Autenticación JWT con roles (Cliente, Vendedor, Administrador)
-  Conexión a Supabase (PostgreSQL)
-  Documentación con Swagger UI
-  Validación de datos con express-validator
-  Seguridad con Helmet y CORS
-  TypeScript para type-safety
-  Preparado para despliegue en Vercel

##  Requisitos Previos

- Node.js 18+ 
- Cuenta en Supabase (gratuita)
- npm o yarn

##  Instalación

1. Instalar dependencias:
\\\ash
npm install
\\\

2. Configurar variables de entorno en .env con las credenciales de Supabase

3. Ejecutar el script database/schema.sql en Supabase SQL Editor

##  Ejecutar en Desarrollo

\\\ash
npm run dev
\\\

El servidor estará disponible en http://localhost:3000
Documentación Swagger: http://localhost:3000/api-docs

##  Endpoints Principales

### Autenticación
- POST /api/auth/register - Registrar usuario
- POST /api/auth/login - Iniciar sesión
- GET /api/auth/me - Obtener usuario actual

### Usuarios
- GET /api/usuarios - Listar usuarios (Admin)
- GET /api/usuarios/:id - Obtener usuario
- PUT /api/usuarios/:id - Actualizar usuario
- DELETE /api/usuarios/:id - Eliminar usuario (Admin)

### Categorías
- GET /api/categorias - Listar categorías
- POST /api/categorias - Crear categoría (Admin/Vendedor)
- PUT /api/categorias/:id - Actualizar categoría
- DELETE /api/categorias/:id - Eliminar categoría (Admin)

### Productos
- GET /api/productos - Listar productos
- POST /api/productos - Crear producto (Admin/Vendedor)
- PUT /api/productos/:id - Actualizar producto
- DELETE /api/productos/:id - Eliminar producto (Admin)

### Boletas
- GET /api/boletas - Listar boletas
- GET /api/boletas/:id - Obtener boleta con detalles
- POST /api/boletas - Crear boleta
- PUT /api/boletas/:id - Actualizar estado (Admin/Vendedor)
- DELETE /api/boletas/:id - Eliminar boleta (Admin)

##  Roles y Permisos

- **Cliente**: Ver productos, crear boletas, ver sus boletas
- **Vendedor**: Todo lo del Cliente + crear/editar productos y categorías
- **Administrador**: Acceso total al sistema

##  Despliegue en Vercel

\\\ash
vercel --prod
\\\

Configura las variables de entorno en Vercel dashboard.
