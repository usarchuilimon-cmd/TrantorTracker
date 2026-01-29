import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Department, ActionItem } from '../types';
import { Plus, Trash2, CheckCircle2, Filter, Calendar, ListTodo, AlertTriangle } from 'lucide-react';

interface ActionsViewProps {
   actions: ActionItem[];
   onToggle: (id: string) => void;
   onAdd: (action: ActionItem) => void;
   onDelete: (id: string) => void;
}

export const ActionsView = ({ actions, onToggle, onAdd, onDelete }: ActionsViewProps) => {
   const { isAdmin } = useAuth();
   const [filterCritical, setFilterCritical] = useState(false);
   const [newAction, setNewAction] = useState({
      task: '',
      assignedTo: Department.GENERAL,
      dueDate: '',
      isCritical: false
   });

   const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newAction.task || !newAction.dueDate) return;

      const item: ActionItem = {
         id: `new-${Date.now()}`,
         task: newAction.task,
         assignedTo: newAction.assignedTo as Department,
         dueDate: newAction.dueDate,
         isCritical: newAction.isCritical,
         status: 'PENDING'
      };

      onAdd(item);
      setNewAction({ task: '', assignedTo: Department.GENERAL, dueDate: '', isCritical: false });
   };

   const pendingItems = actions.filter(a => a.status === 'PENDING');

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 rounded-xl p-6 sm:p-8 text-white shadow-lg">
            <div className="flex items-start space-x-4">
               <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm shrink-0">
                  <ListTodo className="w-8 h-8 text-blue-50" />
               </div>
               <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Gestión de Acciones</h2>
                  <p className="text-sm sm:text-base text-blue-50 mt-2 max-w-2xl">
                     Centralice las tareas, asignaciones y pendientes de cada departamento para asegurar el avance del proyecto.
                  </p>
               </div>
            </div>
         </div>

         <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
            {/* Left Col: List */}
            <div className={`${isAdmin ? 'lg:col-span-2' : ''} bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col h-[600px]`}>
               {/* Toolbar */}
               <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/50">
                  <div className="flex gap-2">
                     <button
                        onClick={() => setFilterCritical(false)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${!filterCritical ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                     >
                        Todas
                     </button>
                     <button
                        onClick={() => setFilterCritical(true)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${filterCritical ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                     >
                        <Filter className="w-3 h-3" /> Críticas
                     </button>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                     {pendingItems.length} Pendientes
                  </span>
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                  {actions
                     .filter(a => filterCritical ? a.isCritical && a.status === 'PENDING' : true)
                     .sort((a, b) => (a.status === 'PENDING' ? -1 : 1))
                     .map(action => (
                        <div
                           key={action.id}
                           className={`p-4 rounded-xl border transition-all duration-200 group relative
                          ${action.status === 'COMPLETED'
                                 ? 'bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-800 opacity-60'
                                 : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700'
                              }
                       `}
                        >
                           <div className="flex items-start gap-4">
                              <button
                                 onClick={() => isAdmin && onToggle(action.id)}
                                 disabled={!isAdmin}
                                 title={isAdmin ? (action.status === 'COMPLETED' ? "Marcar como pendiente" : "Marcar como completada") : "Solo lectura"}
                                 className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
                                ${!isAdmin ? 'cursor-default opacity-80' : 'cursor-pointer'}
                                ${action.status === 'COMPLETED'
                                       ? 'bg-emerald-500 border-emerald-500 text-white'
                                       : 'border-gray-300 dark:border-slate-600 hover:border-blue-500 text-transparent'
                                    }
                             `}
                              >
                                 <CheckCircle2 className="w-4 h-4" />
                              </button>

                              <div className="flex-1 min-w-0">
                                 <p className={`text-base font-medium leading-snug ${action.status === 'COMPLETED' ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                                    {action.task}
                                 </p>
                                 <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <span className="text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2.5 py-1 rounded-md font-medium">
                                       {action.assignedTo}
                                    </span>
                                    <span className="flex items-center text-xs text-gray-500 dark:text-slate-400">
                                       <Calendar className="w-3.5 h-3.5 mr-1.5" /> {action.dueDate}
                                    </span>
                                    {action.isCritical && action.status !== 'COMPLETED' && (
                                       <span className="flex items-center text-xs text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md font-bold">
                                          <AlertTriangle className="w-3 h-3 mr-1" /> Prioridad Alta
                                       </span>
                                    )}
                                 </div>
                              </div>

                              {isAdmin && (
                                 <button
                                    onClick={() => onDelete(action.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all absolute top-2 right-2 sm:static sm:opacity-100 sm:bg-transparent"
                                    title="Eliminar"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              )}
                           </div>
                        </div>
                     ))}
                  {actions.length === 0 && (
                     <div className="text-center py-10 text-gray-400">
                        <p>No hay acciones registradas.</p>
                     </div>
                  )}
               </div>
            </div>

            {/* Right Col: Add Form (Admin Only) */}
            {isAdmin && (
               <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 sticky top-24">
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600" /> Nueva Acción
                     </h3>
                     <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                           <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Descripción</label>
                           <textarea
                              required
                              value={newAction.task}
                              onChange={e => setNewAction({ ...newAction, task: e.target.value })}
                              className="w-full p-3 text-sm rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white resize-none"
                              rows={4}
                              placeholder="Describa la tarea pendiente..."
                           />
                        </div>

                        <div>
                           <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Asignado A</label>
                           <select
                              value={newAction.assignedTo}
                              onChange={e => setNewAction({ ...newAction, assignedTo: e.target.value as Department })}
                              className="w-full p-3 text-sm rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                           >
                              {Object.values(Department).map(dept => (
                                 <option key={dept} value={dept}>{dept}</option>
                              ))}
                           </select>
                        </div>

                        <div>
                           <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Fecha Límite</label>
                           <input
                              type="date"
                              required
                              value={newAction.dueDate}
                              onChange={e => setNewAction({ ...newAction, dueDate: e.target.value })}
                              className="w-full p-3 text-sm rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                           />
                        </div>

                        <div className="flex items-center gap-3 pt-2 p-3 rounded-lg border border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
                           <input
                              type="checkbox"
                              id="isCritical"
                              checked={newAction.isCritical}
                              onChange={e => setNewAction({ ...newAction, isCritical: e.target.checked })}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600"
                           />
                           <label htmlFor="isCritical" className="text-sm text-gray-700 dark:text-slate-300 select-none font-medium">
                              Marcar como Crítica
                           </label>
                        </div>

                        <button
                           type="submit"
                           className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                           <Plus className="w-5 h-5" /> Registrar Tarea
                        </button>
                     </form>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};