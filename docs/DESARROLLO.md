# 🛠️ Guía de Desarrollo

## Requisitos Previos

- **Node.js**: v18 o superior
- **npm**: v9 o superior
- **Cuenta Supabase**: Con proyecto creado
- **Editor**: VS Code recomendado

---

## Configuración Inicial

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd "Trantor Tracker SaaS"
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear archivo `.env.local` en la raíz:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

> ⚠️ **Importante**: No commitear `.env.local` al repositorio

### 4. Configurar Base de Datos
Ejecutar las migraciones en Supabase en el siguiente orden:

1. `20260128_init_multitenancy.sql`
2. `20260128_rls_policies.sql`
3. `20260128_link_new_users.sql`
4. `20260128_fix_missing_profile.sql`
5. `20260128_add_module_responsibles.sql`

### 5. Crear Usuario Admin Inicial
En Supabase Dashboard:
1. Auth > Users > Invite user
2. SQL Editor: Actualizar rol a SUPER_ADMIN
```sql
UPDATE tracker_profiles 
SET role = 'SUPER_ADMIN' 
WHERE id = '<user-id>';
```

---

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (http://localhost:5173) |
| `npm run build` | Compilar para producción |
| `npm run preview` | Previsualizar build de producción |

---

## Estructura del Proyecto

```
/
├── .env.local              # Variables de entorno (no en git)
├── index.html              # HTML principal
├── index.tsx               # Punto de entrada React
├── App.tsx                 # Componente raíz
├── types.ts                # Definiciones TypeScript
├── constants.ts            # Datos de ejemplo
├── vite.config.ts          # Configuración Vite
├── tsconfig.json           # Configuración TypeScript
│
├── components/             # Componentes React
│   ├── *View.tsx           # Vistas principales
│   └── *.tsx               # Componentes compartidos
│
├── contexts/               # React Context
│   └── AuthContext.tsx     # Estado de autenticación
│
├── lib/                    # Servicios y utilidades
│   ├── supabase.ts         # Cliente Supabase
│   ├── database.types.ts   # Tipos generados
│   └── mappers.ts          # Transformadores de datos
│
├── supabase/
│   └── migrations/         # Scripts SQL
│
└── docs/                   # Esta documentación
```

---

## Flujo de Desarrollo

### Crear Nueva Feature

1. **Crear rama**
   ```bash
   git checkout -b feature/nombre-feature
   ```

2. **Desarrollar**
   - Seguir convenciones de código
   - Agregar tipos TypeScript
   - Probar con diferentes roles

3. **Commit**
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   ```

4. **Push y PR**
   ```bash
   git push origin feature/nombre-feature
   ```

### Convenciones de Commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `docs:` | Solo documentación |
| `style:` | Formato (no afecta lógica) |
| `refactor:` | Reestructuración sin cambiar comportamiento |
| `test:` | Agregar/modificar tests |
| `chore:` | Tareas de mantenimiento |

---

## Convenciones de Código

### TypeScript
- Usar tipos explícitos, evitar `any`
- Interfaces para objetos, types para unions
- Nombrar interfaces en PascalCase

```typescript
// ✅ Correcto
interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
}

// ❌ Evitar
const user: any = { ... };
```

### React
- Componentes funcionales con hooks
- Nombrar componentes en PascalCase
- Un componente por archivo

```typescript
// ✅ Correcto
export function MyComponent({ prop }: MyComponentProps) {
  const [state, setState] = useState<string>('');
  return <div>{state}</div>;
}

// ❌ Evitar
export default function(props) { ... }
```

### CSS/Estilos
- Clases de Tailwind en línea
- Agrupar clases por categoría
- Mobile-first

```tsx
// ✅ Organizado
<div className="
  flex flex-col md:flex-row
  gap-4 p-4
  bg-white dark:bg-gray-800
  rounded-lg shadow
">
```

---

## Testing Manual

### Probar Roles

1. **SUPER_ADMIN**
   - Debe ver BackOffice
   - Debe ver todas las organizaciones
   - Puede crear/editar todo

2. **ORG_ADMIN**
   - Puede gestionar su organización
   - No ve otras organizaciones
   - No ve BackOffice completo

3. **CLIENT_USER**
   - Solo lectura de su proyecto
   - Puede crear tickets
   - No ve sección admin

### Probar RLS
Usar incógnito para login con diferentes usuarios y verificar aislamiento de datos.

---

## Troubleshooting

### Error: "No profile found"
**Causa**: Usuario sin registro en `tracker_profiles`

**Solución**:
```sql
INSERT INTO tracker_profiles (id, full_name, role)
VALUES ('<user-id>', 'Nombre', 'CLIENT_USER');
```

### Error 401/403 en consultas
**Causa**: Sesión expirada o RLS bloqueando

**Solución**:
- Cerrar sesión y volver a entrar
- Verificar que el usuario tenga `organization_id` asignado

### Tipos desactualizados
**Causa**: Cambios en esquema de DB

**Solución**:
```bash
npx supabase gen types typescript --project-id <id> > lib/database.types.ts
```

---

## Despliegue

### Build de Producción
```bash
npm run build
```

### Archivos generados
Los archivos de producción se generan en `/dist/`:
- `index.html`
- `assets/` (JS, CSS, imágenes)

### Plataformas Recomendadas
- **Vercel**: Conectar repo GitHub, auto-deploy
- **Netlify**: Similar a Vercel
- **Cloudflare Pages**: Alternativa gratuita

### Variables de Entorno en Producción
Configurar en el dashboard de la plataforma:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Recursos Adicionales

- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de Supabase](https://supabase.com/docs)
- [Lucide Icons](https://lucide.dev/icons/)
- [Tailwind CSS](https://tailwindcss.com/docs)
