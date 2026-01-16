
export enum Status {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
  TESTING = 'TESTING' // UAT - User Acceptance Testing
}

export enum Department {
  GENERAL = 'Dirección General',
  ADMIN = 'Administración',
  SALES = 'Ventas',
  PURCHASING = 'Compras',
  HR = 'Recursos Humanos',
  PRODUCTION = 'Producción',
  QUALITY = 'Calidad',
  WAREHOUSE = 'Almacén',
  IT = 'Sistemas',
  LOGISTICS = 'Logística',
  MAINTENANCE = 'Mantenimiento',
  FINANCE = 'Finanzas',
  PLANNING = 'Planeación',
  SECURITY = 'Seguridad',
  STRATEGY = 'Planeación Estratégica'
}

export enum Tab {
  DASHBOARD = 'DASHBOARD',
  MODULES = 'MODULES',
  CUSTOM_DEVS = 'CUSTOM_DEVS',
  TIMELINE = 'TIMELINE',
  TICKETS = 'TICKETS',
  ACTIONS = 'ACTIONS',
  BACKOFFICE = 'BACKOFFICE',
  FAQ = 'FAQ'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  department: Department;
  avatar?: string;
}

export interface SubModule {
  name: string;
  status: Status;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  status: Status;
  icon: string;
  owner: string; // Changed from Department to string to allow multiple names
  progress: number;
  features: SubModule[];
}

export interface CustomDevelopment {
  id: string;
  title: string;
  description: string;
  requestedBy: Department;
  status: Status;
  deliveryDate: string;
}

export interface SprintTask {
  id: string;
  title: string;
  status: Status;
  week?: string;
}

export interface TimelineEvent {
  id: string;
  phase: string;
  date: string;
  status: Status;
  description: string;
  modulesIncluded?: string[];
  tasks?: SprintTask[];
}

export interface ActionItem {
  id: string;
  task: string;
  assignedTo: Department;
  dueDate: string;
  isCritical: boolean;
  status?: 'PENDING' | 'COMPLETED';
}

export enum TicketPriority {
  LOW = 'Baja',
  MEDIUM = 'Media',
  HIGH = 'Alta',
  CRITICAL = 'Crítica'
}

export enum TicketStatus {
  OPEN = 'Abierto',
  IN_PROGRESS = 'En Revisión',
  RESOLVED = 'Resuelto',
  CLOSED = 'Cerrado'
}

export interface TicketUpdate {
  id: string;
  author: string;
  date: string;
  message: string;
  type: 'COMMENT' | 'STATUS_CHANGE';
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  moduleId: string; // Relates to Module.id
  moduleName: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  requester: string;
  updates?: TicketUpdate[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface TutorialItem {
  id: string;
  title: string;
  duration: string;
  type: 'VIDEO' | 'DOC';
  thumbnailColor: string;
}