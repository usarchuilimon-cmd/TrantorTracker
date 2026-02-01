import React from 'react';
import { TimelineEvent, ActionItem, Ticket, TicketStatus } from '../types';
import { CheckCircle, Clock, MessageSquare } from 'lucide-react';

interface ClientPortalViewProps {
    timeline: TimelineEvent[];
    actions: ActionItem[];
    tickets: Ticket[];
    onNavigate: (tab: any) => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({ timeline, actions, tickets, onNavigate }) => {
    // Filter active items
    const pendingActions = actions.filter(a => a.status === 'PENDING');
    const upcomingEvents = timeline.filter(e => new Date(e.date) >= new Date()).slice(0, 3);
    const activeTickets = tickets.filter(t => t.status !== TicketStatus.CLOSED && t.status !== TicketStatus.RESOLVED).slice(0, 3);

    return (
        <div className="space-y-8 max-w-6xl mx-auto">

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[var(--primary-color)] to-cyan-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Bienvenido a tu Portal de Proyecto</h1>
                    <p className="text-blue-100 max-w-2xl text-lg">Aquí podrás ver el progreso de tu implementación en tiempo real, gestionar tareas pendientes y solicitar soporte.</p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-12"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Next Steps / Timeline */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            Próximos Hitos
                        </h2>
                        <button onClick={() => onNavigate('TIMELINE')} className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">Ver todo</button>
                    </div>

                    <div className="space-y-6 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-slate-700"></div>

                        {upcomingEvents.length > 0 ? upcomingEvents.map((event, idx) => (
                            <div key={event.id} className="relative pl-10">
                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 flex items-center justify-center text-xs font-bold z-10 border-2 border-white dark:border-slate-800">
                                    {idx + 1}
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{event.phase}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{event.description}</p>
                                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                    {new Date(event.date).toLocaleDateString()}
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 italic pl-10">No hay eventos próximos programados.</p>
                        )}
                    </div>
                </div>

                {/* Pending Actions */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            Tareas Pendientes
                        </h2>
                        <button onClick={() => onNavigate('ACTIONS')} className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">Ver todas</button>
                    </div>

                    <div className="space-y-3">
                        {pendingActions.length > 0 ? pendingActions.slice(0, 5).map(action => (
                            <div key={action.id} className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 flex items-start gap-3">
                                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${action.isCritical ? 'bg-red-500' : 'bg-blue-500'
                                    }`} />
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{action.task}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{action.assignedTo}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <p className="text-gray-900 font-medium">¡Todo al día!</p>
                                <p className="text-sm text-gray-500">No tienes tareas pendientes por ahora.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Support & Help */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                        <MessageSquare className="w-5 h-5 text-purple-500" />
                        Soporte Reciente
                    </h2>

                    <div className="flex-1 space-y-4">
                        {activeTickets.length > 0 ? activeTickets.map(ticket => (
                            <div key={ticket.id} onClick={() => onNavigate('TICKETS')} className="cursor-pointer group hover:bg-gray-50 dark:hover:bg-slate-900 p-3 -mx-3 rounded-lg transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-mono text-gray-400">#{ticket.id.slice(0, 6)}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${ticket.status === TicketStatus.OPEN ? 'bg-blue-100 text-blue-700' :
                                        ticket.status === TicketStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-700' :
                                            'bg-purple-100 text-purple-700'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-cyan-600 transition-colors text-sm">{ticket.title}</h4>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-500 italic">No tienes tickets de soporte activos.</p>
                        )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 grid grid-cols-2 gap-3">
                        <button onClick={() => onNavigate('TICKETS')} className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-center">
                            Crear Ticket
                        </button>
                        <button onClick={() => onNavigate('FAQ')} className="p-3 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-center">
                            Ver Tutoriales
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
