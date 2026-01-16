import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SUPPORT_TICKETS } from '../constants';
import { TicketPriority, TicketStatus, Ticket, Module, TicketUpdate } from '../types';
import { LifeBuoy, Plus, Search, Filter, AlertCircle, CheckCircle, Clock, Circle, X, Save, ChevronDown, ChevronUp, User, MessageSquare, Send, Trash2, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

interface TicketsViewProps {
  modules: Module[];
  tickets?: Ticket[]; // Optional for now to avoid breaking if not passed yet, but better required.
}

export const TicketsView = ({ modules, tickets: initialTickets }: TicketsViewProps) => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets || []);

  // Update local state when props change (sync)
  useEffect(() => {
    if (initialTickets) setTickets(initialTickets);
  }, [initialTickets]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(''); // State for module filter
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  // UI States for Error Handling & UX
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // New Comment State
  const [newComment, setNewComment] = useState('');

  // Delete Confirmation State
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  // Form State
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    moduleId: '',
    priority: TicketPriority.LOW
  });

  // Clear feedback after 5 seconds if it's a success message
  useEffect(() => {
    if (feedback?.type === 'success') {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.CRITICAL:
        return 'bg-red-600 text-white border-transparent shadow-sm dark:bg-red-600 dark:text-white';
      case TicketPriority.HIGH:
        return 'bg-orange-500 text-white border-transparent shadow-sm dark:bg-orange-600 dark:text-white';
      case TicketPriority.MEDIUM:
        return 'bg-blue-600 text-white border-transparent shadow-sm dark:bg-blue-600 dark:text-white';
      case TicketPriority.LOW:
      default:
        return 'bg-gray-500 text-white border-transparent shadow-sm dark:bg-slate-600 dark:text-white';
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN: return <AlertCircle className="w-4 h-4 text-emerald-500" />;
      case TicketStatus.IN_PROGRESS: return <Clock className="w-4 h-4 text-blue-500" />;
      case TicketStatus.RESOLVED: return <CheckCircle className="w-4 h-4 text-gray-500" />;
      case TicketStatus.CLOSED: return <CheckCircle className="w-4 h-4 text-gray-400" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const toggleTicket = (id: string) => {
    if (expandedTicketId === id) {
      setExpandedTicketId(null);
    } else {
      setExpandedTicketId(id);
    }
    setNewComment(''); // Clear input when switching tickets
    setFeedback(null); // Clear global feedback
  };

  // Helper to simulate network delay
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    try {
      // 1. Validation
      if (!newTicket.title.trim()) throw new Error("El título es obligatorio.");
      if (newTicket.title.length < 5) throw new Error("El título debe tener al menos 5 caracteres.");
      if (!newTicket.moduleId) throw new Error("Debe seleccionar un módulo relacionado.");
      if (!newTicket.description.trim()) throw new Error("La descripción es obligatoria.");

      // 2. Create in Supabase (No waiting)
      const selectedModule = modules.find(m => m.id === newTicket.moduleId);
      const ticketId = `T-${Date.now()}`;

      const { error } = await supabase
        .from('tracker_tickets')
        .insert({
          id: ticketId,
          title: newTicket.title,
          description: newTicket.description,
          module_id: newTicket.moduleId,
          module_name: selectedModule ? selectedModule.name : 'General',
          priority: newTicket.priority,
          status: TicketStatus.OPEN,
          requester: 'Admin (Usuario Actual)', // Hardcoded user
        });

      if (error) throw error;

      // Optimistic update
      const ticket: Ticket = {
        id: ticketId,
        title: newTicket.title,
        description: newTicket.description,
        moduleId: newTicket.moduleId,
        moduleName: selectedModule ? selectedModule.name : 'General',
        priority: newTicket.priority,
        status: TicketStatus.OPEN,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        requester: 'Admin (Usuario Actual)',
        updates: []
      };

      setTickets([ticket, ...tickets]);
      setFeedback({ type: 'success', message: `Ticket ${ticket.id} creado exitosamente.` });
      setIsModalOpen(false);

      // Reset form
      setNewTicket({
        title: '',
        description: '',
        moduleId: '',
        priority: TicketPriority.LOW
      });


    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message || "Error al crear el ticket." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    if (isLoading) return;
    setIsLoading(true);
    setFeedback(null);

    try {
      await wait(600); // Simulate API

      // Create log entry for the status change
      const update: TicketUpdate = {
        id: `u-${Date.now()}`,
        author: 'Admin (Usuario Actual)',
        date: new Date().toLocaleString('es-MX', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        message: `El estado del ticket ha cambiado a: ${newStatus}`,
        type: 'STATUS_CHANGE'
      };

      setTickets(tickets.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: newStatus,
            updatedAt: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            updates: [...(t.updates || []), update]
          };
        }
        return t;
      }));

      setFeedback({ type: 'success', message: 'Estado actualizado correctamente.' });

    } catch (error: any) {
      setFeedback({ type: 'error', message: "No se pudo actualizar el estado. Intente nuevamente." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (ticketId: string) => {
    if (!newComment.trim()) return;
    setIsLoading(true);
    setFeedback(null);

    try {
      // Validation
      if (newComment.length > 500) throw new Error("El comentario es demasiado largo (máx 500 caracteres).");

      const { error } = await supabase
        .from('tracker_ticket_updates')
        .insert({
          ticket_id: ticketId,
          author: 'Admin (Usuario Actual)',
          message: newComment,
          type: 'COMMENT'
        });

      if (error) throw error;

      const update: TicketUpdate = {
        id: `u-${Date.now()}`,
        author: 'Admin (Usuario Actual)',
        date: new Date().toLocaleString('es-MX'),
        message: newComment,
        type: 'COMMENT'
      };

      setTickets(tickets.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            updates: [...(t.updates || []), update],
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      }));
      setNewComment('');

    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (ticketToDelete) {
      setIsLoading(true);
      try {
        const { error } = await supabase.from('tracker_tickets').delete().eq('id', ticketToDelete);
        if (error) throw error;

        setTickets(tickets.filter(t => t.id !== ticketToDelete));
        if (expandedTicketId === ticketToDelete) {
          setExpandedTicketId(null);
        }
        setFeedback({ type: 'success', message: "Ticket eliminado correctamente." });
        setTicketToDelete(null);

      } catch (error) {
        setFeedback({ type: 'error', message: "No se pudo eliminar el ticket. Intente nuevamente." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Filter Logic: Search Term + Selected Module
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.moduleName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule = selectedModuleId ? ticket.moduleId === selectedModuleId : true;

    return matchesSearch && matchesModule;
  });

  const ticketBeingDeleted = tickets.find(t => t.id === ticketToDelete);

  return (
    <div className="space-y-4 md:space-y-6 relative">
      {/* Global Feedback Alert */}
      {feedback && !isModalOpen && (
        <div className={`rounded-lg p-4 mb-4 flex items-center justify-between shadow-sm animate-in slide-in-from-top-2 fade-in
          ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800' : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800'}
        `}>
          <div className="flex items-center gap-3">
            {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <p className="text-sm font-medium">{feedback.message}</p>
          </div>
          <button onClick={() => setFeedback(null)} className="opacity-70 hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Stats */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-900 dark:to-teal-900 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm shrink-0">
              <LifeBuoy className="w-8 h-8 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Mesa de Ayuda</h2>
              <p className="text-sm sm:text-base text-emerald-100 mt-2 max-w-2xl">
                Gestione sus solicitudes de soporte técnico. Reporte incidencias sobre los módulos ya liberados.
              </p>
            </div>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm flex-1 lg:min-w-[100px]">
              <div className="text-2xl font-bold">{tickets.filter(t => t.status === TicketStatus.OPEN).length}</div>
              <div className="text-xs text-emerald-100 opacity-80">Abiertos</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm flex-1 lg:min-w-[100px]">
              <div className="text-2xl font-bold">{tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length}</div>
              <div className="text-xs text-emerald-100 opacity-80">En Proceso</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">

          {/* Module Filter Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-slate-400 pointer-events-none" />
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none cursor-pointer transition-colors"
            >
              <option value="">Todos los Módulos</option>
              {modules.map(mod => (
                <option key={mod.id} value={mod.id}>{mod.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={() => { setIsModalOpen(true); setFeedback(null); }}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-colors flex-1 sm:flex-initial whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Ticket</span>
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider w-8"></th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider min-w-[250px]">ID & Asunto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Módulo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Solicitante</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Prioridad</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Estado</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider w-20">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredTickets.map((ticket) => {
                const isExpanded = expandedTicketId === ticket.id;
                return (
                  <React.Fragment key={ticket.id}>
                    <tr
                      onClick={() => toggleTicket(ticket.id)}
                      className={`cursor-pointer group transition-colors ${isExpanded ? 'bg-gray-50 dark:bg-slate-750' : 'hover:bg-gray-50 dark:hover:bg-slate-750'}`}
                    >
                      <td className="px-6 py-4">
                        {isExpanded ?
                          <ChevronUp className="w-4 h-4 text-gray-400" /> :
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        }
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-500 dark:text-slate-500">{ticket.id}</span>
                            <span className={`text-sm font-semibold transition-colors ${isExpanded ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`}>
                              {ticket.title}
                            </span>
                          </div>
                          {!isExpanded && <span className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-1">{ticket.description}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-300">
                        {ticket.moduleName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900 dark:text-white">{ticket.requester.split('(')[0]}</span>
                          <span className="text-xs text-gray-500 dark:text-slate-500">{ticket.createdAt}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                          {getStatusIcon(ticket.status)}
                          <span>{ticket.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTicketToDelete(ticket.id);
                            setFeedback(null);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Eliminar ticket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <tr className="bg-gray-50 dark:bg-slate-900/40">
                        <td colSpan={7} className="px-6 py-6 border-b border-gray-200 dark:border-slate-700 shadow-inner">
                          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex flex-col lg:flex-row gap-8">

                              {/* Left: Description & Details */}
                              <div className="flex-1 space-y-6">

                                {/* Status Management Card (New) */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800 flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2">
                                    <RefreshCw className={`w-5 h-5 text-blue-600 dark:text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
                                    <div>
                                      <p className="text-sm font-bold text-blue-900 dark:text-blue-300">Gestionar Estado</p>
                                      <p className="text-xs text-blue-700 dark:text-blue-400">Actualizar el progreso del ticket</p>
                                    </div>
                                  </div>
                                  <select
                                    value={ticket.status}
                                    onChange={(e) => handleStatusChange(ticket.id, e.target.value as TicketStatus)}
                                    disabled={isLoading}
                                    className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[160px] cursor-pointer disabled:opacity-50"
                                  >
                                    {Object.values(TicketStatus).map(status => (
                                      <option key={status} value={status}>{status}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-gray-400" />
                                    Descripción Detallada
                                  </h4>
                                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-sm text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 leading-relaxed shadow-sm">
                                    {ticket.description}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                                    <span className="text-xs text-gray-500 dark:text-slate-500 uppercase font-semibold">Solicitante Completo</span>
                                    <p className="mt-1 text-gray-900 dark:text-white flex items-center gap-2">
                                      <User className="w-3 h-3 text-gray-400" /> {ticket.requester}
                                    </p>
                                  </div>
                                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                                    <span className="text-xs text-gray-500 dark:text-slate-500 uppercase font-semibold">Última Actualización</span>
                                    <p className="mt-1 text-gray-900 dark:text-white flex items-center gap-2">
                                      <Clock className="w-3 h-3 text-gray-400" /> {ticket.updatedAt}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Right: History/Updates */}
                              <div className="flex-1 lg:max-w-md">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Historial de Actividad</h4>

                                <div className="space-y-4 relative">
                                  {/* Timeline Line */}
                                  <div className="absolute top-2 bottom-8 left-[11px] w-px bg-gray-200 dark:bg-slate-700"></div>

                                  {ticket.updates && ticket.updates.length > 0 ? (
                                    ticket.updates.map((update) => (
                                      <div key={update.id} className="relative flex gap-3">
                                        <div className={`relative z-10 shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 
                                            ${update.type === 'STATUS_CHANGE' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                          <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                        </div>
                                        <div className="flex-1">
                                          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm text-sm">
                                            <div className="flex justify-between items-start mb-1">
                                              <span className="font-semibold text-gray-900 dark:text-white">{update.author}</span>
                                              <span className="text-xs text-gray-500 dark:text-slate-500">{update.date}</span>
                                            </div>
                                            <p className="text-gray-600 dark:text-slate-300">{update.message}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center py-6 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-gray-200 dark:border-slate-700">
                                      <p className="text-sm text-gray-500 dark:text-slate-400">No hay actualizaciones recientes.</p>
                                    </div>
                                  )}

                                  {/* Reply Input */}
                                  <div className="relative flex gap-3 pt-2">
                                    <div className="relative z-10 shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center border-2 border-white dark:border-slate-800">
                                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                    </div>
                                    <div className="flex-1 flex gap-2">
                                      <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(ticket.id)}
                                        placeholder="Añadir un comentario o respuesta..."
                                        disabled={isLoading}
                                        className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white transition-colors disabled:opacity-50"
                                      />
                                      <button
                                        onClick={() => handleAddComment(ticket.id)}
                                        disabled={!newComment.trim() || isLoading}
                                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center w-10"
                                      >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredTickets.length === 0 && (
          <div className="p-12 text-center">
            <LifeBuoy className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No se encontraron tickets</h3>
            <p className="text-gray-500 dark:text-slate-400 mt-1">Intente ajustar su búsqueda o cree un nuevo ticket.</p>
          </div>
        )}
      </div>

      {/* CREATE TICKET MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isLoading && setIsModalOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Nuevo Ticket de Soporte</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">

              {/* Modal Inline Error */}
              {feedback && feedback.type === 'error' && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200 flex items-start gap-2 animate-pulse">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{feedback.message}</p>
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Asunto / Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors disabled:opacity-60"
                  placeholder="Ej: Error al generar reporte de ventas"
                />
              </div>

              <div>
                <label htmlFor="module" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Módulo Relacionado <span className="text-red-500">*</span>
                </label>
                <select
                  id="module"
                  value={newTicket.moduleId}
                  onChange={(e) => setNewTicket({ ...newTicket, moduleId: e.target.value })}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors disabled:opacity-60"
                >
                  <option value="">Seleccione un módulo</option>
                  {modules.map(mod => (
                    <option key={mod.id} value={mod.id}>{mod.name}</option>
                  ))}
                  <option value="other">Otro / General</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Prioridad
                </label>
                <select
                  id="priority"
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as TicketPriority })}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors disabled:opacity-60"
                >
                  {Object.values(TicketPriority).map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Descripción Detallada <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors resize-none disabled:opacity-60"
                  placeholder="Describa el problema, los pasos para reproducirlo o su duda específica..."
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-md transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px] justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {ticketToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isLoading && setTicketToDelete(null)}
          ></div>

          <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">¿Eliminar Ticket?</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                Esta acción no se puede deshacer. ¿Está seguro de que desea eliminar el ticket <span className="font-medium text-gray-900 dark:text-white">{ticketBeingDeleted?.id}</span>?
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setTicketToDelete(null)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteTicket}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};