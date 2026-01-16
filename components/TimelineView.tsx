import React, { useState } from 'react';
import { Status, TimelineEvent } from '../types';
import { StatusBadge } from './StatusBadge';
import { Check, Clock, Circle, X, Calendar, Target, List, ArrowRight, LayoutList } from 'lucide-react';

interface TimelineViewProps {
  timeline: TimelineEvent[];
}

export const TimelineView = ({ timeline }: TimelineViewProps) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  // If selected event exists, refresh it from props (in case of edits)
  const currentEvent = selectedEvent ? timeline.find(t => t.id === selectedEvent.id) || selectedEvent : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ruta de Implementación (Sprints)</h2>
        <p className="text-gray-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
          Hemos organizado el proyecto en fases estratégicas. Haga clic en cada etapa para ver el <strong>detalle del alcance</strong> y entregables.
        </p>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700 md:left-1/2 md:-ml-0.5"></div>

        <div className="space-y-12">
          {timeline.map((event, index) => {
            const isCompleted = event.status === Status.COMPLETED;
            const isInProgress = event.status === Status.IN_PROGRESS;
            const isLeft = index % 2 === 0;

            return (
              <div key={event.id} className={`relative flex items-start md:items-center md:justify-between ${!isLeft ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Dot / Icon */}
                <div className={`absolute left-8 -translate-x-1/2 md:left-1/2 w-10 h-10 rounded-full border-4 flex items-center justify-center z-10 bg-white dark:bg-slate-800 shadow-sm mt-1 md:mt-0 transition-colors
                  ${isCompleted ? 'border-emerald-500 text-emerald-500' : 
                    isInProgress ? 'border-blue-500 text-blue-500' : 'border-gray-300 dark:border-slate-600 text-gray-300 dark:text-slate-600'}
                `}>
                  {isCompleted ? <Check className="w-5 h-5" /> : 
                   isInProgress ? <Clock className="w-5 h-5 animate-pulse" /> : 
                   <Circle className="w-4 h-4" />}
                </div>

                {/* Content Box - Clickable */}
                <div className={`ml-20 md:ml-0 md:w-[45%] ${!isLeft ? 'md:text-right' : ''}`}>
                  <div 
                    onClick={() => setSelectedEvent(event)}
                    className={`cursor-pointer group relative p-6 bg-white dark:bg-slate-800 rounded-xl border-t-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                    ${isCompleted ? 'border-t-emerald-500' : 
                      isInProgress ? 'border-t-blue-500' : 'border-t-gray-300 dark:border-t-slate-600'}
                  `}>
                    <div className={`flex flex-col ${!isLeft ? 'md:items-end' : ''}`}>
                      <div className="flex items-center gap-2 mb-2">
                         <span className={`inline-block px-2 py-1 text-xs font-bold tracking-wide uppercase rounded w-fit
                          ${isCompleted ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 
                            isInProgress ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400'}
                        `}>
                          Meta: {event.date}
                        </span>
                        {/* Hover hint */}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-500 font-medium flex items-center">
                          Ver detalle <ArrowRight className="w-3 h-3 ml-1" />
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                        {event.phase}
                      </h3>
                      
                      <p className="mt-2 text-sm text-gray-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {event.description}
                      </p>

                      {/* Modules Included Tags (Preview) */}
                      {event.modulesIncluded && (
                        <div className={`mt-4 flex flex-wrap gap-2 ${!isLeft ? 'md:justify-end' : ''}`}>
                          {event.modulesIncluded.slice(0, 3).map((mod, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                              {mod}
                            </span>
                          ))}
                          {event.modulesIncluded.length > 3 && (
                            <span className="text-xs text-slate-400 pt-1">+{event.modulesIncluded.length - 3} más</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Spacer for the other side in desktop */}
                <div className="hidden md:block md:w-[45%]"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SPRINT DETAIL MODAL (ZOOM) */}
      {currentEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedEvent(null)}
          ></div>
          
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className={`px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-start
               ${currentEvent.status === Status.COMPLETED ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 
                 currentEvent.status === Status.IN_PROGRESS ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-gray-50/50 dark:bg-slate-900/30'}
            `}>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Detalle del Sprint</span>
                  <StatusBadge status={currentEvent.status} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{currentEvent.phase}</h3>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Content Scrollable */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                       <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Fecha Meta / Entrega</p>
                       <p className="text-lg font-semibold text-gray-900 dark:text-white">{currentEvent.date}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                       <Target className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Objetivo Principal</p>
                       <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{currentEvent.description}</p>
                    </div>
                 </div>
              </div>

              {/* Scope Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <List className="w-5 h-5 text-gray-400" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Alcance & Entregables</h4>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                  {currentEvent.modulesIncluded && currentEvent.modulesIncluded.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentEvent.modulesIncluded.map((mod, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                          {currentEvent.status === Status.COMPLETED ? (
                            <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="shrink-0 w-5 h-5 rounded-full bg-gray-100 dark:bg-slate-700 border-2 border-gray-300 dark:border-slate-600"></div>
                          )}
                          <span className="text-sm font-medium text-gray-700 dark:text-slate-200">{mod}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">No hay módulos específicos listados para esta fase.</p>
                  )}
                </div>
              </div>

              {/* Tasks / Mini Schedule Section */}
              {currentEvent.tasks && currentEvent.tasks.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                   <div className="flex items-center gap-2 mb-4">
                      <LayoutList className="w-5 h-5 text-gray-400" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Plan de Actividades</h4>
                   </div>

                   <div className="relative pl-2 ml-2">
                      {/* Vertical line connecting tasks */}
                      <div className="absolute top-2 bottom-6 left-[11px] w-px bg-gray-200 dark:bg-slate-700"></div>

                      <div className="space-y-4">
                        {currentEvent.tasks.map((task, idx) => {
                          const isTaskCompleted = task.status === Status.COMPLETED;
                          const isTaskInProgress = task.status === Status.IN_PROGRESS;
                          
                          return (
                            <div key={task.id} className="relative flex items-start gap-4">
                               {/* Dot */}
                               <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 bg-white dark:bg-slate-800 
                                  ${isTaskCompleted ? 'border-emerald-500 text-emerald-500' : 
                                    isTaskInProgress ? 'border-blue-500 text-blue-500' : 'border-gray-300 dark:border-slate-600 text-gray-300 dark:text-slate-600'}
                               `}>
                                  {isTaskCompleted ? <Check className="w-3 h-3" /> : <div className={`w-1.5 h-1.5 rounded-full ${isTaskInProgress ? 'bg-blue-500' : 'bg-gray-300 dark:bg-slate-600'}`}></div>}
                               </div>

                               <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 p-3 shadow-sm hover:border-gray-300 dark:hover:border-slate-600 transition-colors">
                                  <div className="flex justify-between items-start mb-1">
                                     <h5 className={`text-sm font-semibold ${isTaskCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-slate-200'}`}>
                                       {task.title}
                                     </h5>
                                     {task.week && (
                                       <span className="text-xs text-gray-400 dark:text-slate-500 font-medium whitespace-nowrap ml-2 bg-gray-50 dark:bg-slate-900 px-2 py-0.5 rounded">
                                         {task.week}
                                       </span>
                                     )}
                                  </div>
                                  <div className="flex items-center">
                                    <StatusBadge status={task.status} />
                                  </div>
                               </div>
                            </div>
                          );
                        })}
                      </div>
                   </div>
                </div>
              )}

            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex justify-end">
               <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-colors"
                >
                  Entendido
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};