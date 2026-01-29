# Trantor Tracker SaaS

**Trantor Tracker** es una plataforma SaaS B2B diseñada para la gestión integral de proyectos de consultoría de sistemas. Permite la administración multi-tenant de clientes, módulos ERP, cronogramas de implementación y soporte técnico, garantizando el aislamiento de datos y una experiencia personalizada por organización.

## 🚀 Arquitectura SaaS & Multi-tenancy

Esta aplicación ha sido transformada de un tracker simple a una solución multi-organizacional robusta:

-   **Multi-tenancy Real**: Aislamiento estricto de datos por `organization_id` reforzado por Row Level Security (RLS) en PostgreSQL.
-   **Roles de Usuario**:
    -   `SUPER_ADMIN`: Gestión global de todos los tenants, configuración del sistema y aprovisionamiento.
    -   `ORG_ADMIN`: Gestión interna de una organización específica (planificación futura).
    -   `CLIENT_USER`: Acceso de lectura a su proyecto y escritura para Tickets de Soporte.
-   **Flujos Diferenciados**:
    -   **BackOffice (Admin)**: Panel completo para crear clientes, asignar módulos, definir cronogramas y gestionar usuarios.
    -   **Portal Cliente**: Vista simplificada y brandeada para que el cliente consulte su avance y solicite ayuda.

## 🌟 Características Principales

### Para el Administrador (BackOffice)
-   **Gestión de Organizaciones**: Creación y configuración de nuevos clientes (Tenants).
-   **Gestión de Usuarios**: Invitación y asignación de usuarios a organizaciones específicas.
-   **Configuración de Proyecto**:
    -   Alta de Módulos y Funcionalidades por cliente.
    -   Creación de Sprints y Fases en el Cronograma.
    -   Asignación de "Responsables" y recursos.

### Para el Cliente
-   **Dashboard Personalizado**: Vista resumen filtrada exclusivamente para su organización.
-   **Seguimiento en Tiempo Real**: Visualización de avance de módulos y cumplimiento de fechas.
-   **Sistema de Tickets**: Levantamiento de incidencias vinculado a su contexto organizacional.
-   **Recursos**: Acceso a tutoriales y FAQs específicos o globales.

## 🛠️ Stack Tecnológico

-   **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Lenguaje**: TypeScript
-   **Estilos**: Tailwind CSS (Diseño responsivo y Modo Oscuro)
-   **Iconos**: [Lucide React](https://lucide.dev/)
-   **Backend & Auth**: [Supabase](https://supabase.com/)
    -   PostgreSQL
    -   Authentication (Email/Password)
    -   Row Level Security (RLS) policies

## 📦 Instalación y Configuración Local

### Prerrequisitos
-   Node.js (v18+)
-   Cuenta de Supabase (Proyecto creado)

### Pasos

1.  **Clonar el repositorio**:
    ```bash
    git clone <repository-url>
    cd TrantorTracker
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**:
    Crea un archivo `.env.local` en la raíz:
    ```env
    VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
    VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
    ```

4.  **Configurar Base de Datos (Supabase)**:
    -   Ejecutar las migraciones SQL ubicadas en `/supabase/migrations` para crear las tablas (`tracker_organizations`, `tracker_profiles`, etc.) y las políticas RLS.

5.  **Ejecutar en desarrollo**:
    ```bash
    npm run dev
    ```

## 🗄️ Modelo de Datos (Core)

-   `tracker_organizations`: Entidad raíz (Tenants).
-   `tracker_profiles`: Extension de perfil de usuario ligada a `auth.users` y `tracker_organizations`.
-   `tracker_modules`: Módulos del ERP (Tenant-scoped).
-   `tracker_timeline_events`: Sprints y Fases (Tenant-scoped).
-   `tracker_tickets`: Incidencias de soporte (Tenant-scoped).

## 🔒 Seguridad

El sistema implementa un modelo de seguridad "Zero Trust" a nivel de base de datos. Incluso si el frontend fuera comprometido, las políticas RLS impiden que un usuario de la Organización A acceda a los datos de la Organización B.

---
Desarrollado por **Antigravity** para **Trantor Tracker**.
