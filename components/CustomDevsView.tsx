import React from 'react';
import { CustomDevelopment } from '../types';
import { StatusBadge } from './StatusBadge';
import { Code2, Calendar } from 'lucide-react';

interface CustomDevsViewProps {
  customDevs: CustomDevelopment[];
}

export const CustomDevsView = ({ customDevs }: CustomDevsViewProps) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-950 dark:to-slate-900 rounded-xl p-6 sm:p-8 text-white">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm shrink-0">
            <Code2 className="w-8 h-8 text-blue-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Desarrollos a Medida</h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
              Aquí puede dar seguimiento a las funcionalidades específicas solicitadas fuera del estándar del ERP.
              Estos desarrollos siguen un ciclo de vida independiente.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider min-w-[200px]">
                  Desarrollo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Solicitado Por
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Fecha Entrega Est.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {customDevs.map((dev) => (
                <tr key={dev.id} className="hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{dev.title}</span>
                      <span className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">{dev.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200">
                      {dev.requestedBy}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                      <span>{dev.deliveryDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={dev.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {customDevs.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-slate-400">
            No hay desarrollos a medida activos actualmente.
          </div>
        )}
      </div>
    </div>
  );
};