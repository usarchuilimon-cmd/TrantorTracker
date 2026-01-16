import React from 'react';
import { Status } from '../types';

export const StatusBadge = ({ status }: { status: Status }) => {
  let colorClass = '';
  let label = '';

  switch (status) {
    case Status.COMPLETED:
      colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800';
      label = 'Completado';
      break;
    case Status.IN_PROGRESS:
      colorClass = 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800';
      label = 'En Proceso';
      break;
    case Status.TESTING:
      colorClass = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800';
      label = 'En Pruebas (UAT)';
      break;
    case Status.BLOCKED:
      colorClass = 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800';
      label = 'Bloqueado';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
      label = 'Pendiente';
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {label}
    </span>
  );
};