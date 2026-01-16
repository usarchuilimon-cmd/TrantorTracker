import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Module, TimelineEvent, User, Department, Status, SubModule, FaqItem, TutorialItem } from '../types';
import { Settings, Users, Grid, CalendarDays, Plus, Trash2, Edit2, Save, X, Building, Calendar, CheckCircle, AlertTriangle, BookOpen, HelpCircle, PlayCircle, FileText } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { IconByName } from './Icons';

// ... (keep types and initial interfaces if not changing)

interface BackOfficeViewProps {
  companyName: string;
  setCompanyName: (name: string) => void;
  modules: Module[];
  setModules: (modules: Module[]) => void;
  timeline: TimelineEvent[];
  setTimeline: (timeline: TimelineEvent[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  faqs: FaqItem[];
  setFaqs: (faqs: FaqItem[]) => void;
  tutorials: TutorialItem[];
  setTutorials: (tutorials: TutorialItem[]) => void;
}

type AdminTab = 'CONFIG' | 'MODULES' | 'TIMELINE' | 'USERS' | 'RESOURCES';

// --- Sub-Component: Global Config ---
const ConfigSection = ({ companyName, setCompanyName }: { companyName: string, setCompanyName: (name: string) => void }) => (
  <div className="max-w-2xl bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700">
    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
      <Building className="w-5 h-5" /> Datos del Proyecto
    </h3>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Nombre del Cliente / Empresa</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300 flex gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <p>Estos cambios se reflejarán inmediatamente en toda la aplicación para todos los usuarios.</p>
      </div>
    </div>
  </div>
);

// --- Sub-Component: Modules Manager ---
const ModulesManager = ({ modules, setModules }: { modules: Module[], setModules: (m: Module[]) => void }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Module | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (mod: Module) => {
    setEditingId(mod.id);
    setEditForm({ ...mod }); // Clone
  };

  const handleSave = async () => {
    if (!editForm) return;
    setIsSaving(true);
    try {
      let moduleId = editingId === 'NEW' ? crypto.randomUUID() : editingId;

      // 1. Upsert Module
      const { error: modError } = await supabase
        .from('tracker_modules')
        .upsert({
          id: moduleId,
          name: editForm.name,
          description: editForm.description,
          status: editForm.status,
          icon: editForm.icon,
          owner: editForm.owner,
          progress: editForm.progress
        });

      if (modError) throw modError;

      // 2. Handle Features (Delete all for this module and re-insert)
      // Note: Ideally transactions, but for now simple 2-step
      if (moduleId) {
        // Delete existing
        await supabase.from('tracker_module_features').delete().eq('module_id', moduleId);

        // Insert new
        if (editForm.features.length > 0) {
          const featuresToInsert = editForm.features.map(f => ({
            module_id: moduleId,
            name: f.name,
            status: f.status
          }));
          const { error: featError } = await supabase.from('tracker_module_features').insert(featuresToInsert);
          if (featError) throw featError;
        }
      }

      // Update Local State
      const updatedModule = { ...editForm, id: moduleId! };
      if (editingId === 'NEW') {
        setModules([...modules, updatedModule]);
      } else {
        setModules(modules.map(m => m.id === editingId ? updatedModule : m));
      }

      setEditingId(null);
      setEditForm(null);
      alert('Módulo guardado correctamente');
    } catch (error: any) {
      console.error('Error saving module:', error);
      alert('Error al guardar: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Seguro que desea eliminar este módulo?')) {
      try {
        const { error } = await supabase.from('tracker_modules').delete().eq('id', id);
        if (error) throw error;
        setModules(modules.filter(m => m.id !== id));
      } catch (error: any) {
        console.error('Error deleting module:', error);
        alert('Error al eliminar: ' + error.message);
      }
    }
  };

  const updateFeature = (index: number, field: string, value: any) => {
    if (!editForm) return;
    const newFeatures = [...editForm.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setEditForm({ ...editForm, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    if (!editForm) return;
    const newFeatures = editForm.features.filter((_, i) => i !== index);
    setEditForm({ ...editForm, features: newFeatures });
  };

  const addFeature = () => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      features: [...editForm.features, { name: 'Nueva Funcionalidad', status: Status.PENDING }]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Catálogo de Módulos ERP</h3>
        <button
          onClick={() => {
            setEditingId('NEW');
            setEditForm({
              id: '', name: '', description: '', status: Status.PENDING,
              icon: 'Package', owner: Department.GENERAL, progress: 0, features: []
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar Módulo
        </button>
      </div>

      {editingId && editForm ? (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-blue-200 dark:border-blue-800 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Nombre</label>
              <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Responsable</label>
              <select value={editForm.owner} onChange={e => setEditForm({ ...editForm, owner: e.target.value as Department })} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Descripción</label>
              <textarea rows={2} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Icono (Lucide)</label>
              <input type="text" value={editForm.icon} onChange={e => setEditForm({ ...editForm, icon: e.target.value })} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Estado General</label>
              <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value as Status })} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Progreso %</label>
              <input type="number" min="0" max="100" value={editForm.progress} onChange={e => setEditForm({ ...editForm, progress: parseInt(e.target.value) || 0 })} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-slate-700 pt-4 mt-4">
            <h4 className="font-semibold text-sm mb-3 text-gray-700 dark:text-slate-300">Detalle de Funcionalidades (Sub-módulos)</h4>
            <div className="space-y-2 mb-3">
              {editForm.features.map((feat, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={feat.name}
                    onChange={e => updateFeature(idx, 'name', e.target.value)}
                    className="flex-1 p-1.5 text-sm border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                  <select
                    value={feat.status}
                    onChange={e => updateFeature(idx, 'status', e.target.value as Status)}
                    className="w-40 p-1.5 text-sm border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => removeFeature(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button onClick={addFeature} className="text-xs flex items-center gap-1 text-blue-600 font-medium hover:underline"><Plus className="w-3 h-3" /> Agregar Funcionalidad</button>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => { setEditingId(null); setEditForm(null); }} className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              {isSaving ? <span className="animate-spin">⌛</span> : <Save className="w-4 h-4" />}
              Guardar Cambios
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map(mod => (
            <div key={mod.id} className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl relative group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <IconByName name={mod.icon} className="w-5 h-5 text-blue-500" />
                  <h4 className="font-bold text-gray-900 dark:text-white">{mod.name}</h4>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(mod)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(mod.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">{mod.description}</p>
              <div className="flex justify-between text-xs mt-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                <StatusBadge status={mod.status} />
                <span className="font-mono text-gray-400">{mod.features.length} Func.</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Sub-Component: Timeline Manager ---
const TimelineManager = ({ timeline, setTimeline }: { timeline: TimelineEvent[], setTimeline: (t: TimelineEvent[]) => void }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TimelineEvent | null>(null);

  const handleEdit = (evt: TimelineEvent) => {
    setEditingId(evt.id);
    setEditForm({ ...evt });
  };

  const handleSave = async () => {
    if (!editForm) return;

    try {
      const isNew = editingId === 'NEW';
      const eventId = isNew ? crypto.randomUUID() : editingId!;
      
      const { error } = await supabase
        .from('tracker_timeline_events')
        .upsert({
          id: eventId,
          phase: editForm.phase,
          date_range: editForm.date, // Map UI 'date' to DB 'date_range'
          status: editForm.status,
          description: editForm.description,
          modules_included: editForm.modulesIncluded || [] // Map UI 'modulesIncluded' to DB 'modules_included'
        });

      if (error) throw error;

      const updatedEvent = { ...editForm, id: eventId };
      
      if (isNew) {
        setTimeline([...timeline, updatedEvent]);
      } else {
        setTimeline(timeline.map(t => t.id === editingId ? updatedEvent : t));
      }
      
      setEditingId(null);
      setEditForm(null);
      alert('Fase guardada correctamente');
    } catch (error: any) {
      console.error('Error saving timeline event:', error);
      alert('Error al guardar fase: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar fase del cronograma?')) {
      try {
        const { error } = await supabase.from('tracker_timeline_events').delete().eq('id', id);
        if (error) throw error;
        setTimeline(timeline.filter(t => t.id !== id));
      } catch (error: any) {
        console.error('Error deleting timeline event:', error);
        alert('Error al eliminar fase: ' + error.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Plan de Actividades (Sprints)</h3>
        <button
          onClick={() => {
            setEditingId('NEW');
            setEditForm({
              id: 'temp', phase: 'Nueva Fase', date: '', status: Status.PENDING,
              description: '', modulesIncluded: [], tasks: []
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar Sprint
        </button>
      </div>

      {editingId && editForm ? (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-blue-200 dark:border-blue-800 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Nombre de la Fase / Sprint</label>
              <input type="text" value={editForm.phase} onChange={e => setEditForm({ ...editForm, phase: e.target.value })} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Fecha Meta</label>
              <input type="text" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Estado</label>
              <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value as Status })} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Descripción y Objetivo</label>
              <textarea rows={2} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => { setEditingId(null); setEditForm(null); }} className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><Save className="w-4 h-4" /> Guardar Cambios</button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {timeline.map(evt => (
            <div key={evt.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${evt.status === Status.COMPLETED ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{evt.phase}</h4>
                  <p className="text-xs text-gray-500">{evt.date} - {evt.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(evt)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(evt.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Sub-Component: Users Manager ---
const UsersManager = ({ users, setUsers }: { users: User[], setUsers: (u: User[]) => void }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState<User>({ id: '', name: '', email: '', role: 'USER', department: Department.GENERAL });

  const handleAddUser = async () => {
    try {
      if (!newUser.name || !newUser.email) {
        alert('Por favor complete nombre y correo');
        return;
      }
      
      const userId = crypto.randomUUID();
      const userToSave = {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        department: newUser.department,
        role: newUser.role || 'USER' // Ensure role is set
      };

      const { error } = await supabase.from('tracker_users').insert(userToSave);
      
      if (error) throw error;

      setUsers([...users, userToSave]);
      setIsAdding(false);
      setNewUser({ id: '', name: '', email: '', role: 'USER', department: Department.GENERAL });
      alert('Usuario registrado correctamente');
    } catch (error: any) {
      console.error('Error adding user:', error);
      alert('Error al registrar usuario: ' + error.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if(!confirm('¿Seguro que desea eliminar este usuario?')) return;
    
    try {
      const { error } = await supabase.from('tracker_users').delete().eq('id', id);
      if (error) throw error;
      setUsers(users.filter(u => u.id !== id));
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar usuario: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Usuarios y Accesos</h3>
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" /> Registrar Usuario
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 mb-4 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" placeholder="Nombre Completo" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            <input type="email" placeholder="Correo Electrónico" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            <select value={newUser.department} onChange={e => setNewUser({ ...newUser, department: e.target.value as Department })} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
              {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-sm text-gray-500">Cancelar</button>
            <button onClick={handleAddUser} className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700">Guardar</button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Depto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-300">{user.department}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300">{user.role}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="p-6 text-center text-gray-400">No hay usuarios registrados.</div>}
      </div>
    </div>
  );
};

// --- Sub-Component: Resources Manager (FAQ & Tutorials) ---
const ResourcesManager = ({
  faqs, setFaqs,
  tutorials, setTutorials
}: {
  faqs: FaqItem[], setFaqs: (f: FaqItem[]) => void,
  tutorials: TutorialItem[], setTutorials: (t: TutorialItem[]) => void
}) => {
  const [section, setSection] = useState<'FAQ' | 'TUTORIAL'>('FAQ');

  // FAQ State
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [newFaq, setNewFaq] = useState<FaqItem>({ id: '', question: '', answer: '', category: '' });

  // Tutorial State
  const [isAddingTut, setIsAddingTut] = useState(false);
  const [newTut, setNewTut] = useState<TutorialItem>({ id: '', title: '', duration: '', type: 'VIDEO', thumbnailColor: 'bg-blue-500' });

  // --- FAQ Handlers ---
  const handleAddFaq = async () => {
    if (!newFaq.question || !newFaq.answer) return;
    try {
      const faqId = crypto.randomUUID();
      const { error } = await supabase.from('tracker_faqs').insert({
        id: faqId,
        question: newFaq.question,
        answer: newFaq.answer,
        category: newFaq.category
      });
      if (error) throw error;

      setFaqs([...faqs, { ...newFaq, id: faqId }]);
      setIsAddingFaq(false);
      setNewFaq({ id: '', question: '', answer: '', category: '' });
    } catch (error: any) {
      console.error('Error adding FAQ:', error);
      alert('Error al guardar FAQ: ' + error.message);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      const { error } = await supabase.from('tracker_faqs').delete().eq('id', id);
      if (error) throw error;
      setFaqs(faqs.filter(f => f.id !== id));
    } catch (error: any) {
      console.error('Error deleting FAQ:', error);
      alert('Error al eliminar FAQ: ' + error.message);
    }
  };

  // --- Tutorial Handlers ---
  const handleAddTut = async () => {
    if (!newTut.title) return;
    try {
      const tutId = crypto.randomUUID();
      const { error } = await supabase.from('tracker_tutorials').insert({
        id: tutId,
        title: newTut.title,
        duration: newTut.duration,
        type: newTut.type,
        thumbnail_color: newTut.thumbnailColor
      });
      if (error) throw error;

      setTutorials([...tutorials, { ...newTut, id: tutId }]);
      setIsAddingTut(false);
      setNewTut({ id: '', title: '', duration: '', type: 'VIDEO', thumbnailColor: 'bg-blue-500' });
    } catch (error: any) {
      console.error('Error adding Tutorial:', error);
      alert('Error al guardar Tutorial: ' + error.message);
    }
  };

  const handleDeleteTut = async (id: string) => {
    try {
      const { error } = await supabase.from('tracker_tutorials').delete().eq('id', id);
      if (error) throw error;
      setTutorials(tutorials.filter(t => t.id !== id));
    } catch (error: any) {
      console.error('Error deleting Tutorial:', error);
      alert('Error al eliminar Tutorial: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setSection('FAQ')}
          className={`pb-2 text-sm font-medium transition-colors ${section === 'FAQ' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
        >
          Preguntas Frecuentes
        </button>
        <button
          onClick={() => setSection('TUTORIAL')}
          className={`pb-2 text-sm font-medium transition-colors ${section === 'TUTORIAL' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}
        >
          Tutoriales y Guías
        </button>
      </div>

      {section === 'FAQ' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-gray-800 dark:text-white">Listado de Preguntas</h4>
            <button onClick={() => setIsAddingFaq(true)} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus className="w-3 h-3" /> Nueva Pregunta
            </button>
          </div>

          {isAddingFaq && (
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-900/30 animate-in fade-in">
              <div className="grid grid-cols-1 gap-3">
                <input type="text" placeholder="Categoría (ej: Inventarios)" value={newFaq.category} onChange={e => setNewFaq({ ...newFaq, category: e.target.value })} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm" />
                <input type="text" placeholder="Pregunta" value={newFaq.question} onChange={e => setNewFaq({ ...newFaq, question: e.target.value })} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm" />
                <textarea placeholder="Respuesta detallada..." rows={3} value={newFaq.answer} onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm" />
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => setIsAddingFaq(false)} className="px-3 py-1 text-xs bg-white border rounded hover:bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white">Cancelar</button>
                <button onClick={handleAddFaq} className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700">Guardar</button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {faqs.map(faq => (
              <div key={faq.id} className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg flex justify-between items-start group">
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">{faq.category}</span>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{faq.question}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-1">{faq.answer}</p>
                </div>
                <button onClick={() => handleDeleteFaq(faq.id)} className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'TUTORIAL' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-gray-800 dark:text-white">Material de Capacitación</h4>
            <button onClick={() => setIsAddingTut(true)} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors">
              <Plus className="w-3 h-3" /> Nuevo Recurso
            </button>
          </div>

          {isAddingTut && (
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-emerald-200 dark:border-emerald-900/30 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Título del Material" value={newTut.title} onChange={e => setNewTut({ ...newTut, title: e.target.value })} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm" />
                <input type="text" placeholder="Duración (ej: 5 min, Lectura)" value={newTut.duration} onChange={e => setNewTut({ ...newTut, duration: e.target.value })} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm" />
                <select value={newTut.type} onChange={e => setNewTut({ ...newTut, type: e.target.value as any })} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm">
                  <option value="VIDEO">Video</option>
                  <option value="DOC">Documento</option>
                </select>
                <select value={newTut.thumbnailColor} onChange={e => setNewTut({ ...newTut, thumbnailColor: e.target.value })} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm">
                  <option value="bg-blue-500">Azul</option>
                  <option value="bg-emerald-500">Esmeralda</option>
                  <option value="bg-orange-500">Naranja</option>
                  <option value="bg-indigo-500">Índigo</option>
                  <option value="bg-slate-500">Gris</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => setIsAddingTut(false)} className="px-3 py-1 text-xs bg-white border rounded hover:bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white">Cancelar</button>
                <button onClick={handleAddTut} className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700">Guardar</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tutorials.map(tut => (
              <div key={tut.id} className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg relative group flex items-center gap-3">
                <div className={`w-10 h-10 shrink-0 ${tut.thumbnailColor} rounded-full flex items-center justify-center text-white`}>
                  {tut.type === 'VIDEO' ? <PlayCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{tut.title}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{tut.duration} • {tut.type}</p>
                </div>
                <button onClick={() => handleDeleteTut(tut.id)} className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const BackOfficeView = ({
  companyName, setCompanyName,
  modules, setModules,
  timeline, setTimeline,
  users, setUsers,
  faqs, setFaqs,
  tutorials, setTutorials
}: BackOfficeViewProps) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('CONFIG');

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-400" />
          BackOffice Administrativo
        </h2>
        <p className="text-slate-400 mt-1">Gestione la configuración, módulos y usuarios de la plataforma.</p>

        {/* Admin Tabs */}
        <div className="flex space-x-1 mt-6 border-b border-slate-700 overflow-x-auto">
          <button onClick={() => setActiveTab('CONFIG')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'CONFIG' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
            <div className="flex items-center gap-2"><Building className="w-4 h-4" /> Configuración</div>
          </button>
          <button onClick={() => setActiveTab('MODULES')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'MODULES' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
            <div className="flex items-center gap-2"><Grid className="w-4 h-4" /> Módulos</div>
          </button>
          <button onClick={() => setActiveTab('TIMELINE')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'TIMELINE' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
            <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Cronograma</div>
          </button>
          <button onClick={() => setActiveTab('USERS')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'USERS' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
            <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Usuarios</div>
          </button>
          <button onClick={() => setActiveTab('RESOURCES')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'RESOURCES' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
            <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Recursos</div>
          </button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'CONFIG' && <ConfigSection companyName={companyName} setCompanyName={setCompanyName} />}
        {activeTab === 'MODULES' && <ModulesManager modules={modules} setModules={setModules} />}
        {activeTab === 'TIMELINE' && <TimelineManager timeline={timeline} setTimeline={setTimeline} />}
        {activeTab === 'USERS' && <UsersManager users={users} setUsers={setUsers} />}
        {activeTab === 'RESOURCES' && <ResourcesManager faqs={faqs} setFaqs={setFaqs} tutorials={tutorials} setTutorials={setTutorials} />}
      </div>
    </div>
  );
};