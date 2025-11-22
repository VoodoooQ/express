# 📍 Rutas Disponibles en la API

## 🔍 Ver Información del API

```
GET http://localhost:3000/
```

Devuelve información sobre el API y las rutas disponibles.

---

## 📚 Documentación Swagger

```
GET http://localhost:3000/api-docs
```

Interfaz visual para probar todos los endpoints.

---

## 🔐 Autenticación

### Registrar Usuario
```
POST http://localhost:3000/api/auth/register
```

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "rol": "Cliente"
}
```

### Iniciar Sesión
```
POST http://localhost:3000/api/auth/login
```

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

### Obtener Usuario Actual (Requiere Token)
```
GET http://localhost:3000/api/auth/me
```

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
```

---

## 👥 Usuarios

### Listar Usuarios (Requiere Token + Rol Admin)
```
GET http://localhost:3000/api/usuarios
```

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
```

### Obtener Usuario por ID (Requiere Token)
```
GET http://localhost:3000/api/usuarios/:id
```

**Ejemplo:**
```
GET http://localhost:3000/api/usuarios/1
```

### Actualizar Usuario (Requiere Token)
```
PUT http://localhost:3000/api/usuarios/:id
```

**Body:**
```json
{
  "nombre": "Nuevo Nombre",
  "email": "nuevo@example.com"
}
```

### Eliminar Usuario (Requiere Token + Rol Admin)
```
DELETE http://localhost:3000/api/usuarios/:id
```

---

## 📦 Productos

### Listar Todos los Productos
```
GET http://localhost:3000/api/productos
```

### Filtrar por Categoría
```
GET http://localhost:3000/api/productos?categoria_id=1
```

### Obtener Producto por ID
```
GET http://localhost:3000/api/productos/:id
```

**Ejemplo:**
```
GET http://localhost:3000/api/productos/1
```

### Crear Producto (Requiere Token + Rol Admin/Vendedor)
```
POST http://localhost:3000/api/productos
```

**Body:**
```json
{
  "nombre": "Call of Duty",
  "descripcion": "Juego de acción",
  "precio": 59.99,
  "stock": 50,
  "categoria_id": 1,
  "imagen_url": "https://ejemplo.com/imagen.jpg"
}
```

### Actualizar Producto (Requiere Token + Rol Admin/Vendedor)
```
PUT http://localhost:3000/api/productos/:id
```

### Eliminar Producto (Requiere Token + Rol Admin)
```
DELETE http://localhost:3000/api/productos/:id
```

---

## 📂 Categorías

### Listar Todas las Categorías
```
GET http://localhost:3000/api/categorias
```

### Obtener Categoría por ID
```
GET http://localhost:3000/api/categorias/:id
```

### Crear Categoría (Requiere Token + Rol Admin/Vendedor)
```
POST http://localhost:3000/api/categorias
```

**Body:**
```json
{
  "nombre": "Videojuegos",
  "descripcion": "Juegos para PC y consolas"
}
```

### Actualizar Categoría (Requiere Token + Rol Admin/Vendedor)
```
PUT http://localhost:3000/api/categorias/:id
```

### Eliminar Categoría (Requiere Token + Rol Admin)
```
DELETE http://localhost:3000/api/categorias/:id
```

---

## 🧾 Boletas

### Listar Boletas (Requiere Token)
```
GET http://localhost:3000/api/boletas
```

### Obtener Boleta por ID (Requiere Token)
```
GET http://localhost:3000/api/boletas/:id
```

### Crear Boleta (Requiere Token)
```
POST http://localhost:3000/api/boletas
```

**Body:**
```json
{
  "detalles": [
    {
      "producto_id": 1,
      "cantidad": 2
    },
    {
      "producto_id": 2,
      "cantidad": 1
    }
  ]
}
```

### Actualizar Estado de Boleta (Requiere Token + Rol Admin/Vendedor)
```
PUT http://localhost:3000/api/boletas/:id
```

**Body:**
```json
{
  "estado": "Completada"
}
```

### Eliminar Boleta (Requiere Token + Rol Admin)
```
DELETE http://localhost:3000/api/boletas/:id
```

---

## ❌ Errores Comunes

### Error: "Ruta no encontrada"

**Causa:** La URL que estás usando no existe.

**Solución:**
1. Verifica que estés usando la ruta correcta
2. Asegúrate de incluir el prefijo `/api/` cuando sea necesario
3. Verifica que el método HTTP sea correcto (GET, POST, PUT, DELETE)

**Ejemplos incorrectos:**
- ❌ `http://localhost:3000/auth/register` (falta `/api/`)
- ❌ `http://localhost:3000/api/producto` (debe ser `productos` en plural)
- ❌ `http://localhost:3000/api/productos/` (barra final extra)

**Ejemplos correctos:**
- ✅ `http://localhost:3000/api/auth/register`
- ✅ `http://localhost:3000/api/productos`
- ✅ `http://localhost:3000/api/productos/1`

---

## 🔍 Verificar Rutas Disponibles

### Desde el navegador:
```
http://localhost:3000/
```

Esto mostrará todas las rutas disponibles.

### Desde Swagger:
```
http://localhost:3000/api-docs
```

Interfaz visual con todas las rutas documentadas.

---

## 📋 Resumen de Prefijos

Todas las rutas de la API empiezan con `/api/`:

- ✅ `/api/auth/...` - Autenticación
- ✅ `/api/usuarios/...` - Usuarios
- ✅ `/api/categorias/...` - Categorías
- ✅ `/api/productos/...` - Productos
- ✅ `/api/boletas/...` - Boletas

**Excepciones:**
- `/` - Info del API
- `/api-docs` - Swagger UI

---

## ✅ Checklist

- [ ] Usas el prefijo `/api/` en las rutas
- [ ] El método HTTP es correcto (GET, POST, PUT, DELETE)
- [ ] La URL está bien escrita (sin errores de tipeo)
- [ ] El servidor está corriendo en `http://localhost:3000`
- [ ] Probaste la ruta en Swagger UI primero

---

## 🎯 Prueba Rápida

Para verificar que el API funciona, prueba esto en tu navegador:

```
http://localhost:3000/
```

Deberías ver información sobre el API.

Luego prueba Swagger:

```
http://localhost:3000/api-docs
```

Ahí puedes ver y probar todas las rutas disponibles.

---

¡Listo! 🎉 Ahora conoces todas las rutas disponibles en tu API.

