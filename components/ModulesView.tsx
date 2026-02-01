import React, { useState } from 'react';
import { Module, Status } from '../types';
import { IconByName } from './Icons';
import { StatusBadge } from './StatusBadge';
import { ArrowLeft, CheckCircle2, Circle, Clock, Info } from 'lucide-react';

interface ModulesViewProps {
  modules: Module[];
  activeModule: Module | null;
  onSelectModule: (module: Module | null) => void;
}

export const ModulesView = ({ modules, activeModule, onSelectModule }: ModulesViewProps) => {
  // Local state removed in favor of props


  // Detail View Component
  if (activeModule) {
    // Re-find module from props in case it updated while open
    const currentModule = modules.find(m => m.id === activeModule.id) || activeModule;

    return (
      <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={() => onSelectModule(null)}
          className="flex items-center space-x-2 text-sm text-gray-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al listado</span>
        </button>

        {/* Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 sm:p-6 md:p-8 transition-colors">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start space-x-4 sm:space-x-5">
              <div className="p-3 sm:p-4 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-xl shrink-0">
                <IconByName name={currentModule.icon} className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">{currentModule.name}</h2>
                  <div className="w-fit">
                    <StatusBadge status={currentModule.status} />
                  </div>
                </div>
                <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-lg max-w-2xl">{currentModule.description}</p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-6">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">Departamento</span>
                    <span className="text-gray-900 dark:text-white font-medium mt-1">{currentModule.owner}</span>
                  </div>
                  {currentModule.responsibles && (
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">Responsables</span>
                      <span className="text-gray-900 dark:text-white font-medium mt-1">{currentModule.responsibles}</span>
                    </div>
                  )}
                  <div className="hidden sm:block h-8 w-px bg-gray-200 dark:bg-slate-600"></div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">Funcionalidades</span>
                    <span className="text-gray-900 dark:text-white font-medium mt-1">{currentModule.features.length} Funcionalidades</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-750 rounded-xl p-4 sm:p-6 min-w-full md:min-w-[240px]">
              <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">Progreso General</span>
              <div className="flex items-end gap-2 mt-1 mb-3">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{currentModule.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${currentModule.progress === 100 ? 'bg-cyan-500' : 'bg-cyan-600 dark:bg-cyan-500'}`}
                  style={{ width: `${currentModule.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Breakdown */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Detalle de Funcionalidades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentModule.features.map((feature, idx) => {
              const isCompleted = feature.status === Status.COMPLETED;
              const isTesting = feature.status === Status.TESTING;

              return (
                <div key={idx} className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm flex items-start space-x-3 hover:border-cyan-200 dark:hover:border-cyan-600 transition-colors">
                  <div className={`mt-0.5 shrink-0 ${isCompleted ? 'text-emerald-500' :
                    isTesting ? 'text-amber-500' : 'text-gray-300 dark:text-slate-600'
                    }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
                      isTesting ? <Clock className="w-5 h-5" /> :
                        <Circle className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-slate-300'}`}>{feature.name}</h4>
                    <div className="mt-2">
                      <StatusBadge status={feature.status} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Módulos del ERP</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Seleccione un módulo para ver el detalle de sus funcionalidades.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {modules.map((module) => (
          <div
            key={module.id}
            onClick={() => onSelectModule(module)}
            className="group cursor-pointer bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 sm:p-6 hover:shadow-md hover:border-cyan-200 dark:hover:border-cyan-600 transition-all duration-200 relative overflow-hidden"
          >
            {/* Hover Indicator */}
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-600 dark:bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-cyan-50 dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 rounded-lg group-hover:bg-cyan-600 group-hover:text-white dark:group-hover:bg-cyan-500 transition-colors">
                <IconByName name={module.icon} className="w-6 h-6" />
              </div>
              <StatusBadge status={module.status} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{module.name}</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 h-10 line-clamp-2">{module.description}</p>

            <div className="border-t border-gray-100 dark:border-slate-700 pt-4 mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase">Responsable</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{module.owner}</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-slate-400">Progreso</span>
                  <span className="text-gray-900 dark:text-white font-medium">{module.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${module.progress === 100 ? 'bg-cyan-500' : 'bg-cyan-600 dark:bg-cyan-500'}`}
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 flex items-center text-cyan-600 dark:text-cyan-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                <Info className="w-3 h-3 mr-1" />
                Ver detalle funcional
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};