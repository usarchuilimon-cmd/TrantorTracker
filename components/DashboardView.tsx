
import React, { useState } from 'react';
import { Status, ActionItem, Tab, Module, TimelineEvent } from '../types';
import { StatusBadge } from './StatusBadge';
import { AlertTriangle, Clock, ChevronRight, CheckCircle2, LayoutGrid, Filter, CalendarDays, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { IconByName } from './Icons';

interface DashboardViewProps {
  modules: Module[];
  timeline: TimelineEvent[];
  actions: ActionItem[];
  onNavigate: (tab: Tab) => void;
}

export const DashboardView = ({ modules, timeline, actions, onNavigate }: DashboardViewProps) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'COMPLETED'>('ALL');

  // Data processing for charts
  const statusCounts = [
    { name: 'Completado', value: modules.filter(m => m.status === Status.COMPLETED).length, color: '#10B981' },
    { name: 'En Proceso', value: modules.filter(m => m.status === Status.IN_PROGRESS || m.status === Status.TESTING).length, color: '#3B82F6' },
    { name: 'Pendiente', value: modules.filter(m => m.status === Status.PENDING).length, color: '#9CA3AF' },
  ].filter(d => d.value > 0);

  const overallProgress = Math.round(modules.reduce((acc, curr) => acc + curr.progress, 0) / (modules.length || 1));
  const nextMilestone = timeline.find(t => t.status !== Status.COMPLETED);
  const futureMilestones = timeline.filter(t => t.status === Status.PENDING).slice(0, 3);
  
  // Derived state for pending items
  const pendingItems = actions.filter(a => a.status === 'PENDING');
  const criticalCount = pendingItems.filter(a => a.isCritical).length;

  // Filter Modules Logic
  const filteredModules = modules.filter(m => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'COMPLETED') return m.status === Status.COMPLETED;
    if (filterStatus === 'PENDING') return m.status === Status.PENDING;
    if (filterStatus === 'ACTIVE') return m.status === Status.IN_PROGRESS || m.status === Status.TESTING;
    return true;
  });

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Top Cards - KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Overall Progress */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors relative overflow-hidden">
          <div className="relative z-10">
             <h3 className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Avance Global</h3>
             <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{overallProgress}%</span>
                <span className="text-xs text-emerald-500 font-medium flex items-center">
                   <ArrowUpRight className="w-3 h-3 mr-0.5" /> Total
                </span>
             </div>
             <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 mt-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 rounded-full shadow-sm" style={{ width: `${overallProgress}%` }}></div>
             </div>
          </div>
          <div className="absolute right-0 top-0 p-4 opacity-5">
             <LayoutGrid className="w-24 h-24" />
          </div>
        </div>

        {/* Next Milestone */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
          <h3 className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Próximo Hito</h3>
          {nextMilestone ? (
            <div>
              <div className="flex items-start gap-3">
                 <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg shrink-0">
                    <Clock className="w-5 h-5 text-amber-500" />
                 </div>
                 <div>
                    <span className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{nextMilestone.phase}</span>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Fecha Meta: {nextMilestone.date}</p>
                 </div>
              </div>
              <div className="mt-3 text-xs text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-700/50 p-2 rounded border border-gray-100 dark:border-slate-600 line-clamp-1">
                 {nextMilestone.description}
              </div>
            </div>
          ) : (
            <div className="text-emerald-500 font-medium flex items-center gap-2">
               <CheckCircle2 className="w-5 h-5" /> Proyecto Finalizado
            </div>
          )}
        </div>

        {/* Pending Actions */}
        <div 
          onClick={() => onNavigate(Tab.ACTIONS)}
          className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors cursor-pointer group hover:border-blue-300 dark:hover:border-blue-600"
        >
          <div className="flex justify-between items-start mb-2">
             <h3 className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Acciones</h3>
             {criticalCount > 0 && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">CRÍTICAS</span>}
          </div>
          
          <div className="flex items-baseline gap-2">
             <span className="text-3xl font-bold text-gray-900 dark:text-white">{pendingItems.length}</span>
             <span className="text-sm text-gray-500 dark:text-slate-400">pendientes</span>
          </div>

          <div className="mt-3 flex -space-x-2 overflow-hidden">
             {pendingItems.slice(0, 4).map((_, i) => (
                <div key={i} className={`inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-800 flex items-center justify-center text-[10px] font-bold text-white
                   ${i === 0 && criticalCount > 0 ? 'bg-red-500' : 'bg-blue-400'}
                `}>
                   {i + 1}
                </div>
             ))}
             {pendingItems.length > 4 && (
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-800 bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-[10px] text-gray-600 dark:text-gray-300 font-medium">
                   +
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Module Grid - Improved Layout */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col h-[580px] transition-colors">
          {/* Header & Filters */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-t-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
               <LayoutGrid className="w-5 h-5 text-blue-500" /> 
               Módulos ERP
            </h3>
            
            <div className="flex p-1 bg-gray-200 dark:bg-slate-700 rounded-lg">
               {[
                 { id: 'ALL', label: 'Todos' },
                 { id: 'ACTIVE', label: 'En Proceso' },
                 { id: 'PENDING', label: 'Pendientes' },
                 { id: 'COMPLETED', label: 'Listos' },
               ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id as any)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                       filterStatus === tab.id 
                       ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm' 
                       : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
                    }`}
                  >
                     {tab.label}
                  </button>
               ))}
            </div>
          </div>

          {/* Scrollable Grid Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredModules.map((module) => (
                   <div 
                      key={module.id} 
                      className="group bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-4 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-600 transition-all cursor-default"
                   >
                      <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-105 transition-transform">
                               <IconByName name={module.icon} className="w-5 h-5" />
                            </div>
                            <div>
                               <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1" title={module.name}>{module.name}</h4>
                               <p className="text-xs text-gray-500 dark:text-slate-400">{module.owner}</p>
                            </div>
                         </div>
                         <div className="scale-90 origin-right">
                            <StatusBadge status={module.status} />
                         </div>
                      </div>
                      
                      <div className="space-y-1.5">
                         <div className="flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-slate-400 font-medium">Progreso</span>
                            <span className="text-gray-900 dark:text-white font-bold">{module.progress}%</span>
                         </div>
                         <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div 
                               className={`h-full rounded-full transition-all duration-500 ${module.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                               style={{ width: `${module.progress}%` }}
                            ></div>
                         </div>
                      </div>
                   </div>
                ))}
                {filteredModules.length === 0 && (
                   <div className="col-span-full py-12 text-center text-gray-400 dark:text-slate-500 flex flex-col items-center">
                      <Filter className="w-12 h-12 mb-2 opacity-20" />
                      <p>No se encontraron módulos con este filtro.</p>
                   </div>
                )}
             </div>
          </div>
        </div>

        {/* Right Column: Chart & Milestones */}
        <div className="lg:col-span-1 space-y-6">
           
           {/* Chart */}
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex flex-col h-[280px]">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Distribución de Estados</h3>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusCounts}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {statusCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{fontSize: '11px'}}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Upcoming Milestones List */}
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 h-[276px] flex flex-col">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                 <CalendarDays className="w-4 h-4 text-gray-500" /> Próximos Hitos
              </h3>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
                 {futureMilestones.length > 0 ? futureMilestones.map((t, i) => (
                    <div key={t.id} className="relative pl-4 border-l-2 border-gray-200 dark:border-slate-700">
                       <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-slate-600 border-2 border-white dark:border-slate-800"></div>
                       <h4 className="text-xs font-bold text-gray-800 dark:text-white">{t.phase}</h4>
                       <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5 mb-1">{t.date}</p>
                       <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-2 leading-relaxed bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">
                          {t.description}
                       </p>
                    </div>
                 )) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                       <CheckCircle2 className="w-8 h-8 mb-2 opacity-30" />
                       <p className="text-xs">No hay hitos pendientes próximos.</p>
                    </div>
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};
    