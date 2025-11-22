# 👥 Cómo Ver Usuarios desde Swagger UI

## 🔍 Problema

Cuando vas directamente al navegador:
```
http://localhost:3000/api/usuarios
```

Recibes:
```json
{
  "message": "Token no proporcionado"
}
```

**Causa:** El navegador no puede enviar el header `Authorization` con el token automáticamente.

---

## ✅ Solución: Usar Swagger UI

Swagger UI te permite agregar el token fácilmente.

---

## 🚀 Pasos Detallados

### Paso 1: Abrir Swagger UI

Abre en tu navegador:
```
http://localhost:3000/api-docs
```

Deberías ver la interfaz de Swagger con todos los endpoints disponibles.

---

### Paso 2: Registrar o Iniciar Sesión para Obtener el Token

#### Opción A: Registrar un Usuario (si no tienes uno)

1. En Swagger UI, busca `POST /api/auth/register`
2. Haz clic en "Try it out"
3. Reemplaza el JSON de ejemplo con:

```json
{
  "nombre": "Admin",
  "email": "admin@levelup.com",
  "password": "admin123",
  "rol": "Administrador"
}
```

4. Haz clic en "Execute"
5. Espera la respuesta
6. En la respuesta, busca el campo `"token"` y **copia TODO el valor** (es largo, más de 200 caracteres)

**Ejemplo de respuesta:**
```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbGV2ZWx1cC5jb20iLCJyb2wiOiJBZG1pbmlzdHJhZG9yIiwiaWF0IjoxNzI2Mzc1NzA2LCJleHAiOjE3MjY5ODA3MDZ9...",
  "user": {
    "id": 1,
    "nombre": "Admin",
    "email": "admin@levelup.com",
    "rol": "Administrador"
  }
}
```

**Copia el token completo** (sin las comillas):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbGV2ZWx1cC5jb20iLCJyb2wiOiJBZG1pbmlzdHJhZG9yIiwiaWF0IjoxNzI2Mzc1NzA2LCJleHAiOjE3MjY5ODA3MDZ9...
```

#### Opción B: Iniciar Sesión (si ya tienes usuario)

1. En Swagger UI, busca `POST /api/auth/login`
2. Haz clic en "Try it out"
3. Reemplaza el JSON con:

```json
{
  "email": "admin@levelup.com",
  "password": "admin123"
}
```

4. Haz clic en "Execute"
5. En la respuesta, **copia el token** del campo `"token"`

---

### Paso 3: Autorizar en Swagger con el Token

1. En Swagger UI, busca el botón **"Authorize"** 🔒 (arriba a la derecha)
2. Haz clic en "Authorize"
3. Se abrirá una ventana modal
4. Verás un campo llamado **"bearerAuth"** o **"bearer (jwt)"**
5. **Pega el token** que copiaste (solo el token, sin "Bearer", sin comillas)
6. Haz clic en **"Authorize"**
7. La ventana se cerrará y verás un ✅ o 🔓 junto al botón "Authorize"

**Importante:**
- ✅ Pega SOLO el token (ej: `eyJhbGciOiJIUzI1NiIsI...`)
- ❌ NO pegues `Bearer ` + token
- ❌ NO pegues `"token": "` + token
- ❌ NO pegues las comillas

---

### Paso 4: Ver los Usuarios

Ahora que estás autorizado:

1. En Swagger UI, busca `GET /api/usuarios`
2. Haz clic en "Try it out"
3. Haz clic en **"Execute"**
4. Ahora deberías ver la lista de usuarios ✅

**Respuesta esperada:**
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
  }
]
```

---

## 📋 Resumen Visual de los Pasos

```
┌─────────────────────────────────────────┐
│  PASO 1: Abrir Swagger                  │
│  http://localhost:3000/api-docs         │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  PASO 2: Login/Register                 │
│  POST /api/auth/login                   │
│  { "email": "...", "password": "..." }   │
│                                         │
│  ↓ Copia el token de la respuesta       │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  PASO 3: Autorizar                      │
│  [Authorize 🔒] → Pega token            │
│  → [Authorize]                          │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  PASO 4: Ver Usuarios                   │
│  GET /api/usuarios                      │
│  [Try it out] → [Execute]               │
│                                         │
│  ✅ Lista de usuarios                   │
└─────────────────────────────────────────┘
```

---

## ⚠️ Errores Comunes

### Error 1: "Token no proporcionado"

**Causa:** No autorizaste en Swagger antes de probar el endpoint.

**Solución:** 
1. Asegúrate de haber hecho clic en "Authorize" y pegado el token
2. Verifica que veas un ✅ o 🔓 junto al botón "Authorize"

### Error 2: "No tienes permisos para acceder a este recurso"

**Causa:** Tu usuario no tiene rol `Administrador`.

**Solución:**
1. Asegúrate de iniciar sesión con un usuario que tenga `"rol": "Administrador"`
2. O regístrate con rol `"Administrador"`

### Error 3: El token no funciona

**Causa:** El token expiró o es incorrecto.

**Solución:**
1. Vuelve a hacer login/register para obtener un token nuevo
2. Pega el token más reciente en "Authorize"

---

## 🎯 Alternativa: Usar PowerShell con el Token

Si prefieres usar PowerShell:

```powershell
# 1. Login para obtener token
$body = @{
    email = "admin@levelup.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

# 2. Guardar el token
$token = $response.token
Write-Host "Token obtenido: $token" -ForegroundColor Green

# 3. Ver usuarios con el token
$headers = @{
    Authorization = "Bearer $token"
}

$usuarios = Invoke-RestMethod -Uri http://localhost:3000/api/usuarios `
    -Method Get `
    -Headers $headers

# 4. Mostrar usuarios
$usuarios | ConvertTo-Json -Depth 5
```

---

## ✅ Checklist

- [ ] Abriste Swagger UI: http://localhost:3000/api-docs
- [ ] Registraste o iniciaste sesión para obtener el token
- [ ] Copiaste el token completo de la respuesta
- [ ] Hiciste clic en "Authorize" y pegaste el token
- [ ] Viste el ✅ o 🔓 junto a "Authorize"
- [ ] Probaste `GET /api/usuarios` con "Execute"
- [ ] Viste la lista de usuarios

---

## 🎉 Resultado Final

Después de seguir estos pasos, deberías poder ver todos los usuarios registrados en tu sistema desde Swagger UI.

¡Listo! 🎉

