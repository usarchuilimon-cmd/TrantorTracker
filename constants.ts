
import { Status, Department, Module, CustomDevelopment, TimelineEvent, ActionItem, Ticket, TicketPriority, TicketStatus, FaqItem, TutorialItem } from './types';

export const COMPANY_NAME = "Laimu";
export const COMPANY_LOGO = "/laimu-logo.png";

export const PROJECT_START_DATE = "06 Enero 2025";
export const GO_LIVE_DATE = "25 Julio 2025";

export const MODULES: Module[] = [
  {
    id: '1',
    name: 'Compras',
    description: 'Gestión de requisiciones, órdenes de compra y evaluación de proveedores.',
    status: Status.COMPLETED,
    icon: 'Briefcase',
    owner: 'Jessica Rocha',
    progress: 100,
    features: [
      { name: 'Catálogo de Proveedores', status: Status.COMPLETED },
      { name: 'Requisiciones', status: Status.COMPLETED },
      { name: 'Órdenes de Compra', status: Status.COMPLETED },
      { name: 'Cuadros Comparativos', status: Status.COMPLETED },
      { name: 'Evaluación de Proveedores', status: Status.IN_PROGRESS }
    ]
  },
  {
    id: '2',
    name: 'Almacén',
    description: 'Control de inventarios, entradas, salidas y ubicaciones.',
    status: Status.COMPLETED,
    icon: 'Package',
    owner: 'Carolina Martínez',
    progress: 95,
    features: [
      { name: 'Catálogo de Artículos', status: Status.COMPLETED },
      { name: 'Entradas de Almacén', status: Status.COMPLETED },
      { name: 'Salidas y Traspasos', status: Status.COMPLETED },
      { name: 'Control de Lotes y Caducidades', status: Status.COMPLETED },
      { name: 'Inventario Físico', status: Status.IN_PROGRESS }
    ]
  },
  {
    id: '3',
    name: 'Planeación de la Producción',
    description: 'Programación maestra (MPS) y planeación de requerimientos de materiales (MRP).',
    status: Status.IN_PROGRESS,
    icon: 'Activity',
    owner: 'Jesus Romero y Emilio Mendoza',
    progress: 40,
    features: [
      { name: 'Plan Maestro (MPS)', status: Status.IN_PROGRESS },
      { name: 'Explosión de Materiales (MRP I)', status: Status.PENDING },
      { name: 'Planeación de Capacidad (CRP)', status: Status.PENDING },
      { name: 'Pronósticos de Demanda', status: Status.PENDING }
    ]
  },
  {
    id: '4',
    name: 'Producción',
    description: 'Control de piso, órdenes de producción y reporte de tiempos.',
    status: Status.IN_PROGRESS,
    icon: 'Factory',
    owner: 'Jesus Romero',
    progress: 30,
    features: [
      { name: 'Listas de Materiales (BOM)', status: Status.COMPLETED },
      { name: 'Rutas de Proceso', status: Status.IN_PROGRESS },
      { name: 'Órdenes de Producción', status: Status.IN_PROGRESS },
      { name: 'Reporte de Producción', status: Status.PENDING },
      { name: 'Cierre de Órdenes', status: Status.PENDING }
    ]
  },
  {
    id: '5',
    name: 'Calidad',
    description: 'Aseguramiento de calidad en recibo, proceso y producto terminado.',
    status: Status.PENDING,
    icon: 'CheckCircle',
    owner: 'Abigail Cuevas',
    progress: 10,
    features: [
      { name: 'Planes de Inspección', status: Status.IN_PROGRESS },
      { name: 'Inspección de Recibo', status: Status.PENDING },
      { name: 'Inspección en Proceso', status: Status.PENDING },
      { name: 'Certificados de Calidad', status: Status.PENDING },
      { name: 'No Conformidades', status: Status.PENDING }
    ]
  },
  {
    id: '6',
    name: 'Mantenimiento',
    description: 'Gestión de activos fijos, mantenimiento preventivo y correctivo.',
    status: Status.PENDING,
    icon: 'Settings',
    owner: 'Jesus Romero',
    progress: 5,
    features: [
      { name: 'Catálogo de Equipos', status: Status.IN_PROGRESS },
      { name: 'Planes de Mantenimiento', status: Status.PENDING },
      { name: 'Órdenes de Trabajo', status: Status.PENDING },
      { name: 'Bitácora de Fallas', status: Status.PENDING }
    ]
  },
  {
    id: '7',
    name: 'Seguridad',
    description: 'Seguridad industrial, EPP y gestión de accesos críticos.',
    status: Status.PENDING,
    icon: 'AlertTriangle',
    owner: 'Jesus Romero',
    progress: 0,
    features: [
      { name: 'Gestión de EPP', status: Status.PENDING },
      { name: 'Permisos de Trabajo', status: Status.PENDING },
      { name: 'Reporte de Incidentes', status: Status.PENDING },
      { name: 'Control de Accesos', status: Status.PENDING }
    ]
  },
  {
    id: '8',
    name: 'Recursos Humanos',
    description: 'Nómina, asistencia y expedientes.',
    status: Status.PENDING,
    icon: 'Users',
    owner: 'Kavit García',
    progress: 10,
    features: [
      { name: 'Expediente Digital', status: Status.IN_PROGRESS },
      { name: 'Control de Asistencia', status: Status.PENDING },
      { name: 'Prenómina', status: Status.PENDING },
      { name: 'Evaluaciones', status: Status.PENDING }
    ]
  },
  {
    id: '9',
    name: 'Planeación Estratégica',
    description: 'Tableros de control (BI) y seguimiento de objetivos corporativos.',
    status: Status.PENDING,
    icon: 'LayoutDashboard',
    owner: 'Abigail Cuevas',
    progress: 5,
    features: [
      { name: 'KPIs Generales', status: Status.IN_PROGRESS },
      { name: 'Presupuestos', status: Status.PENDING },
      { name: 'Tableros por Área', status: Status.PENDING },
      { name: 'Análisis de Rentabilidad', status: Status.PENDING }
    ]
  },
  {
    id: '10',
    name: 'Ventas',
    description: 'Ciclo comercial desde la cotización hasta el pedido.',
    status: Status.IN_PROGRESS,
    icon: 'Briefcase',
    owner: 'Jessica Rocha y Jesus Romero',
    progress: 60,
    features: [
      { name: 'Catálogo de Clientes', status: Status.COMPLETED },
      { name: 'Listas de Precios', status: Status.COMPLETED },
      { name: 'Cotizaciones', status: Status.COMPLETED },
      { name: 'Pedidos de Venta', status: Status.IN_PROGRESS },
      { name: 'Portal de Clientes', status: Status.PENDING }
    ]
  },
  {
    id: '11',
    name: 'Finanzas',
    description: 'Contabilidad, Tesorería, Bancos y Facturación.',
    status: Status.IN_PROGRESS,
    icon: 'Landmark',
    owner: 'Lupita Delgadillo',
    progress: 50,
    features: [
      { name: 'Facturación 4.0', status: Status.COMPLETED },
      { name: 'Cuentas por Cobrar', status: Status.IN_PROGRESS },
      { name: 'Cuentas por Pagar', status: Status.IN_PROGRESS },
      { name: 'Conciliación Bancaria', status: Status.PENDING },
      { name: 'Contabilidad Electrónica', status: Status.PENDING }
    ]
  },
  {
    id: '12',
    name: 'Sistemas',
    description: 'Administración de usuarios, perfiles y configuración del ERP.',
    status: Status.COMPLETED,
    icon: 'Settings',
    owner: 'Brisia Mendoza y Emilio Mendoza',
    progress: 90,
    features: [
      { name: 'Usuarios y Perfiles', status: Status.COMPLETED },
      { name: 'Configuración General', status: Status.COMPLETED },
      { name: 'Formatos de Impresión', status: Status.IN_PROGRESS },
      { name: 'Respaldos y Seguridad', status: Status.COMPLETED }
    ]
  },
  {
    id: '13',
    name: 'Logística',
    description: 'Gestión de embarques, rutas y flota vehicular.',
    status: Status.PENDING,
    icon: 'Clock',
    owner: 'Carolina Martínez',
    progress: 15,
    features: [
      { name: 'Planeación de Embarques', status: Status.IN_PROGRESS },
      { name: 'Generación de Remisiones', status: Status.PENDING },
      { name: 'Carta Porte', status: Status.PENDING },
      { name: 'Control de Gastos de Viaje', status: Status.PENDING }
    ]
  }
];

