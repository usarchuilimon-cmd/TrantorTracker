# Trantor Tracker

**Trantor Tracker** es una plataforma integral de gestión y seguimiento de proyectos diseñada para facilitar la administración de módulos ERP, cronogramas de implementación, desarrollos a medida y soporte técnico.

Esta aplicación ofrece una interfaz moderna y centralizada para visualizar el progreso, gestionar usuarios y coordinar acciones críticas dentro de la organización (Grupo Omega).

## 🚀 Características Principales

-   **Dashboard Ejecutivo**: Visualización de KPIs, estado general de módulos y próximas entregas.
-   **Gestión de Módulos ERP**: Catálogo detallado de módulos con seguimiento de progreso y funcionalidades específicas.
-   **Cronograma (Timeline)**: Planificación de sprints y fases del proyecto con fechas y estados.
-   **Desarrollos a Medida**: Seguimiento de solicitudes de personalización por departamento.
-   **Gestión de Acciones**: Lista de tareas pendientes y críticas asignadas a diferentes áreas.
-   **Soporte y Tickets**: Sistema para levantar y dar seguimiento a incidencias técnicas.
-   **Centro de Ayuda (Recursos)**: FAQs y tutoriales para capacitación de usuarios.
-   **BackOffice Administrativo**: Panel de control para gestionar la configuración global, usuarios, y persistencia de datos (Sprints, Módulos, etc.).

## 🛠️ Stack Tecnológico

-   **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Lenguaje**: TypeScript
-   **Estilos**: Tailwind CSS (Clases utilitarias)
-   **Iconos**: [Lucide React](https://lucide.dev/)
-   **Gráficos**: [Recharts](https://recharts.org/)
-   **Backend / Base de Datos**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)

## 📦 Instalación y Configuración

### Prerrequisitos
-   Node.js (v18 o superior recomendado)
-   Cuenta de Supabase configurada

### Pasos para iniciar

1.  **Clonar el repositorio**:
    ```bash
    git clone <repository-url>
    cd TrantorTracker
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**:
    Crea un archivo `.env.local` en la raíz del proyecto y agrega tus credenciales de Supabase:
    ```env
    VITE_SUPABASE_URL=tu_url_de_supabase
    VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
    ```

4.  **Ejecutar en desarrollo**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible típicamente en `http://localhost:5173`.

5.  **Construir para producción**:
    ```bash
    npm run build
    ```

## 🗄️ Estructura de Base de Datos (Supabase)

El proyecto utiliza las siguientes tablas principales:
-   `tracker_modules`: Módulos del sistema ERP.
-   `tracker_module_features`: Sub-funcionalidades de cada módulo.
-   `tracker_timeline_events`: Fases o Sprints del cronograma.
-   `tracker_users`: Usuarios con acceso al sistema (Roles: ADMIN, USER).
-   `tracker_tickets`: Tickets de soporte.
-   `tracker_faqs` & `tracker_tutorials`: Recursos de ayuda.

## 🤝 Contribución

1.  Hacer un Fork del proyecto.
2.  Crear una rama para tu funcionalidad (`git checkout -b feature/AmazingFeature`).
3.  Hacer Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4.  Hacer Push a la rama (`git push origin feature/AmazingFeature`).
5.  Abrir un Pull Request.
