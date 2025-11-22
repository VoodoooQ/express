# 🔐 Cómo Obtener y Usar el Token JWT

## 🐛 Problema

Al intentar acceder a `/api/usuarios` recibes:

```json
{
  "message": "Token no proporcionado"
}
```

**Causa:** El endpoint requiere autenticación (token JWT).

---

## ✅ Solución: Obtener un Token

Necesitas iniciar sesión primero para obtener un token.

### Paso 1: Registrar un Usuario (si no tienes uno)

Si no tienes un usuario, primero regístralo:

#### Desde Swagger UI (Recomendado):
1. Ve a: http://localhost:3000/api-docs
2. Busca `POST /api/auth/register`
3. Haz clic en "Try it out"
4. Usa este JSON:

```json
{
  "nombre": "Admin",
  "email": "admin@levelup.com",
  "password": "admin123",
  "rol": "Administrador"
}
```

5. Haz clic en "Execute"
6. **Copia el token** que aparece en la respuesta

#### Desde PowerShell:

```powershell
# Registrar usuario administrador
$body = @{
    nombre = "Admin"
    email = "admin@levelup.com"
    password = "admin123"
    rol = "Administrador"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:3000/api/auth/register `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

# Guardar el token
$token = $response.token
Write-Host "Token: $token" -ForegroundColor Cyan
```

---

### Paso 2: Iniciar Sesión (si ya tienes un usuario)

Si ya tienes un usuario registrado, solo necesitas iniciar sesión:

#### Desde Swagger UI:
1. Ve a: http://localhost:3000/api-docs
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
6. **Copia el token** de la respuesta

**Respuesta esperada:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbGV2ZWx1cC5jb20iLCJyb2wiOiJBZG1pbmlzdHJhZG9yIiwiaWF0IjoxNzI2Mzc1NzA2LCJleHAiOjE3MjY5ODA3MDZ9...",
  "user": {
    "id": 1,
    "nombre": "Admin",
    "email": "admin@levelup.com",
    "rol": "Administrador"
  }
}
```

#### Desde PowerShell:

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
Write-Host "Token obtenido: $token" -ForegroundColor Green
```

---

## 🔑 Usar el Token

Una vez que tienes el token, úsalo en el header `Authorization`.

### Método 1: Desde Swagger UI (Más Fácil)

1. Después de iniciar sesión y obtener el token, haz clic en el botón **"Authorize"** 🔒 (arriba a la derecha en Swagger)
2. En el campo `bearerAuth`, pega el token (sin la palabra "Bearer", solo el token)
3. Haz clic en "Authorize"
4. Cierra la ventana
5. Ahora puedes probar `GET /api/usuarios` y funcionará

### Método 2: Desde PowerShell

```powershell
# Usar el token para ver usuarios
$token = "TU_TOKEN_AQUI"  # Pega el token aquí

$headers = @{
    Authorization = "Bearer $token"
}

$usuarios = Invoke-RestMethod -Uri http://localhost:3000/api/usuarios `
    -Method Get `
    -Headers $headers

$usuarios | ConvertTo-Json -Depth 5
```

### Método 3: Desde curl

```bash
curl -X GET http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Método 4: Desde Postman

1. Crea una nueva request
2. Método: `GET`
3. URL: `http://localhost:3000/api/usuarios`
4. Ve a la pestaña "Authorization"
5. Selecciona "Bearer Token"
6. Pega tu token
7. Haz clic en "Send"

---

## 📋 Resumen Rápido

### Para ver usuarios en Swagger:

1. **Inicia sesión:**
   - `POST /api/auth/login` con email y password
   - Copia el token

2. **Autorízate:**
   - Haz clic en "Authorize" 🔒
   - Pega el token
   - Haz clic en "Authorize"

3. **Ver usuarios:**
   - `GET /api/usuarios`
   - Haz clic en "Try it out" → "Execute"

---

## ⚠️ Importante

### Para ver usuarios necesitas:
1. ✅ **Token JWT** (obtenido al iniciar sesión)
2. ✅ **Rol de Administrador** (el usuario debe tener rol `Administrador`)

Si el usuario tiene rol `Cliente` o `Vendedor`, verás un error de permisos.

---

## 🔍 Verificar el Rol del Usuario

Si no puedes ver usuarios aunque tengas el token, verifica el rol:

### Desde Swagger:
1. Haz clic en "Authorize" y pega tu token
2. Prueba `GET /api/auth/me`
3. Verás tu información, incluyendo el `rol`

### Desde PowerShell:

```powershell
$token = "TU_TOKEN_AQUI"
$headers = @{
    Authorization = "Bearer $token"
}

$user = Invoke-RestMethod -Uri http://localhost:3000/api/auth/me `
    -Method Get `
    -Headers $headers

Write-Host "Tu rol: $($user.rol)" -ForegroundColor Yellow
```

Si el rol no es `Administrador`, necesitas crear o iniciar sesión con un usuario administrador.

---

## ✅ Checklist

- [ ] Tienes un usuario registrado
- [ ] Iniciaste sesión y obtuviste el token
- [ ] Autorizaste en Swagger (o agregaste el header Authorization)
- [ ] El usuario tiene rol `Administrador`
- [ ] Probaste el endpoint `/api/usuarios`

---

## 🎯 Pasos Completos

### Opción 1: Usuario Nuevo

1. **Registrar:**
   ```
   POST /api/auth/register
   {
     "nombre": "Admin",
     "email": "admin@levelup.com",
     "password": "admin123",
     "rol": "Administrador"
   }
   ```
   → Copia el token

2. **Autorizar en Swagger:**
   → Botón "Authorize" → Pega token → "Authorize"

3. **Ver usuarios:**
   ```
   GET /api/usuarios
   ```
   → Debería funcionar ✅

### Opción 2: Usuario Existente

1. **Login:**
   ```
   POST /api/auth/login
   {
     "email": "admin@levelup.com",
     "password": "admin123"
   }
   ```
   → Copia el token

2. **Autorizar en Swagger:**
   → Botón "Authorize" → Pega token → "Authorize"

3. **Ver usuarios:**
   ```
   GET /api/usuarios
   ```
   → Debería funcionar ✅

---

¡Listo! 🎉 Con el token correcto, deberías poder ver los usuarios registrados.

