import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Organization, ProjectStage, HealthStatus } from '../types';
import { Building, Calendar, AlertTriangle, CheckCircle, Clock, ArrowRight, Activity, Search } from 'lucide-react';

interface PortfolioDashboardProps {
    onSelectOrg: (org: Organization) => void;
}

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({ onSelectOrg }) => {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    const STAGE_LABELS: Record<ProjectStage, string> = {
        [ProjectStage.PRE_KICKOFF]: '📋 Pre-Lanzamiento',
        [ProjectStage.IMPLEMENTATION]: '🚀 Implementación',
        [ProjectStage.UAT]: '🧪 Pruebas (UAT)',
        [ProjectStage.GO_LIVE]: '🌟 En Vivo (Go-Live)',
        [ProjectStage.SUPPORT]: '🛡️ Soporte',
        [ProjectStage.CHURNED]: '🚫 Cancelado'
    };

    const HEALTH_LABELS: Record<HealthStatus, string> = {
        [HealthStatus.ON_TRACK]: '✅ A Tiempo',
        [HealthStatus.AT_RISK]: '⚠️ En Riesgo',
        [HealthStatus.DELAYED]: '⏰ Retrasado',
        [HealthStatus.CRITICAL]: '🔥 Crítico'
    };

    useEffect(() => {
        fetchOrgs();
    }, []);

    const fetchOrgs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('tracker_organizations')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching orgs:', error);
        } else {
            setOrgs(data || []);
        }
        setLoading(false);
    };

    const updateOrgStatus = async (id: string, field: 'project_stage' | 'health_status', value: string) => {
        const { error } = await supabase
            .from('tracker_organizations')
            .update({ [field]: value })
            .eq('id', id);

        if (!error) {
            setOrgs(orgs.map(o => o.id === id ? { ...o, [field]: value } : o));
        }
    };

    const getHealthColor = (status?: HealthStatus) => {
        switch (status) {
            case HealthStatus.ON_TRACK: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case HealthStatus.AT_RISK: return 'bg-amber-100 text-amber-800 border-amber-200';
            case HealthStatus.DELAYED: return 'bg-orange-100 text-orange-800 border-orange-200';
            case HealthStatus.CRITICAL: return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStageColor = (stage?: ProjectStage) => {
        switch (stage) {
            case ProjectStage.PRE_KICKOFF: return 'text-purple-600 bg-purple-50';
            case ProjectStage.IMPLEMENTATION: return 'text-blue-600 bg-blue-50';
            case ProjectStage.UAT: return 'text-indigo-600 bg-indigo-50';
            case ProjectStage.GO_LIVE: return 'text-emerald-600 bg-emerald-50';
            case ProjectStage.SUPPORT: return 'text-cyan-600 bg-cyan-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const filteredOrgs = orgs.filter(o =>
        o.name.toLowerCase().includes(filter.toLowerCase())
    );

    // KPIs
    const totalProjects = orgs.length;
    const atRisk = orgs.filter(o => o.health_status === HealthStatus.AT_RISK || o.health_status === HealthStatus.CRITICAL).length;
    const live = orgs.filter(o => o.project_stage === ProjectStage.SUPPORT || o.project_stage === ProjectStage.GO_LIVE).length;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header & KPIs */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portafolio de Proyectos</h1>
                    <p className="text-gray-500 dark:text-gray-400">Visión general del estado y salud de la flota de clientes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                            <Building className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Proyectos Activos</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{totalProjects}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">En Riesgo / Críticos</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{atRisk}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">En Soporte / Go-Live</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{live}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="flex justify-between items-center">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar proyecto..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Projects Grid */}
            {loading ? (
                <div className="text-center py-20 text-gray-500">Cargando portafolio...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrgs.map(org => (
                        <div key={org.id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black text-white flex items-center justify-center font-bold text-xl shadow-lg">
                                        {org.name.charAt(0).toUpperCase()}
                                    </div>


                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getHealthColor(org.health_status)}`}>
                                        {HEALTH_LABELS[org.health_status as HealthStatus] || 'A Tiempo'}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate" title={org.name}>{org.name}</h3>
                                <p className="text-xs text-gray-400 mb-4 font-mono truncate">ID: {org.id}</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Etapa Actual</label>
                                        <select
                                            value={org.project_stage || ProjectStage.IMPLEMENTATION}
                                            onChange={(e) => updateOrgStatus(org.id, 'project_stage', e.target.value)}
                                            className={`w-full p-2 rounded-lg text-sm font-medium border-0 cursor-pointer transition-colors ${getStageColor(org.project_stage)}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {Object.values(ProjectStage).map(stage => (
                                                <option key={stage} value={stage}>{STAGE_LABELS[stage]}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Salud</label>
                                            <select
                                                value={org.health_status || HealthStatus.ON_TRACK}
                                                onChange={(e) => updateOrgStatus(org.id, 'health_status', e.target.value)}
                                                className="w-full h-10 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {Object.values(HealthStatus).map(s => (
                                                    <option key={s} value={s}>{HEALTH_LABELS[s]}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Go Live</label>
                                            <div className="w-full h-10 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 px-3 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span>{org.target_go_live ? new Date(org.target_go_live).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => onSelectOrg(org)}
                                className="p-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors"
                            >
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Entrar al Proyecto</span>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
