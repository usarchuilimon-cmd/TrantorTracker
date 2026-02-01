
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
  organizationId?: string;
  phone?: string;
  jobTitle?: string;
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
  organizationId?: string;
  responsibles?: string;
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
  organizationId?: string;
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
  organizationId?: string;
  updates?: TicketUpdate[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  organizationId?: string;
}

export interface TutorialItem {
  id: string;
  title: string;
  duration: string;
  type: 'VIDEO' | 'DOC';
  thumbnailColor: string;
  organizationId?: string;
}

export interface Invitation {
  id: string;
  email: string;
  organizationId: string;
  role: 'CLIENT_USER' | 'ORG_ADMIN' | 'SUPER_ADMIN';
  status: 'PENDING' | 'ACCEPTED';
  createdAt: string;
}

export enum ProjectStage {
  PRE_KICKOFF = 'PRE_KICKOFF',
  IMPLEMENTATION = 'IMPLEMENTATION',
  UAT = 'UAT',
  GO_LIVE = 'GO_LIVE',
  SUPPORT = 'SUPPORT',
  CHURNED = 'CHURNED'
}

export enum HealthStatus {
  ON_TRACK = 'ON_TRACK',
  AT_RISK = 'AT_RISK',
  DELAYED = 'DELAYED',
  CRITICAL = 'CRITICAL'
}

export interface BrandingConfig {
  logoUrl?: string;
  primaryColor?: string;
  portalTitle?: string;
}

export interface Organization {
  id: string;
  name: string;
  project_stage?: ProjectStage;
  health_status?: HealthStatus;
  start_date?: string;
  target_go_live?: string;
  actual_go_live?: string;
  branding_config?: BrandingConfig;
  contact_email?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  link?: string;
  created_at: string;
}