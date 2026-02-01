# 🧩 Guía de Componentes

## Estructura de Componentes

```
components/
├── ActionsView.tsx        # Gestión de acciones pendientes
├── BackOfficeView.tsx     # Panel de administración (SUPER_ADMIN)
├── CustomDevsView.tsx     # Desarrollos personalizados
├── DashboardView.tsx      # Vista principal/resumen
├── FaqView.tsx            # Preguntas frecuentes y tutoriales
├── Icons.tsx              # Wrapper de iconos Lucide
├── Login.tsx              # Pantalla de autenticación
├── ModulesView.tsx        # Vista de módulos ERP
├── StatusBadge.tsx        # Badge de estado reutilizable
├── TicketsView.tsx        # Sistema de tickets de soporte
└── TimelineView.tsx       # Cronograma del proyecto
```

---

## Componentes de Vista

### `App.tsx` (Componente Principal)
**Líneas**: ~524 | **Ubicación**: `/App.tsx`

Componente raíz que contiene:
- Layout principal (sidebar + contenido)
- Navegación entre vistas
- Estado global de la aplicación
- Lógica de tema oscuro/claro
- Control de pantalla completa

**Funciones Principales**:
| Función | Descripción |
|---------|-------------|
| `fetchData()` | Carga datos desde Supabase según rol |
| `toggleFullscreen()` | Alterna modo pantalla completa |
| `toggleDarkMode()` | Cambia entre tema claro/oscuro |
| `handleToggleAction()` | Marca acciones como completadas |
| `NavItem()` | Componente de navegación interna |

---

### `DashboardView.tsx`
**Propósito**: Vista resumen con métricas y KPIs

**Características**:
- Tarjetas de resumen (módulos, tickets, progreso)
- Gráficas con Recharts
- Indicadores de fase actual
- Lista de acciones críticas

**Props**:
```typescript
interface DashboardViewProps {
  modules: Module[];
  timeline: TimelineEvent[];
  tickets: Ticket[];
  pendingActions: ActionItem[];
}
```

---

### `ModulesView.tsx`
**Propósito**: Catálogo de módulos ERP con estado y progreso

**Características**:
- Grid de tarjetas de módulos
- Barra de progreso visual
- Lista de subfuncionalidades
- Filtros por estado

**Props**:
```typescript
interface ModulesViewProps {
  modules: Module[];
  onSelectModule?: (module: Module) => void;
}
```

---

### `TimelineView.tsx`
**Propósito**: Visualización del cronograma por fases

**Características**:
- Timeline vertical/horizontal
- Indicador de fase actual
- Desglose de tareas por sprint
- Estados coloreados

**Props**:
```typescript
interface TimelineViewProps {
  timeline: TimelineEvent[];
  currentPhase?: string;
}
```

---

### `TicketsView.tsx`
**Propósito**: Sistema de gestión de tickets de soporte

**Características**:
- Tabla/lista de tickets
- Creación de nuevos tickets
- Vista detalle con historial
- Filtros por estado/prioridad
- Diseño responsivo (cards en móvil)

**Props**:
```typescript
interface TicketsViewProps {
  tickets: Ticket[];
  modules: Module[];
  onCreateTicket?: (ticket: Ticket) => void;
}
```

---

### `BackOfficeView.tsx`
**Propósito**: Panel de administración para SUPER_ADMIN

**Líneas**: ~1400+ (componente más grande)

**Secciones**:
1. **OrganizationsManager**: CRUD de organizaciones
2. **ModulesManager**: Gestionar módulos por org
3. **TimelineManager**: Configurar fases/sprints
4. **UsersManager**: Administrar usuarios e invitaciones
5. **ResourcesManager**: FAQs y tutoriales

**Características**:
- Tabs para cada sección
- Modales de edición
- Persistencia en Supabase
- Validaciones

---

### `ActionsView.tsx`
**Propósito**: Lista de tareas pendientes del proyecto

**Características**:
- Checkbox para marcar completadas
- Indicador de críticas
- Filtros por departamento
- Ordenamiento por fecha

---

### `CustomDevsView.tsx`
**Propósito**: Desarrollos personalizados solicitados

**Características**:
- Lista de solicitudes custom
- Estado de cada desarrollo
- Fecha de entrega esperada

---

### `FaqView.tsx`
**Propósito**: Centro de ayuda y recursos

**Características**:
- Acordeón de preguntas frecuentes
- Categorías de FAQs
- Grid de tutoriales
- Tipos: VIDEO | DOC

---

### `Login.tsx`
**Propósito**: Autenticación de usuarios

**Características**:
- Formulario email/password
- Integración con Supabase Auth
- Manejo de errores
- Diseño responsive

---

## Componentes Compartidos

### `StatusBadge.tsx`
Badge reutilizable para mostrar estados.

```typescript
interface StatusBadgeProps {
  status: Status | TicketStatus | string;
  size?: 'sm' | 'md' | 'lg';
}
```

**Colores por Estado**:
| Estado | Color |
|--------|-------|
| COMPLETED | Verde |
| IN_PROGRESS | Azul |
| PENDING | Gris |
| BLOCKED | Rojo |
| TESTING | Amarillo |

---

### `Icons.tsx`
Wrapper para importación centralizada de iconos Lucide.

```typescript
// Uso
import { BriefcaseIcon, PackageIcon } from './Icons';
```

---

## Contextos

### `AuthContext.tsx`
**Ubicación**: `/contexts/AuthContext.tsx`

Provee estado de autenticación a toda la app.

```typescript
interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: TrackerProfile | null;
  organization: TrackerOrganization | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}
```

**Uso**:
```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAdmin, signOut } = useAuth();
  // ...
}
```

---

## Patrones Comunes

### Modal Pattern
```typescript
const [showModal, setShowModal] = useState(false);
const [editingItem, setEditingItem] = useState<Item | null>(null);

const handleEdit = (item: Item) => {
  setEditingItem(item);
  setShowModal(true);
};

const handleSave = async (data: FormData) => {
  // Guardar en Supabase
  setShowModal(false);
  setEditingItem(null);
};
```

### Loading States
```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchData()
    .then(setData)
    .catch(e => setError(e.message))
    .finally(() => setLoading(false));
}, []);
```

### Responsive Design
```typescript
// Clases condicionales para responsive
<div className={`
  ${isMobile ? 'flex-col px-4' : 'flex-row px-8'}
  gap-4
`}>
```
