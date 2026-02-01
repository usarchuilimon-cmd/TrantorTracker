# 📚 Documentación de Trantor Tracker SaaS

Bienvenido a la documentación técnica del proyecto **Trantor Tracker SaaS**, una plataforma multi-tenant para la gestión integral de proyectos de consultoría de sistemas ERP.

## 📑 Índice de Documentos

| Documento | Descripción |
|-----------|-------------|
| [Arquitectura](./ARQUITECTURA.md) | Arquitectura general, stack tecnológico y patrones de diseño |
| [Base de Datos](./DATABASE.md) | Modelo de datos, migraciones y políticas RLS |
| [Componentes](./COMPONENTES.md) | Guía de componentes React y sus propósitos |
| [API y Servicios](./API.md) | Integración con Supabase y servicios externos |
| [Guía de Desarrollo](./DESARROLLO.md) | Setup local, convenciones y flujo de trabajo |

## 🚀 Inicio Rápido

```bash
# Clonar repositorio
git clone <repository-url>
cd TrantorTracker

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev
```

## 🏗️ Estructura del Proyecto

```
Trantor Tracker SaaS/
├── components/          # Componentes React
├── contexts/            # Contextos de React (Auth)
├── lib/                 # Servicios y configuración Supabase
├── supabase/
│   └── migrations/      # Scripts SQL de migración
├── App.tsx              # Componente principal
├── types.ts             # Definiciones TypeScript
├── constants.ts         # Datos de ejemplo y configuración
└── index.tsx            # Punto de entrada
```

## 👥 Roles de Usuario

| Rol | Permisos |
|-----|----------|
| `SUPER_ADMIN` | Acceso total, gestión de todas las organizaciones |
| `ORG_ADMIN` | Gestión de su organización asignada |
| `CLIENT_USER` | Lectura de proyecto, creación de tickets |

---

> Desarrollado por **Antigravity** para **Trantor Tracker**
