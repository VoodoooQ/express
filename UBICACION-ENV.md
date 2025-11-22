# 📁 Ubicación del Archivo .env

## 📍 Dónde crear el archivo .env

El archivo `.env` debe estar en la **raíz del proyecto backend**, en la misma ubicación que el `package.json`.

### Ruta exacta:
```
C:\Users\mojed\Desktop\code\inteliji\express\.env
```

### Estructura del proyecto:
```
express/
├── .env                    ← AQUÍ va el archivo .env
├── package.json            ← En la misma ubicación que este archivo
├── package-lock.json
├── README.md
├── src/
│   ├── index.ts
│   ├── config/
│   │   └── database.ts     ← Este archivo lee el .env
│   └── ...
├── database/
│   └── schema.sql
└── ...
```

## 🔧 Cómo crear el archivo .env

### Opción 1: Desde PowerShell (Terminal)
```powershell
# Navegar a la carpeta del proyecto (si no estás ahí)
cd C:\Users\mojed\Desktop\code\inteliji\express

# Crear el archivo .env
New-Item -Path .env -ItemType File

# O simplemente abrir con editor y guardar
notepad .env
```

### Opción 2: Desde Visual Studio Code / Cursor
1. Abre la carpeta `express` en tu editor
2. Haz clic derecho en la raíz del proyecto (donde está `package.json`)
3. Selecciona **"New File"**
4. Nómbralo exactamente: `.env` (con el punto al inicio)

### Opción 3: Desde el Explorador de Windows
1. Abre el Explorador de Windows
2. Navega a: `C:\Users\mojed\Desktop\code\inteliji\express`
3. Haz clic derecho → **Nuevo** → **Documento de texto**
4. Renómbralo como: `.env` (incluye el punto)

## 📝 Contenido del archivo .env

Una vez creado el archivo, agrega este contenido (reemplaza con tus valores reales):

```env
# ===========================================
# CONFIGURACIÓN DEL SERVIDOR
# ===========================================
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# ===========================================
# CREDENCIALES DE SUPABASE
# ===========================================
# IMPORTANTE: Obtén estos valores desde:
# https://app.supabase.com/project/[TU_PROYECTO]/settings/api

# URL de tu proyecto Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co

# Service Role Key (clave privada)
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# ===========================================
# CONFIGURACIÓN DE JWT
# ===========================================
# Genera un secreto seguro
JWT_SECRET=tu_jwt_secret_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=7d
```

## ✅ Verificar que el archivo esté en el lugar correcto

### Desde PowerShell:
```powershell
# Verificar si existe
Test-Path .env

# Ver la ubicación completa
Get-Item .env | Select-Object FullName
```

### Verificación visual:
Asegúrate de que la estructura se vea así:
```
express/
├── .env              ← Debe estar aquí
├── package.json      ← Mismo nivel
├── src/              ← Carpeta
└── ...
```

**NO debe estar dentro de:**
- ❌ `src/.env` (incorrecto)
- ❌ `src/config/.env` (incorrecto)
- ✅ `express/.env` (correcto - en la raíz)

## 🔍 Verificar que dotenv carga el archivo

El archivo `src/index.ts` carga las variables de entorno en la línea 15:
```typescript
dotenv.config(); // Busca el archivo .env en la raíz del proyecto
```

Por defecto, `dotenv.config()` busca el archivo `.env` en la raíz del proyecto (donde ejecutas el comando `npm run dev`).

## ⚠️ Importante

1. **Nombre exacto:** El archivo debe llamarse exactamente `.env` (con el punto al inicio)
2. **Sin extensión:** No debe ser `.env.txt` o `.env.txt.txt`
3. **En la raíz:** Debe estar en la misma carpeta que `package.json`
4. **No subirlo a Git:** Asegúrate de que `.env` esté en `.gitignore`

## 🛡️ Verificar que .env esté en .gitignore

Verifica que el archivo `.env` esté en `.gitignore` para no subirlo a Git:

```bash
# Verificar
cat .gitignore | Select-String ".env"

# Si no está, agrégalo:
echo ".env" >> .gitignore
```

O manualmente, abre `.gitignore` y agrega:
```
.env
.env.local
```

## 🧪 Probar que funciona

Después de crear el archivo `.env` con tus credenciales:

```bash
npm run dev
```

Si todo está bien configurado, deberías ver:
```
✅ Database connection successful
🚀 Server running on http://localhost:3000
```

Si ves un error sobre credenciales, verifica que:
1. El archivo `.env` esté en la ubicación correcta
2. Las variables tengan los nombres correctos (en mayúsculas)
3. No haya espacios extra alrededor de los valores

---

**Resumen:** El archivo `.env` va en la **raíz del proyecto backend**, al mismo nivel que `package.json`. 🎯

