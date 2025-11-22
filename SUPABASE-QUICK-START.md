# ⚡ Inicio Rápido: Configuración de Supabase

## 🎯 Pasos Rápidos

### 1. Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto: **"New Project"**
3. Configura:
   - **Name:** `level-up-gamer`
   - **Database Password:** Crea una contraseña segura (¡GUÁRDALA!)
   - **Region:** Elige la más cercana
   - **Plan:** Free

### 2. Obtener credenciales

1. Ve a **Settings > API** en el dashboard
2. Copia:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **service_role key** (haz clic en "Reveal" para verla)

### 3. Ejecutar el script SQL

1. Ve a **SQL Editor** en Supabase
2. Abre el archivo `database/schema.sql` de este proyecto
3. Copia todo el contenido y pégalo en el SQL Editor
4. Haz clic en **"Run"**
5. Verifica que se crearon las tablas en **Table Editor**

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del backend con:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

JWT_SECRET=tu_secreto_jwt_seguro
JWT_EXPIRES_IN=7d

NODE_ENV=development
```

### 5. Verificar conexión

```bash
cd express
npm run dev
```

Deberías ver: `✅ Database connection successful`

## ✅ Checklist

- [ ] Proyecto creado en Supabase
- [ ] Credenciales obtenidas (URL + Service Role Key)
- [ ] Script SQL ejecutado
- [ ] Tablas creadas (usuarios, categorias, productos, boletas, detalle_boletas)
- [ ] Archivo `.env` creado con las credenciales
- [ ] Conexión verificada

## 📚 Guía Completa

Para más detalles, consulta: **`SUPABASE-SETUP.md`**

## 🐛 Problemas Comunes

### Error: "Supabase credentials not configured"
→ Verifica que el archivo `.env` exista y tenga las variables correctas

### Error: "Invalid API key"
→ Usa la **service_role** key, no la **anon** key

### Error: "relation does not exist"
→ Ejecuta el script SQL completo en Supabase SQL Editor

## 🔐 Seguridad

⚠️ **IMPORTANTE:**
- NUNCA compartas tu `SUPABASE_SERVICE_ROLE_KEY`
- NUNCA la uses en el frontend
- Asegúrate de que `.env` esté en `.gitignore`

---

¡Listo! 🎉 Tu base de datos Supabase está configurada.

