# 👥 Cómo Ver los Usuarios Registrados

## 🔐 Requisitos

El endpoint `/api/usuarios` requiere:
1. ✅ **Autenticación** (token JWT)
2. ✅ **Rol de Administrador**

---

## 📍 Endpoint

```
GET /api/usuarios
```

**Permisos:** Solo usuarios con rol `Administrador`

---

## 🔧 Métodos para Ver los Usuarios

### Método 1: Desde Swagger UI (Recomendado - Más Fácil)

#### Paso 1: Crear un usuario administrador (si no tienes uno)

**Opción A: Desde el API de registro**

```bash
# Abre en tu navegador o usa curl:
http://localhost:3000/api-docs
```

1. Ve a `POST /api/auth/register`
2. Haz clic en "Try it out"
3. Usa este JSON:

```json
{
  "nombre": "Admin",
  "email": "admin@levelup.com",
  "password": "admin123",
  "rol": "Administrador"
}
```

4. Haz clic en "Execute"
5. **Copia el token** que aparece en la respuesta

**Opción B: Desde Supabase directamente**

1. Ve a Supabase → **Table Editor** → `usuarios`
2. Haz clic en "Insert row"
3. Completa:
   - **nombre:** `Admin`
   - **email:** `admin@levelup.com`
   - **password:** (necesitas hashearlo con bcrypt - mejor usa el API)
   - **rol:** `Administrador`

#### Paso 2: Iniciar sesión para obtener el token

1. Ve a Swagger UI: http://localhost:3000/api-docs
2. Busca `POST /api/auth/login`
3. Haz clic en "Try it out"
4. Usa este JSON:

```json
{
  "email": "admin@levelup.com",
  "password": "admin123"
}
```

5. Haz clic en "Execute"
6. **Copia el token** de la respuesta (ej: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

#### Paso 3: Autorizarte en Swagger

1. En Swagger UI, haz clic en el botón **"Authorize"** 🔒 (arriba a la derecha)
2. En el campo `bearerAuth`, pega el token (sin la palabra "Bearer")
3. Haz clic en "Authorize"
4. Cierra la ventana

#### Paso 4: Ver los usuarios

1. Busca `GET /api/usuarios` en Swagger
2. Haz clic en "Try it out"
3. Haz clic en "Execute"
4. Verás la lista de usuarios

---

### Método 2: Desde el Navegador (con extensión)

**Necesitas una extensión para agregar el header de autorización.**

1. Instala una extensión como **ModHeader** o **Header Editor**
2. Inicia sesión para obtener el token (ve a Método 1, Paso 2)
3. Agrega el header:
   - **Nombre:** `Authorization`
   - **Valor:** `Bearer TU_TOKEN_AQUI`
4. Abre en el navegador: `http://localhost:3000/api/usuarios`

---

### Método 3: Desde PowerShell (con curl)

#### Paso 1: Obtener el token

```powershell
# Iniciar sesión
$body = @{
    email = "admin@levelup.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

# Guardar el token
$token = $response.token
Write-Host "Token obtenido: $token"
```

#### Paso 2: Ver los usuarios

```powershell
# Ver usuarios con el token
$headers = @{
    Authorization = "Bearer $token"
}

$usuarios = Invoke-RestMethod -Uri http://localhost:3000/api/usuarios `
    -Method Get `
    -Headers $headers

$usuarios | ConvertTo-Json -Depth 5
```

---

### Método 4: Desde Postman

1. **Crear una request:**
   - Método: `GET`
   - URL: `http://localhost:3000/api/usuarios`

2. **Obtener el token:**
   - Método: `POST`
   - URL: `http://localhost:3000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@levelup.com",
       "password": "admin123"
     }
     ```
   - Copia el token de la respuesta

3. **Agregar el token a la request de usuarios:**
   - Ve a la pestaña "Authorization"
   - Selecciona "Bearer Token"
   - Pega el token
   - Haz clic en "Send"

---

### Método 5: Directamente desde Supabase (Sin autenticación)

Si solo quieres ver los usuarios sin usar el API:

1. Ve a tu proyecto en Supabase: https://app.supabase.com
2. Ve a **Table Editor** en el menú lateral
3. Selecciona la tabla `usuarios`
4. Verás todos los usuarios registrados

**Nota:** Esta es la forma más rápida, pero no usa el API.

---

## 📊 Respuesta Esperada

Si todo funciona correctamente, deberías ver algo como:

```json
[
  {
    "id": 1,
    "nombre": "Admin",
    "email": "admin@levelup.com",
    "rol": "Administrador",
    "created_at": "2025-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "Cliente",
    "created_at": "2025-01-15T11:00:00.000Z"
  },
  {
    "id": 3,
    "nombre": "María García",
    "email": "maria@example.com",
    "rol": "Vendedor",
    "created_at": "2025-01-15T12:00:00.000Z"
  }
]
```

**Nota:** El campo `password` NO se incluye en la respuesta por seguridad.

---

## 🔐 Estructura de un Usuario

Cada usuario tiene estos campos (en la respuesta del API):

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | number | ID único del usuario |
| `nombre` | string | Nombre completo |
| `email` | string | Email (único) |
| `rol` | string | `Cliente`, `Vendedor` o `Administrador` |
| `created_at` | string | Fecha de registro |

**El campo `password` nunca se devuelve** por seguridad.

---

## ❌ Errores Comunes

### Error 1: "Token no proporcionado"

**Síntoma:**
```json
{
  "message": "Token no proporcionado"
}
```

**Solución:**
- Asegúrate de haber iniciado sesión y obtenido el token
- Agrega el header `Authorization: Bearer TU_TOKEN`

### Error 2: "No tienes permisos para acceder a este recurso"

**Síntoma:**
```json
{
  "message": "No tienes permisos para acceder a este recurso"
}
```

**Solución:**
- El usuario debe tener rol `Administrador`
- Verifica que el usuario con el que iniciaste sesión sea administrador
- Puedes verificar en Supabase → Table Editor → `usuarios`

### Error 3: "Token inválido o expirado"

**Síntoma:**
```json
{
  "message": "Token inválido o expirado"
}
```

**Solución:**
- Vuelve a iniciar sesión para obtener un nuevo token
- Los tokens expiran después de 7 días (configurado en `JWT_EXPIRES_IN`)

---

## 🎯 Resumen Rápido

**Método más fácil:**

1. Ve a: http://localhost:3000/api-docs
2. Inicia sesión con `POST /api/auth/login` (como administrador)
3. Copia el token
4. Haz clic en "Authorize" y pega el token
5. Ve a `GET /api/usuarios` y haz clic en "Execute"

**Método más rápido (sin API):**

1. Ve a Supabase → Table Editor → `usuarios`
2. Ver todos los usuarios directamente

---

## ✅ Checklist

- [ ] Tienes un usuario con rol `Administrador`
- [ ] Iniciaste sesión y obtuviste el token
- [ ] Agregaste el token al header `Authorization`
- [ ] Probaste el endpoint `/api/usuarios`
- [ ] Viste la lista de usuarios

---

¡Listo! 🎉 Ahora puedes ver todos los usuarios registrados en tu sistema.