export const CUSTOM_DEVS: CustomDevelopment[] = [
  {
    id: '101',
    title: 'Conexión Báscula Camionera',
    description: 'Integración automática del peso bruto/tara al recibir materia prima.',
    requestedBy: Department.WAREHOUSE,
    status: Status.TESTING,
    deliveryDate: '2025-03-20'
  },
  {
    id: '102',
    title: 'Reporte de Mermas por Extrusión',
    description: 'Dashboard específico para calcular desperdicio en la línea 3.',
    requestedBy: Department.PRODUCTION,
    status: Status.IN_PROGRESS,
    deliveryDate: '2025-04-10'
  },
  {
    id: '103',
    title: 'Portal de Proveedores',
    description: 'Permitir a proveedores subir sus XMLs de facturas directamente.',
    requestedBy: Department.PURCHASING,
    status: Status.PENDING,
    deliveryDate: '2025-05-01'
  }
];

export const TIMELINE: TimelineEvent[] = [
  {
    id: 't0',
    phase: 'Fase 0: Arranque y Planeación',
    date: '06 Ene - 17 Ene',
    status: Status.COMPLETED,
    description: 'Definición de alcances, infraestructura TI y equipo de proyecto.',
    modulesIncluded: ['Sistemas', 'Infraestructura'],
    tasks: [
      { id: 't0-1', title: 'Kick-off del Proyecto', status: Status.COMPLETED, week: 'Semana 1' },
      { id: 't0-2', title: 'Habilitación de Servidores y Accesos', status: Status.COMPLETED, week: 'Semana 1' },
      { id: 't0-3', title: 'Instalación de Base de Datos', status: Status.COMPLETED, week: 'Semana 2' }
    ]
  },
  {
    id: 't1',
    phase: 'Fase 1: Abastecimiento',
    date: '20 Ene - 28 Feb',
    status: Status.COMPLETED,
    description: 'Gestión de cadena de suministro: Compras e Inventarios.',
    modulesIncluded: ['Compras', 'Almacén'],
    tasks: [
      { id: 't1-1', title: 'Carga de Proveedores y Artículos', status: Status.COMPLETED, week: 'Semana 3' },
      { id: 't1-2', title: 'Configuración de Requisiciones', status: Status.COMPLETED, week: 'Semana 4' },
      { id: 't1-3', title: 'Capacitación Almacenes', status: Status.COMPLETED, week: 'Semana 5' },
      { id: 't1-4', title: 'Pruebas Integrales Fase 1', status: Status.COMPLETED, week: 'Semana 8' }
    ]
  },
  {
    id: 't2',
    phase: 'Fase 2: Comercial y Logística',
    date: '03 Mar - 04 Abr',
    status: Status.IN_PROGRESS,
    description: 'Ventas, Facturación 4.0, Finanzas y distribución.',
    modulesIncluded: ['Ventas', 'Finanzas', 'Logística'],
    tasks: [
      { id: 't2-1', title: 'Listas de Precio y Clientes', status: Status.COMPLETED, week: 'Semana 9' },
      { id: 't2-2', title: 'Configuración de Facturación 4.0', status: Status.COMPLETED, week: 'Semana 10' },
      { id: 't2-3', title: 'Definición de Rutas Logísticas', status: Status.IN_PROGRESS, week: 'Semana 11' },
      { id: 't2-4', title: 'Capacitación Ventas y Cobranza', status: Status.PENDING, week: 'Semana 12' },
      { id: 't2-5', title: 'Pruebas Fase 2', status: Status.PENDING, week: 'Semana 13' }
    ]
  },
  {
    id: 't3',
    phase: 'Fase 3: Manufactura Core',
    date: '07 Abr - 23 May',
    status: Status.PENDING,
    description: 'Planeación, Producción, Calidad y Mantenimiento.',
    modulesIncluded: ['Producción', 'Planeación de la Producción', 'Calidad', 'Mantenimiento'],
    tasks: [
      { id: 't3-1', title: 'Ingeniería de Producto (BOMs)', status: Status.IN_PROGRESS, week: 'Semana 14' },
      { id: 't3-2', title: 'Plan Maestro (MPS)', status: Status.PENDING, week: 'Semana 16' },
      { id: 't3-3', title: 'Gestión de Activos (Mantenimiento)', status: Status.PENDING, week: 'Semana 18' },
      { id: 't3-4', title: 'Planes de Calidad', status: Status.PENDING, week: 'Semana 19' }
    ]
  },
  {
    id: 't4',
    phase: 'Fase 4: Gestión y Estrategia',
    date: '26 May - 27 Jun',
    status: Status.PENDING,
    description: 'Recursos Humanos, Seguridad y Planeación Estratégica.',
    modulesIncluded: ['Recursos Humanos', 'Seguridad', 'Planeación Estratégica'],
    tasks: [
      { id: 't4-1', title: 'Carga de Nómina y Empleados', status: Status.PENDING, week: 'Semana 21' },
      { id: 't4-2', title: 'Configuración de Seguridad', status: Status.PENDING, week: 'Semana 23' },
      { id: 't4-3', title: 'Tableros de Control (BI)', status: Status.PENDING, week: 'Semana 25' }
    ]
  },
  {
    id: 't5',
    phase: 'Cierre y Go-Live',
    date: '30 Jun - 25 Jul',
    status: Status.PENDING,
    description: 'Preparación final, saldos iniciales y arranque.',
    modulesIncluded: ['Sistemas', 'Todos'],
    tasks: [
      { id: 't5-1', title: 'Capacitación Final Usuarios', status: Status.PENDING, week: 'Semana 26' },
      { id: 't5-2', title: 'Carga de Saldos Iniciales', status: Status.PENDING, week: 'Semana 27' },
      { id: 't5-3', title: 'Go-Live (Arranque)', status: Status.PENDING, week: 'Semana 29' }
    ]
  }
];

