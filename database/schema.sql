-- ===========================================
-- Level Up Gamer - Schema SQL para Supabase
-- ===========================================
-- Ejecuta este script en el SQL Editor de Supabase
-- https://app.supabase.com/project/[TU_PROYECTO]/sql/new

-- ===========================================
-- 1. TABLA: usuarios
-- ===========================================
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL DEFAULT 'Cliente' CHECK (rol IN ('Cliente', 'Vendedor', 'Administrador')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas por email (ya que es UNIQUE, esto mejora el rendimiento)
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Comentarios de la tabla
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema con roles de Cliente, Vendedor o Administrador';
COMMENT ON COLUMN usuarios.rol IS 'Rol del usuario: Cliente, Vendedor o Administrador';

-- ===========================================
-- 2. TABLA: categorias
-- ===========================================
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comentarios de la tabla
COMMENT ON TABLE categorias IS 'Categorías de productos (ej: Videojuegos, Consolas, Accesorios)';

-- ===========================================
-- 3. TABLA: productos
-- ===========================================
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
  imagen_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_productos_categoria_id ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);

-- Comentarios de la tabla
COMMENT ON TABLE productos IS 'Catálogo de productos de la tienda';
COMMENT ON COLUMN productos.categoria_id IS 'Referencia a la categoría del producto';

-- ===========================================
-- 4. TABLA: boletas
-- ===========================================
CREATE TABLE IF NOT EXISTS boletas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Completada', 'Cancelada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_boletas_usuario_id ON boletas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_boletas_estado ON boletas(estado);
CREATE INDEX IF NOT EXISTS idx_boletas_fecha ON boletas(fecha DESC);

-- Comentarios de la tabla
COMMENT ON TABLE boletas IS 'Órdenes de compra de los usuarios';
COMMENT ON COLUMN boletas.estado IS 'Estado de la boleta: Pendiente, Completada o Cancelada';

-- ===========================================
-- 5. TABLA: detalle_boletas
-- ===========================================
CREATE TABLE IF NOT EXISTS detalle_boletas (
  id SERIAL PRIMARY KEY,
  boleta_id INTEGER NOT NULL REFERENCES boletas(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_detalle_boletas_boleta_id ON detalle_boletas(boleta_id);
CREATE INDEX IF NOT EXISTS idx_detalle_boletas_producto_id ON detalle_boletas(producto_id);

-- Comentarios de la tabla
COMMENT ON TABLE detalle_boletas IS 'Detalles de productos en cada boleta';
COMMENT ON COLUMN detalle_boletas.precio_unitario IS 'Precio del producto al momento de la compra';
COMMENT ON COLUMN detalle_boletas.subtotal IS 'Cantidad * precio_unitario';

-- ===========================================
-- 6. TRIGGER: Actualizar updated_at automáticamente
-- ===========================================
-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para tabla usuarios
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para tabla productos
DROP TRIGGER IF EXISTS update_productos_updated_at ON productos;
CREATE TRIGGER update_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- 7. DATOS INICIALES (Opcional)
-- ===========================================
-- Insertar categorías de ejemplo
INSERT INTO categorias (nombre, descripcion) VALUES
  ('Videojuegos', 'Juegos para PC, consolas y móviles'),
  ('Consolas', 'PlayStation, Xbox, Nintendo Switch, etc.'),
  ('Accesorios', 'Mandos, auriculares, teclados, ratones, etc.'),
  ('PC Gaming', 'Componentes y periféricos para PC gaming'),
  ('Merchandising', 'Camisetas, figuras, posters y más')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar usuario administrador de ejemplo (opcional)
-- NOTA: La contraseña debe ser hasheada con bcrypt antes de insertar
-- Usa el endpoint /api/auth/register para crear usuarios de forma segura
-- Ejemplo de contraseña hasheada de "admin123" (10 salt rounds):
-- INSERT INTO usuarios (nombre, email, password, rol) VALUES
--   ('Admin', 'admin@levelup.com', '$2a$10$...', 'Administrador');

-- ===========================================
-- 8. POLÍTICAS DE SEGURIDAD (Row Level Security - RLS)
-- ===========================================
-- Opcional: Configurar RLS si usas autenticación de Supabase
-- Para este proyecto, la autenticación se maneja con JWT en Express
-- Por lo que las políticas de RLS pueden no ser necesarias

-- Si quieres habilitar RLS (Row Level Security) en Supabase:
-- ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE boletas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE detalle_boletas ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- VERIFICACIÓN
-- ===========================================
-- Verificar que las tablas se crearon correctamente:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('usuarios', 'categorias', 'productos', 'boletas', 'detalle_boletas');

-- Ver estructura de una tabla:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'productos';

-- ===========================================
-- FIN DEL SCRIPT
-- ===========================================

