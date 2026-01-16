
import { Database } from './database.types';
import { Module, CustomDevelopment, TimelineEvent, ActionItem, Ticket, FaqItem, TutorialItem, User, Status, Department, TicketPriority, TicketStatus, SubModule, SprintTask } from '../types';

type DBModule = Database['public']['Tables']['tracker_modules']['Row'] & {
    tracker_module_features: Database['public']['Tables']['tracker_module_features']['Row'][];
};

type DBTimeline = Database['public']['Tables']['tracker_timeline_events']['Row'] & {
    tracker_timeline_tasks: Database['public']['Tables']['tracker_timeline_tasks']['Row'][];
};

type DBTicket = Database['public']['Tables']['tracker_tickets']['Row'] & {
    tracker_ticket_updates: Database['public']['Tables']['tracker_ticket_updates']['Row'][];
};

export const mapModule = (row: DBModule): Module => ({
    id: row.id,
    name: row.name,
    description: row.description || '',
    status: row.status as Status,
    icon: row.icon || 'Package',
    owner: row.owner || '',
    progress: row.progress || 0,
    features: (row.tracker_module_features || []).map((f) => ({
        name: f.name,
        status: f.status as Status,
    })),
});

export const mapCustomDev = (row: Database['public']['Tables']['tracker_custom_developments']['Row']): CustomDevelopment => ({
    id: row.id,
    title: row.title,
    description: row.description || '',
    requestedBy: row.requested_by as Department, // Cast assuming DB string matches enum
    status: row.status as Status,
    deliveryDate: row.delivery_date || '',
});

export const mapTimelineEvent = (row: DBTimeline): TimelineEvent => ({
    id: row.id,
    phase: row.phase,
    date: row.date_range || '',
    status: row.status as Status,
    description: row.description || '',
    modulesIncluded: row.modules_included || [],
    tasks: (row.tracker_timeline_tasks || []).map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status as Status,
        week: t.week || undefined,
    })),
});

export const mapActionItem = (row: Database['public']['Tables']['tracker_action_items']['Row']): ActionItem => ({
    id: row.id,
    task: row.task,
    assignedTo: row.assigned_to as Department,
    dueDate: row.due_date || '',
    isCritical: row.is_critical || false,
    status: (row.status as 'PENDING' | 'COMPLETED') || 'PENDING',
});

export const mapTicket = (row: DBTicket): Ticket => ({
    id: row.id,
    title: row.title,
    description: row.description || '',
    moduleId: row.module_id || '',
    moduleName: row.module_name || '',
    priority: row.priority as TicketPriority,
    status: row.status as TicketStatus,
    createdAt: row.created_at || '',
    updatedAt: row.updated_at || '',
    requester: row.requester,
    updates: (row.tracker_ticket_updates || []).map(u => ({
        id: u.id,
        author: u.author,
        date: u.date || '',
        message: u.message,
        type: u.type as 'COMMENT' | 'STATUS_CHANGE'
    }))
});

export const mapFaq = (row: Database['public']['Tables']['tracker_faqs']['Row']): FaqItem => ({
    id: row.id,
    category: row.category,
    question: row.question,
    answer: row.answer,
});

export const mapTutorial = (row: Database['public']['Tables']['tracker_tutorials']['Row']): TutorialItem => ({
    id: row.id,
    title: row.title,
    duration: row.duration || '',
    type: (row.type as 'VIDEO' | 'DOC') || 'DOC',
    thumbnailColor: row.thumbnail_color || 'bg-gray-500',
});

export const mapUser = (row: Database['public']['Tables']['tracker_users']['Row']): User => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as 'ADMIN' | 'USER',
    department: row.department as Department,
    avatar: row.avatar || undefined
});
