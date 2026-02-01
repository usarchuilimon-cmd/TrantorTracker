# 🔌 API y Servicios

## Supabase Client

### Configuración
**Ubicación**: `/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Variables de Entorno
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
```

---

## Tipos de Base de Datos

**Ubicación**: `/lib/database.types.ts`

Tipos generados automáticamente para TypeScript que reflejan el esquema de Supabase.

```typescript
export interface Database {
  public: {
    Tables: {
      tracker_organizations: { ... }
      tracker_profiles: { ... }
      tracker_modules: { ... }
      tracker_timeline_events: { ... }
      tracker_tickets: { ... }
      tracker_invitations: { ... }
    }
    Enums: {
      user_role: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'CLIENT_USER'
    }
  }
}
```

---

## Mappers

**Ubicación**: `/lib/mappers.ts`

Funciones para transformar datos entre formato de DB y formato de frontend.

```typescript
// Ejemplo
export function mapDbModuleToModule(dbModule: DbModule): Module {
  return {
    id: dbModule.id,
    name: dbModule.name,
    status: dbModule.status as Status,
    // ...
  };
}
```

---

## Operaciones CRUD

### Autenticación

```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@ejemplo.com',
  password: 'password123'
});

// Logout
await supabase.auth.signOut();

// Obtener sesión actual
const { data: { session } } = await supabase.auth.getSession();

// Listener de cambios de auth
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session);
});
```

### Organizaciones

```typescript
// Listar todas (solo SUPER_ADMIN)
const { data: orgs } = await supabase
  .from('tracker_organizations')
  .select('*')
  .order('name');

// Crear
const { data, error } = await supabase
  .from('tracker_organizations')
  .insert({ name: 'Nueva Org' })
  .select()
  .single();

// Actualizar
await supabase
  .from('tracker_organizations')
  .update({ name: 'Nombre Actualizado' })
  .eq('id', orgId);

// Eliminar
await supabase
  .from('tracker_organizations')
  .delete()
  .eq('id', orgId);
```

### Perfiles

```typescript
// Obtener perfil actual
const { data: profile } = await supabase
  .from('tracker_profiles')
  .select('*, tracker_organizations(*)')
  .eq('id', userId)
  .single();

// Listar usuarios de una org
const { data: users } = await supabase
  .from('tracker_profiles')
  .select('*')
  .eq('organization_id', orgId);
```

### Módulos

```typescript
// Listar módulos (RLS filtra automáticamente por org)
const { data: modules } = await supabase
  .from('tracker_modules')
  .select('*')
  .order('name');

// Crear módulo
const { error } = await supabase
  .from('tracker_modules')
  .insert({
    name: 'Nuevo Módulo',
    description: 'Descripción',
    status: 'PENDING',
    progress: 0,
    organization_id: orgId
  });

// Actualizar progreso
await supabase
  .from('tracker_modules')
  .update({ progress: 75, status: 'IN_PROGRESS' })
  .eq('id', moduleId);
```

### Timeline

```typescript
// Listar eventos
const { data: events } = await supabase
  .from('tracker_timeline_events')
  .select('*')
  .order('date');

// Upsert (crear o actualizar)
await supabase
  .from('tracker_timeline_events')
  .upsert({
    id: eventId, // Si existe, actualiza
    phase: 'Fase 1',
    status: 'IN_PROGRESS',
    organization_id: orgId
  });
```

### Tickets

```typescript
// Listar tickets de mi org
const { data: tickets } = await supabase
  .from('tracker_tickets')
  .select('*')
  .order('created_at', { ascending: false });

// Crear ticket
const { error } = await supabase
  .from('tracker_tickets')
  .insert({
    id: `T-${Date.now()}`,
    title: 'Nuevo ticket',
    description: 'Descripción del problema',
    module_id: moduleId,
    module_name: moduleName,
    priority: 'Media',
    status: 'Abierto',
    requester: userName,
    organization_id: orgId
  });

// Agregar comentario (update JSONB)
const ticket = await supabase
  .from('tracker_tickets')
  .select('updates')
  .eq('id', ticketId)
  .single();

const newUpdate = {
  id: crypto.randomUUID(),
  author: 'Soporte',
  date: new Date().toISOString(),
  message: 'Comentario',
  type: 'COMMENT'
};

await supabase
  .from('tracker_tickets')
  .update({ 
    updates: [...(ticket.data.updates || []), newUpdate],
    updated_at: new Date().toISOString()
  })
  .eq('id', ticketId);
```

### Invitaciones

```typescript
// Crear invitación
const { error } = await supabase
  .from('tracker_invitations')
  .insert({
    email: 'nuevo@usuario.com',
    organization_id: orgId,
    role: 'CLIENT_USER',
    status: 'PENDING'
  });

// Listar invitaciones pendientes
const { data } = await supabase
  .from('tracker_invitations')
  .select('*, tracker_organizations(name)')
  .eq('status', 'PENDING');
```

---

## Consultas con Joins

```typescript
// Perfil con organización
const { data } = await supabase
  .from('tracker_profiles')
  .select(`
    *,
    organization:tracker_organizations(*)
  `)
  .eq('id', userId)
  .single();

// Tickets con módulo
const { data } = await supabase
  .from('tracker_tickets')
  .select(`
    *,
    module:tracker_modules(name, icon)
  `);
```

---

## Manejo de Errores

```typescript
const handleSupabaseError = (error: PostgrestError | null) => {
  if (!error) return null;
  
  switch (error.code) {
    case '23505':
      return 'Este registro ya existe';
    case '23503':
      return 'Referencia inválida';
    case '42501':
      return 'No tienes permisos para esta operación';
    default:
      return error.message;
  }
};
```

---

## Regenerar Tipos de DB

Para actualizar los tipos TypeScript después de cambios en el esquema:

```bash
npx supabase gen types typescript --project-id <tu-project-id> > lib/database.types.ts
```