export const PENDING_ACTIONS: ActionItem[] = [
  { id: 'a1', task: 'Validar flujos de cotización (Sprint 2)', assignedTo: Department.SALES, dueDate: '2025-03-20', isCritical: true, status: 'PENDING' },
  { id: 'a2', task: 'Carga de saldos iniciales de CxC', assignedTo: Department.FINANCE, dueDate: '2025-03-25', isCritical: true, status: 'PENDING' },
  { id: 'a3', task: 'Definir centros de trabajo para Prod', assignedTo: Department.PRODUCTION, dueDate: '2025-04-05', isCritical: false, status: 'PENDING' },
];

export const SUPPORT_TICKETS: Ticket[] = [
  {
    id: 'T-1001',
    title: 'Error al cargar layout de proveedor',
    description: 'Al intentar subir el archivo Excel de proveedores masivos, el sistema arroja error 500. El archivo tiene 50 filas y cumple con el formato solicitado en la documentación.',
    moduleId: '1',
    moduleName: 'Compras',
    priority: TicketPriority.HIGH,
    status: TicketStatus.IN_PROGRESS,
    createdAt: '2025-03-10',
    updatedAt: '2025-03-11',
    requester: 'Jessica Rocha',
    updates: [
      { id: 'u1', author: 'Soporte Técnico', date: '2025-03-10 14:30', message: 'Recibido. Estamos revisando los logs del servidor para identificar el error 500.', type: 'COMMENT' },
      { id: 'u2', author: 'Soporte Técnico', date: '2025-03-11 09:15', message: 'Se identificó que una columna con caracteres especiales está rompiendo el parser. Estamos aplicando un parche.', type: 'STATUS_CHANGE' }
    ]
  },
  {
    id: 'T-1002',
    title: 'Duda sobre Kardex',
    description: 'No me queda claro cómo filtrar el kardex por almacén secundario. Solo veo el almacén general en el dropdown.',
    moduleId: '2',
    moduleName: 'Almacén',
    priority: TicketPriority.LOW,
    status: TicketStatus.RESOLVED,
    createdAt: '2025-03-08',
    updatedAt: '2025-03-09',
    requester: 'Carolina Martínez',
    updates: [
      { id: 'u3', author: 'Consultor Funcional', date: '2025-03-09 10:00', message: 'Hola Carolina, el permiso para ver almacenes secundarios se configura en tu perfil de usuario. Ya te hemos habilitado el acceso.', type: 'COMMENT' },
      { id: 'u4', author: 'Carolina Martínez', date: '2025-03-09 11:30', message: 'Confirmado, ya puedo verlo. Gracias.', type: 'COMMENT' }
    ]
  }
];

