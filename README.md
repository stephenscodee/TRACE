# Trace CRM - El CRM que de verdad se usa

> **"Toda la información del cliente, sin que el comercial tenga que introducirla."**

Trace CRM es un CRM anti-fricción diseñado para equipos pequeños que necesitan simplicidad y captura automática de información, no complejidad.

## 🎯 Propuesta de Valor

- **Captura automática**: Emails se asocian solos a clientes
- **Cero fricción**: Todo en 2-3 clics máximo
- **Visión única**: Timeline automático de todas las interacciones
- **IA inteligente**: Resume conversaciones y sugiere acciones

## 🚀 Inicio Rápido

### Requisitos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Instalar dependencias de todos los módulos
npm run install:all

# O manualmente:
cd backend && npm install
cd ../frontend && npm install
```

### Configuración

1. **Backend**: Copia `env.example` a `.env` y configura:

```bash
cd backend
cp env.example .env
```

Edita `.env` con tus valores:
- `JWT_SECRET`: Clave secreta para tokens (genera una aleatoria)
- `OPENAI_API_KEY`: (Opcional) Para funciones de IA
- `GMAIL_CLIENT_ID` y `GMAIL_CLIENT_SECRET`: (Opcional) Para integración Gmail

2. **Frontend**: No requiere configuración inicial

### Ejecutar

```bash
# Desarrollo (backend + frontend en paralelo)
npm run dev

# O por separado:
npm run dev:backend  # Puerto 3001
npm run dev:frontend # Puerto 5173
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 📁 Estructura del Proyecto

```
TRACE/
├── backend/
│   ├── db/              # Base de datos SQLite
│   ├── routes/          # Endpoints API
│   ├── services/        # Servicios (IA, email)
│   ├── middleware/      # Autenticación
│   └── server.js        # Servidor Express
├── frontend/
│   ├── src/
│   │   ├── pages/       # Páginas principales
│   │   ├── components/  # Componentes reutilizables
│   │   ├── contexts/    # Context API (Auth)
│   │   └── services/    # Cliente API
│   └── vite.config.js
└── README.md
```

## 🧠 Funcionalidades MVP

### ✅ Implementado

- ✅ Autenticación (registro/login con JWT)
- ✅ CRUD de clientes
- ✅ Timeline de interacciones
- ✅ Pipeline de oportunidades
- ✅ Notas rápidas
- ✅ Dashboard con estadísticas
- ✅ Integración Gmail (OAuth + sincronización)
- ✅ IA para resumir conversaciones
- ✅ Búsqueda y filtros

### 🔄 Pendiente (Futuro)

- Recordatorios inteligentes
- Notas por voz (Speech-to-Text)
- Clasificación automática de leads
- Sugerencias de próxima acción
- Integración Outlook
- Exportación de datos

## 🗄️ Modelo de Datos

- **Users**: Usuarios del sistema (admin/comercial)
- **Clients**: Clientes y contactos
- **Opportunities**: Oportunidades de venta
- **Interactions**: Emails, llamadas, notas
- **Email_connections**: Tokens OAuth para email
- **Reminders**: Recordatorios (estructura lista)

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens). Al registrarte o iniciar sesión, recibes un token que debes incluir en todas las peticiones:

```
Authorization: Bearer <token>
```

## 📧 Integración Gmail

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto y habilita Gmail API
3. Crea credenciales OAuth 2.0
4. Añade `http://localhost:3001/api/email/gmail/callback` como redirect URI
5. Configura `GMAIL_CLIENT_ID` y `GMAIL_CLIENT_SECRET` en `.env`
6. En la app, ve a Configuración → Conectar Gmail

## 🤖 IA (OpenAI)

Para habilitar funciones de IA:

1. Obtén una API key de OpenAI
2. Configura `OPENAI_API_KEY` en `.env`
3. La IA se usará automáticamente para:
   - Resumir conversaciones largas (>200 caracteres)
   - Clasificar leads (caliente/tibio/frío)
   - Sugerir próximas acciones

## 🛠️ Tecnologías

**Backend:**
- Node.js + Express
- SQLite (better-sqlite3)
- JWT para autenticación
- Google APIs (Gmail)
- OpenAI API

**Frontend:**
- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide Icons

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual

### Clientes
- `GET /api/clients` - Listar clientes
- `GET /api/clients/:id` - Detalle cliente
- `POST /api/clients` - Crear cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente

### Oportunidades
- `GET /api/opportunities` - Listar oportunidades
- `GET /api/opportunities/pipeline/summary` - Resumen pipeline
- `POST /api/opportunities` - Crear oportunidad
- `PUT /api/opportunities/:id` - Actualizar oportunidad

### Interacciones
- `GET /api/interactions` - Listar interacciones
- `POST /api/interactions` - Crear interacción (nota, email, etc.)

### Email
- `GET /api/email/gmail/auth` - Iniciar OAuth Gmail
- `POST /api/email/sync` - Sincronizar emails
- `GET /api/email/connections` - Listar conexiones

## 🎨 Principios de Diseño

1. **Simplicidad radical**: Cada acción en máximo 2-3 clics
2. **Captura automática**: Menos input manual, más automatización
3. **Visión única**: Todo sobre un cliente en un solo lugar
4. **Sin fricción**: El comercial no debe "pensar" en el CRM

## 🚧 Roadmap

### Fase 1 (MVP Actual) ✅
- Autenticación y usuarios
- CRUD básico
- Timeline de interacciones
- Pipeline simple

### Fase 2 (Próximo)
- Recordatorios inteligentes
- Notas por voz
- Clasificación automática de leads
- Dashboard avanzado

### Fase 3 (Futuro)
- Integración con facturación
- Scoring de leads
- Predicción de cierre
- Análisis de rentabilidad

## 📄 Licencia

Este proyecto es privado y propietario.

## 🤝 Contribuir

Este es un proyecto MVP. Las contribuciones son bienvenidas, pero priorizamos:
1. Simplicidad sobre funcionalidad
2. UX sobre features
3. Automatización sobre input manual

---

**"El mercado no necesita otro CRM. Necesita uno que no moleste."**

