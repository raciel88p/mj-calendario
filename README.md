# MJ Estética - MJ Calendario 🌸✨

**MJ Estética** (MJ Calendario) es una plataforma web profesional y moderna para la administración completa de clínicas estéticas, inspirada en plataformas como SIKU, Fresha, Cliniko, Notion Calendar y Google Calendar.

---

## 🎨 Paleta de Colores y Diseño
- **Blanco puro (`#FFFFFF`)** y **Gris muy claro (`#F9FAFB`)**
- **Rosado suave (`#FDF2F8`, `#F472B6`)**
- **Detalles dorados (`#D97706`, `#F59E0B`, `#B45309`)**
- **Tipografía moderna, limpia e interfaz ultra intuitiva (Light Mode)**

---

## 🚀 Arquitectura del Sistema

La aplicación sigue los principios de **Clean Architecture**, **SOLID**, **Domain-Driven Design (DDD)** y **Repository Pattern**.

```
mj-calendario/
├── prisma/
│   ├── schema.prisma        # Esquema de base de datos relacional (PostgreSQL / SQLite)
│   └── seed.ts              # Semillero de datos iniciales
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Layout principal con navegación responsiva
│   │   ├── page.tsx         # Dashboard principal con métricas y agenda del día
│   │   ├── agenda/          # Agenda interactiva estilo Google Calendar
│   │   ├── pacientes/       # Clientes & Pacientes (Cédula, Correo, Importador Excel)
│   │   ├── crm/             # CRM Negocios & Embudo Multicanal
│   │   ├── tratamientos/    # Catálogo editable de Tratamientos
│   │   ├── recordatorios/   # Centro de Recordatorios de WhatsApp (Enlaces manuales wa.me)
│   │   ├── reportes/        # Métricas, Metas de Ventas, Eficiencia de Asistentes y CSV
│   │   ├── configuracion/   # Sucursales de Costa Rica y ajustes
│   │   └── api/             # Endpoints REST API (Auth, Pacientes, Citas, Pagos)
│   ├── components/          # Componentes UI encapsulados
│   ├── lib/                 # Utilidades, servicios DTO, datos de muestra
│   └── types/               # Definiciones de TypeScript
├── tests/
│   └── test_app.py          # Suite de pruebas automatizadas
└── README.md
```

---

## 🗄️ ¿Qué se necesita para conectar la sección de Clientes a una Base de Datos?

Para que la sección de clientes guarde la información de manera persistente en una base de datos de producción (PostgreSQL, Supabase, Neon, CockroachDB o SQLite), se requiere lo siguiente:

1. **Servidor / Proveedor de Base de Datos:**
   - Una URL de conexión relacional, por ejemplo en Supabase, Neon.tech o PostgreSQL (`postgresql://usuario:password@host:5432/dbname`).
2. **Variable de Entorno (`.env`):**
   ```env
   DATABASE_URL="postgresql://usuario:password@host:5432/dbname"
   ```
3. **Ejecución de Migraciones Prisma:**
   ```bash
   npx prisma migrate dev --name init
   ```
4. **Comando de Generación del Cliente Prisma:**
   ```bash
   npx prisma generate
   ```
5. **Endpoints REST API ya implementados:**
   - `GET /api/patients` (Obtiene todos los clientes)
   - `POST /api/patients` (Guarda clientes con Cédula, Correo, Teléfono, Residencia y Membresía MJ)

---

## 🛠️ Tecnologías Empleadas

- **Frontend:** React, Next.js, TypeScript, Tailwind CSS, Lucide Icons, FullCalendar / Custom Schedule UI.
- **Backend:** Next.js REST API Handlers / Node.js, DTOs con Zod.
- **Base de Datos:** Prisma ORM (SQLite en entorno local / PostgreSQL en producción).
- **Integraciones:** WhatsApp Web API (`https://wa.me/`).
- **Pruebas:** Python Unittest / Vitest.

---

## ⚙️ Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/raciel88p/mj-calendario.git
cd mj-calendario

# 2. Instalar dependencias
npm install

# 3. Inicializar la base de datos
npx prisma migrate dev --name init
npx prisma db seed

# 4. Iniciar en modo desarrollo
npm run dev

# 5. Ejecutar suite de pruebas
python3 test_app.py
```
