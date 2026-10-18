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
│   │   ├── agenda/          # Agenda interactiva con vistas Día/Semana/Mes
│   │   ├── pacientes/       # CRUD de Pacientes y Expediente Clínico Completo
│   │   ├── tratamientos/    # Catálogo editable de Tratamientos por categoría y color
│   │   ├── recordatorios/   # Centro de Recordatorios de WhatsApp (Enlaces manuales wa.me)
│   │   ├── reportes/        # Métricas, ventas y exportación Excel/CSV/PDF
│   │   ├── configuracion/   # Configuración de profesionales, cabinas y empresa
│   │   └── api/             # Endpoints REST API (Auth, Pacientes, Citas, Pagos, etc.)
│   ├── components/          # Componentes UI encapsulados
│   ├── lib/                 # Utilidades, servicios DTO, validaciones Zod
│   └── types/               # Definiciones de TypeScript
├── tests/
│   └── test_app.py          # Suite de pruebas automatizadas
└── README.md
```

---

## 🛠️ Tecnologías Empleadas

- **Frontend:** React, Next.js, TypeScript, Tailwind CSS, Lucide Icons, FullCalendar / Custom Schedule UI.
- **Backend:** Next.js REST API Handlers / Node.js, DTOs con Zod.
- **Base de Datos:** Prisma ORM (SQLite en entorno de pruebas / PostgreSQL en producción).
- **Integraciones:** WhatsApp Web API (URLs prellenadas `https://wa.me/`).
- **Pruebas:** Python Unittest / Vitest.

---

## 📊 Módulos Principales

1. **Dashboard & Indicadores:**
   - Citas del día, pacientes de hoy, ingresos diarios, abonos pendientes y recordatorios por enviar.
2. **Agenda & Calendario Pro:**
   - Vista por Día, Semana y Mes.
   - Código de colores por tipo de tratamiento (Faciales: Azul, Masajes: Verde, Láser: Morado, Depilación: Rosado, Corporales: Naranja, Otros: Gris).
   - Modal interactivo para reagendar, duplicar, cancelar o confirmar citas.
3. **Expediente de Pacientes:**
   - Datos personales, historial de tratamientos, saldo/abonos, fotografías, alergias y consentimientos.
4. **Catálogo de Tratamientos:**
   - Gestión de servicios, precios, duraciones, categorías y colores.
5. **Recordatorios de WhatsApp:**
   - Generación instantánea de mensajes prellenados (Recordatorio de cita, confirmación, cancelación, cumpleaños, promociones) para envío manual supervisado.
6. **Reportes & Exportación:**
   - Reportes detallados de ingresos, cancelaciones, pacientes nuevos/frecuentes y exportación en CSV/Excel.
7. **Seguridad y Roles:**
   - Roles definidos: Administrador, Recepción, Especialista.

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