export const FAQS: FaqItem[] = [
  {
    id: 'f1',
    category: 'Acceso y Seguridad',
    question: '¿Cómo restablezco mi contraseña del ERP?',
    answer: 'Para restablecer su contraseña, haga clic en "¿Olvidó su contraseña?" en la pantalla de inicio de sesión. Recibirá un correo electrónico con instrucciones. Si no tiene acceso a su correo corporativo, contacte al administrador del sistema.'
  },
  {
    id: 'f2',
    category: 'Módulo de Compras',
    question: '¿Por qué no puedo autorizar una Orden de Compra?',
    answer: 'Las autorizaciones dependen de su nivel de usuario y del monto de la orden. Si la orden excede su límite asignado, debe ser aprobada por su superior inmediato antes de procesarse.'
  },
  {
    id: 'f3',
    category: 'Facturación 4.0',
    question: '¿Qué hago si el RFC del cliente marca error al timbrar?',
    answer: 'Verifique que el RFC, el Nombre/Razón Social y el Código Postal coincidan exactamente con la Constancia de Situación Fiscal actualizada del cliente. El SAT valida estos tres campos estrictamente en la versión 4.0.'
  },
  {
    id: 'f4',
    category: 'Inventarios',
    question: '¿Cómo realizo un ajuste de inventario por merma?',
    answer: 'Debe ir al módulo de Almacén > Movimientos > Ajustes. Seleccione el concepto "Salida por Merma", indique el artículo, la cantidad y agregue una observación justificando el movimiento.'
  },
  {
    id: 'f5',
    category: 'General',
    question: '¿El sistema es compatible con tablets?',
    answer: 'Sí, el ERP es responsivo y funciona en tablets modernas (iPad, Android) a través del navegador web. Se recomienda usar Google Chrome para mejor compatibilidad.'
  }
];

export const TUTORIALS: TutorialItem[] = [
  { id: 't1', title: 'Introducción al Dashboard', duration: '5 min', type: 'VIDEO', thumbnailColor: 'bg-blue-500' },
  { id: 't2', title: 'Creación de Cotizaciones', duration: '12 min', type: 'VIDEO', thumbnailColor: 'bg-emerald-500' },
  { id: 't3', title: 'Guía de Carga de Proveedores (PDF)', duration: 'Lectura', type: 'DOC', thumbnailColor: 'bg-orange-500' },
  { id: 't4', title: 'Proceso de Facturación 4.0', duration: '15 min', type: 'VIDEO', thumbnailColor: 'bg-indigo-500' },
  { id: 't5', title: 'Manual de Usuario - Almacén', duration: 'Lectura', type: 'DOC', thumbnailColor: 'bg-slate-500' },
];