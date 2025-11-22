# ⚡ Inicio Rápido: Conectar Frontend con Backend

## 🎯 Resumen Rápido

### 1. Backend (Express) - Puerto 3000

```bash
cd express
npm install
npm run dev
```

✅ Backend corriendo en: `http://localhost:3000`

### 2. Frontend (React) - Puerto 5173

```bash
cd Level-Up-Gamer_React  # o donde tengas el frontend
npm install

# Crear archivo .env.local en la raíz del frontend:
# VITE_API_URL=http://localhost:3000

npm run dev
```

✅ Frontend corriendo en: `http://localhost:5173`

### 3. Verificar Conexión

Abre la consola del navegador y ejecuta:

```javascript
fetch('http://localhost:3000/')
  .then(res => res.json())
  .then(data => console.log('✅ Conexión exitosa:', data));
```

## 📝 Archivos Importantes

- ✅ `src/services/api.ts` - **YA ACTUALIZADO** con todos los endpoints del backend
- ✅ `src/index.ts` - CORS configurado para permitir el frontend
- 📖 `CONEXION-FRONTEND-BACKEND.md` - Guía completa con todos los detalles

## 🔧 Variables de Entorno Necesarias

### Frontend (.env o .env.local)
```env
VITE_API_URL=http://localhost:3000
```

### Backend (.env)
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
# ... resto de variables de Supabase
```

## 🚀 Uso en React

```typescript
import { authService, productoService } from '../services/api';

// Login
const response = await authService.login('email@example.com', 'password');

// Obtener productos
const productos = await productoService.getAll();

// Crear producto (requiere autenticación)
const nuevoProducto = await productoService.create({
  nombre: 'Nuevo Producto',
  descripcion: 'Descripción',
  precio: 99.99,
  stock: 10,
  categoria_id: 1
});
```

## ✅ Checklist

- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 5173 (o alternativo)
- [ ] Variable `VITE_API_URL` configurada en frontend
- [ ] Servicio API actualizado (ya está hecho ✅)
- [ ] CORS configurado (ya está hecho ✅)

## 📚 Documentación Completa

Ver `CONEXION-FRONTEND-BACKEND.md` para:
- Guía paso a paso detallada
- Solución de problemas comunes
- Ejemplos de uso
- Lista completa de endpoints

¡Listo para empezar! 🎉

