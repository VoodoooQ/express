# 🗄️ Guía Completa de Configuración de Supabase

Esta guía te ayudará a configurar Supabase para tu proyecto Level Up Gamer.

---

## 📋 Índice

1. [Crear cuenta y proyecto en Supabase](#1-crear-cuenta-y-proyecto-en-supabase)
2. [Obtener credenciales](#2-obtener-credenciales)
3. [Crear las tablas](#3-crear-las-tablas)
4. [Configurar variables de entorno](#4-configurar-variables-de-entorno)
5. [Verificar la conexión](#5-verificar-la-conexión)
6. [Insertar datos de prueba](#6-insertar-datos-de-prueba)
7. [Solución de problemas](#7-solución-de-problemas)

---

## 1. Crear cuenta y proyecto en Supabase

### Paso 1.1: Registrarse en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"** o **"Sign in"**
3. Inicia sesión con GitHub (recomendado) o crea una cuenta con email
4. Confirma tu email si es necesario

### Paso 1.2: Crear un nuevo proyecto

1. Una vez dentro del dashboard, haz clic en **"New Project"**
2. Completa el formulario:
   - **Name:** `level-up-gamer` (o el nombre que prefieras)
   - **Database Password:** Crea una contraseña segura y **GUÁRDALA** (la necesitarás)
   - **Region:** Elige la región más cercana a ti
   - **Pricing Plan:** Selecciona **Free** (gratis)
3. Haz clic en **"Create new project"**
4. Espera 2-3 minutos mientras se crea tu proyecto (verás una barra de progreso)

---

## 2. Obtener credenciales

Una vez que tu proyecto esté listo, necesitas obtener las credenciales:

### Paso 2.1: Obtener la URL del proyecto

1. En el dashboard de Supabase, ve a **Settings** (⚙️) en el menú lateral
2. Haz clic en **API**
3. Busca la sección **"Project URL"**
4. Copia la URL (debería verse así: `https://xxxxxxxxxxxxx.supabase.co`)

### Paso 2.2: Obtener la Service Role Key

1. En la misma página de **Settings > API**
2. Busca la sección **"Project API keys"**
3. Verás dos claves:
   - **anon/public key:** Clave pública (no usar para backend)
   - **service_role key:** Clave privada (esta es la que necesitas)
4. Haz clic en **👁️ Reveal** junto a **service_role** y copia la clave

⚠️ **IMPORTANTE:** 
- La **service_role key** tiene acceso completo a tu base de datos
- **NUNCA** la expongas públicamente o la compartas
- Solo úsala en el backend (servidor)
- No la incluyas en el código del frontend

---

## 3. Crear las tablas

### Paso 3.1: Abrir el SQL Editor

1. En el dashboard de Supabase, ve a **SQL Editor** en el menú lateral
2. Haz clic en **"New query"** o **"+"** para crear una nueva consulta

### Paso 3.2: Ejecutar el script SQL

1. Abre el archivo `database/schema.sql` de este proyecto
2. Copia todo el contenido del archivo
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **"Run"** o presiona `Ctrl + Enter` (Windows) / `Cmd + Enter` (Mac)
5. Deberías ver un mensaje de éxito: ✅ **"Success. No rows returned"**

### Paso 3.3: Verificar que las tablas se crearon

1. En el menú lateral, ve a **Table Editor**
2. Deberías ver las siguientes tablas:
   - ✅ `usuarios`
   - ✅ `categorias`
   - ✅ `productos`
   - ✅ `boletas`
   - ✅ `detalle_boletas`

Si ves todas las tablas, ¡perfecto! Las tablas se crearon correctamente.

---

## 4. Configurar variables de entorno

### Paso 4.1: Crear archivo .env en el backend

En la raíz del proyecto backend (`express/`), crea un archivo `.env`:

```bash
# Si estás en Windows PowerShell
New-Item .env

# Si estás en Linux/Mac
touch .env
```

### Paso 4.2: Agregar las variables de entorno

Abre el archivo `.env` y agrega las siguientes variables (reemplaza con tus valores reales):

```env
# Puerto del servidor
PORT=3000

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:5173

# ===========================================
# CREDENCIALES DE SUPABASE
# ===========================================
# Reemplaza estos valores con los de tu proyecto Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# ===========================================
# CONFIGURACIÓN DE JWT
# ===========================================
# Genera un secreto seguro para producción
# Puedes usar: openssl rand -base64 32
JWT_SECRET=tu_jwt_secret_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# Entorno
NODE_ENV=development
```

**Ejemplo completo:**

```env
PORT=3000
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=https://eqmikpclbuypkflmypdh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

JWT_SECRET=mi_super_secreto_jwt_cambiar_en_produccion
JWT_EXPIRES_IN=7d

NODE_ENV=development
```

### Paso 4.3: Verificar que el .env no se suba a Git

Asegúrate de que `.env` esté en tu `.gitignore`:

```bash
# Verificar si .env está en .gitignore
cat .gitignore | grep .env

# Si no está, agrégalo:
echo ".env" >> .gitignore
```

---

## 5. Verificar la conexión

### Paso 5.1: Iniciar el servidor backend

```bash
cd express
npm install  # Si no lo has hecho antes
npm run dev
```

Deberías ver en la consola:
```
✅ Database connection successful
🚀 Server running on http://localhost:3000
📚 API Documentation available at http://localhost:3000/api-docs
```

Si ves el mensaje `✅ Database connection successful`, ¡tu conexión está funcionando!

### Paso 5.2: Probar la conexión manualmente

Abre tu navegador o usa curl/Postman:

```bash
# En tu navegador:
http://localhost:3000/

# Con curl:
curl http://localhost:3000/

# Deberías ver un JSON con información de la API
```

---

## 6. Insertar datos de prueba

### Paso 6.1: Usar el API para crear datos

#### Crear un usuario administrador:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin",
    "email": "admin@levelup.com",
    "password": "admin123",
    "rol": "Administrador"
  }'
```

#### Crear categorías (si no se insertaron automáticamente):

Ve a la pestaña **Table Editor** en Supabase y haz clic en `categorias`, luego en **"Insert row"**:

- **nombre:** `Videojuegos`
- **descripcion:** `Juegos para PC, consolas y móviles`

Repite para las demás categorías.

#### Crear productos de ejemplo:

Usa el API (requiere autenticación) o inserta directamente en Supabase:

1. Ve a **Table Editor > productos**
2. Haz clic en **"Insert row"**
3. Completa los campos:
   - **nombre:** `Call of Duty: Modern Warfare`
   - **descripcion:** `Juego de acción en primera persona`
   - **precio:** `59.99`
   - **stock:** `50`
   - **categoria_id:** `1` (debe existir en la tabla categorias)
   - **imagen_url:** `https://ejemplo.com/imagen.jpg` (opcional)

---

## 7. Solución de problemas

### Problema: Error "relation does not exist"

**Síntoma:**
```
Error: relation "usuarios" does not exist
```

**Solución:**
1. Verifica que ejecutaste el script SQL completo
2. Ve a **Table Editor** y verifica que las tablas existan
3. Asegúrate de estar usando la base de datos correcta

### Problema: Error de autenticación de Supabase

**Síntoma:**
```
Error: Invalid API key
```

**Solución:**
1. Verifica que copiaste correctamente la `SUPABASE_SERVICE_ROLE_KEY`
2. Asegúrate de usar la **service_role** key, no la **anon** key
3. Verifica que no haya espacios extra al inicio o final de la clave
4. Reinicia el servidor después de cambiar el `.env`

### Problema: Error de conexión a Supabase

**Síntoma:**
```
❌ Database connection failed
```

**Solución:**
1. Verifica tu conexión a internet
2. Verifica que la `SUPABASE_URL` sea correcta
3. Verifica que tu proyecto Supabase esté activo (no suspendido)
4. Revisa los logs del servidor para más detalles

### Problema: Error de permisos

**Síntoma:**
```
Error: permission denied for table usuarios
```

**Solución:**
1. Asegúrate de usar la **service_role** key, no la **anon** key
2. Verifica que las políticas RLS no estén bloqueando las consultas
3. Si habilitaste RLS, puedes deshabilitarlo temporalmente para pruebas

### Problema: Variables de entorno no se leen

**Síntoma:**
El servidor usa valores por defecto o credenciales hardcodeadas

**Solución:**
1. Asegúrate de que el archivo `.env` esté en la raíz del proyecto backend
2. Verifica que no haya errores de sintaxis en el `.env`
3. Reinicia el servidor después de cambiar el `.env`
4. Asegúrate de tener instalado `dotenv` en tu proyecto

### Problema: Error "column does not exist"

**Síntoma:**
```
Error: column "campo" does not exist
```

**Solución:**
1. Verifica que el esquema SQL se ejecutó correctamente
2. Compara los nombres de columnas en tu código con los del esquema
3. Verifica que no haya diferencias entre mayúsculas y minúsculas

---

## 📚 Recursos Adicionales

### Documentación de Supabase

- [Documentación oficial](https://supabase.com/docs)
- [Guía de PostgreSQL](https://supabase.com/docs/guides/database)
- [API Reference](https://supabase.com/docs/reference/javascript/introduction)

### Herramientas útiles

- [Supabase Dashboard](https://app.supabase.com) - Panel de control
- [Supabase SQL Editor](https://app.supabase.com/project/_/sql) - Editor SQL
- [Table Editor](https://app.supabase.com/project/_/editor) - Editor visual de tablas

### Comandos útiles en Supabase SQL Editor

```sql
-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Ver estructura de una tabla
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'productos';

-- Ver todos los registros de una tabla
SELECT * FROM productos;

-- Eliminar todas las tablas (¡CUIDADO!)
DROP TABLE IF EXISTS detalle_boletas CASCADE;
DROP TABLE IF EXISTS boletas CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
```

---

## ✅ Checklist de Configuración

- [ ] Cuenta de Supabase creada
- [ ] Proyecto creado en Supabase
- [ ] Credenciales obtenidas (URL y Service Role Key)
- [ ] Script SQL ejecutado exitosamente
- [ ] Todas las tablas creadas (usuarios, categorias, productos, boletas, detalle_boletas)
- [ ] Archivo `.env` creado en el backend
- [ ] Variables de entorno configuradas
- [ ] Conexión verificada (`✅ Database connection successful`)
- [ ] Datos de prueba insertados (opcional)
- [ ] `.env` agregado a `.gitignore`

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu base de datos Supabase estará configurada y lista para usar con tu backend Express.

Si tienes algún problema o pregunta, revisa la sección de **Solución de Problemas** o consulta la [documentación oficial de Supabase](https://supabase.com/docs).

---

**Próximos pasos:**
1. Configurar el frontend para conectarse al backend
2. Crear usuarios de prueba
3. Insertar productos de ejemplo
4. Probar las funcionalidades de la API

¡Feliz desarrollo! 🚀

