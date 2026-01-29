import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Grid,
  Code2,
  CalendarDays,
  Menu,
  X,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Search,
  LifeBuoy,
  ListTodo,
  Settings,
  BookOpen,
  Maximize,
  Minimize
} from 'lucide-react';
import { DashboardView } from './components/DashboardView';
import { ModulesView } from './components/ModulesView';
import { CustomDevsView } from './components/CustomDevsView';
import { TimelineView } from './components/TimelineView';
import { TicketsView } from './components/TicketsView';
import { ActionsView } from './components/ActionsView';
import { BackOfficeView } from './components/BackOfficeView';
import { FaqView } from './components/FaqView';
import {
  COMPANY_NAME as DEFAULT_COMPANY,
  PENDING_ACTIONS,
  MODULES as DEFAULT_MODULES,
  TIMELINE as DEFAULT_TIMELINE,
  CUSTOM_DEVS as DEFAULT_CUSTOM_DEVS,
  FAQS as DEFAULT_FAQS,
  TUTORIALS as DEFAULT_TUTORIALS
} from './constants';
import { Tab, ActionItem, Module, TimelineEvent, CustomDevelopment, User, Department, FaqItem, TutorialItem, Ticket } from './types';
import { supabase } from './lib/supabase';
import { mapModule, mapTimelineEvent, mapCustomDev, mapActionItem, mapFaq, mapTutorial, mapUser, mapTicket } from './lib/mappers';
import { Session } from '@supabase/supabase-js';
import { Login } from './components/Login';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- CENTRALIZED STATE ---
  const [companyName, setCompanyName] = useState(DEFAULT_COMPANY);
  const [modules, setModules] = useState<Module[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [customDevs, setCustomDevs] = useState<CustomDevelopment[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [tutorials, setTutorials] = useState<TutorialItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]); // Added tickets state
  const [selectedModule, setSelectedModule] = useState<Module | null>(null); // State to control module detail view
  const [isLoading, setIsLoading] = useState(true);

  // Auth State
  // Auth State from Context
  const { user, profile, organization, loading, signOut, isAdmin, isClient } = useAuth();


  // Auth & Data Fetching
  // No need for local session listeners, handled in AuthContext

  // Redirect Super Admin to BackOffice
  // Redirect Admins to BackOffice, Clients to Dashboard
  useEffect(() => {
    if (!profile) return;

    if ((profile.role === 'SUPER_ADMIN' || profile.role === 'ORG_ADMIN') && activeTab === Tab.DASHBOARD) {
      setActiveTab(Tab.BACKOFFICE);
    }
    // Clients default to DASHBOARD which is the initial state, so no action needed.
  }, [profile, activeTab]);

  // Update Company Name from Organization Context
  useEffect(() => {
    if (organization?.name) {
      setCompanyName(organization.name);
    }
  }, [organization?.name]);

  // Fetch Logic (Moved to be dependent on session or just called if session exists)
  useEffect(() => {
    if (!user) return; // Only fetch if logged in


    async function fetchData() {
      try {
        setIsLoading(true);
        console.log('Fetching data...');

        // Fetch Modules with Features
        const { data: modulesData, error: modulesError } = await supabase
          .from('tracker_modules')
          .select('*, tracker_module_features(*)')
          .order('id');
        if (modulesError) throw modulesError;
        if (modulesData) setModules(modulesData.map((m: any) => mapModule(m)));

        // Fetch Timeline with Tasks
        const { data: timelineData, error: timelineError } = await supabase
          .from('tracker_timeline_events')
          .select('*, tracker_timeline_tasks(*)')
          .order('created_at', { ascending: true });
        if (timelineError) throw timelineError;
        if (timelineData) setTimeline(timelineData.map((t: any) => mapTimelineEvent(t)));

        // Fetch Custom Devs
        const { data: devsData, error: devsError } = await supabase
          .from('tracker_custom_developments')
          .select('*');
        if (devsError) throw devsError;
        if (devsData) setCustomDevs(devsData.map(mapCustomDev));

        // Fetch Actions
        const { data: actionsData, error: actionsError } = await supabase
          .from('tracker_action_items')
          .select('*');
        if (actionsError) throw actionsError;
        if (actionsData) setActions(actionsData.map(mapActionItem));

        // Fetch FAQs
        const { data: faqsData, error: faqsError } = await supabase
          .from('tracker_faqs')
          .select('*');
        if (faqsError) throw faqsError;
        if (faqsData) setFaqs(faqsData.map(mapFaq));

        // Fetch Tutorials
        const { data: tutsData, error: tutsError } = await supabase
          .from('tracker_tutorials')
          .select('*');
        if (tutsError) throw tutsError;
        if (tutsData) setTutorials(tutsData.map(mapTutorial));

        // Fetch Tickets
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('tracker_tickets')
          .select('*, tracker_ticket_updates(*)')
          .order('created_at', { ascending: false });
        if (ticketsError) throw ticketsError;
        if (ticketsData) setTickets(ticketsData.map((t: any) => mapTicket(t)));

        // Fetch Profiles (Users)
        // Only if Admin? Or everyone needs to see users? Maybe for assignments.
        // For now fetch all profiles visible to user (RLS controls this)
        const { data: profilesData, error: profilesError } = await supabase
          .from('tracker_profiles')
          .select('*');
        if (profilesError) throw profilesError;

        // Map profiles to User
        if (profilesData) {
          const mappedUsers: User[] = profilesData.map((p: any) => ({
            id: p.id,
            name: p.full_name || 'Unknown',
            email: 'user@example.com', // Profile doesn't have email usually, unless we replicate it. 
            // We might need to fetch email from auth or just use placeholder.
            // For MVP display, name is enough.
            role: p.role === 'CLIENT_USER' ? 'USER' : 'ADMIN',
            department: Department.IT, // Default or add department to profile
            organizationId: p.organization_id
          }));
          setUsers(mappedUsers);
        }

      } catch (error: any) {
        console.error('Error fetching data:', error);

        if (error.status === 401 || error.status === 403 || (error.message && error.message.includes('JWT'))) {
          console.warn('Session invalid.');
          // signOut(); // Removed signOut() from here as per instruction, assuming it's handled by AuthContext or elsewhere.
        }

      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user?.id]); // Only refetch if USER ID changes (not just the session object)

  // Fullscreen Logic
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen mode: ${e.message} (${e.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Initialize Dark Mode based on preference or system
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // Apply Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // Action Handlers
  const handleToggleAction = (id: string) => {
    setActions(actions.map(a =>
      a.id === id
        ? { ...a, status: a.status === 'PENDING' ? 'COMPLETED' : 'PENDING' }
        : a
    ));
  };

  const handleAddAction = (action: ActionItem) => {
    setActions([action, ...actions]);
  };

  const handleDeleteAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
  };

  // If no session, show Login
  // If no user and not loading (loading handled by AuthContext mostly but we check user), show Login
  // Actually, AuthContext loading covers initial fetch.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-emerald-600">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // Loading State
  // Loading State from data fetch
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-emerald-600">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const NavItem = ({ tab, label, icon: Icon }: { tab: Tab; label: string; icon: any }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
      }}
      className={`relative flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4 space-x-3'} py-3 rounded-lg transition-all duration-200 group
        ${activeTab === tab
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
          : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
        }
      `}
    >
      <Icon className={`w-6 h-6 shrink-0 transition-transform ${isCollapsed ? 'scale-110' : ''}`} />
      {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden transition-all">{label}</span>}

      {/* Tooltip for collapsed mode */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-gray-800 dark:bg-slate-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[100] border border-gray-700 dark:border-slate-700 shadow-xl transition-opacity duration-200">
          {label}
          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800 dark:border-r-slate-800"></div>
        </div>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex transition-colors duration-300">

      {/* Sidebar (Desktop) */}
      <aside
        className={`hidden lg:flex flex-col bg-white dark:bg-slate-950 text-gray-900 dark:text-white fixed h-full z-20 transition-all duration-300 border-r border-gray-200 dark:border-slate-800
          ${isCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        <div className={`p-4 h-20 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-gray-200 dark:border-slate-800`}>
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-auto flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
                    T
                  </div>
                  <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-400">TRANTOR</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
              T
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors absolute -right-3 top-7 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm z-30 hidden lg:flex`}
          >
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          {profile?.role !== 'SUPER_ADMIN' && (
            <>
              <NavItem tab={Tab.DASHBOARD} label="Resumen General" icon={LayoutDashboard} />
              <NavItem tab={Tab.MODULES} label="Módulos ERP" icon={Grid} />
              <NavItem tab={Tab.TIMELINE} label="Cronograma" icon={CalendarDays} />
              <NavItem tab={Tab.CUSTOM_DEVS} label="Desarrollos" icon={Code2} />
              <NavItem tab={Tab.ACTIONS} label="Acciones" icon={ListTodo} />
              <NavItem tab={Tab.FAQ} label="Ayuda & Tutoriales" icon={BookOpen} />
              <NavItem tab={Tab.TICKETS} label="Soporte & Tickets" icon={LifeBuoy} />
            </>
          )}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className={`mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider ${isCollapsed ? 'hidden' : 'block'}`}>
                Administración
              </div>
              <NavItem tab={Tab.BACKOFFICE} label="Admin BackOffice" icon={Settings} />
            </>
          )}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-slate-800">
          <div className={`bg-gray-50 dark:bg-slate-900 rounded-xl p-3 transition-all ${isCollapsed ? 'flex justify-center' : ''}`}>
            {!isCollapsed ? (
              <>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Proyecto</p>
                <p className="text-sm font-semibold truncate text-gray-900 dark:text-slate-200">{organization?.name || 'Mi Proyecto'}</p>
                <button
                  onClick={() => signOut()}
                  className="mt-3 flex items-center space-x-2 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => signOut()}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {
        isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        )
      }

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-950 text-gray-900 dark:text-white transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl border-r border-gray-200 dark:border-slate-800`}>
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">T</div>
            <span className="font-bold text-lg">TRANTOR</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <NavItem tab={Tab.DASHBOARD} label="Resumen General" icon={LayoutDashboard} />
          <NavItem tab={Tab.MODULES} label="Módulos ERP" icon={Grid} />
          <NavItem tab={Tab.TIMELINE} label="Cronograma" icon={CalendarDays} />
          <NavItem tab={Tab.CUSTOM_DEVS} label="Desarrollos" icon={Code2} />
          <NavItem tab={Tab.ACTIONS} label="Acciones" icon={ListTodo} />
          <div className="pt-2 mt-2 border-t border-gray-200 dark:border-slate-800">
            <NavItem tab={Tab.FAQ} label="Ayuda & Tutoriales" icon={BookOpen} />
            <NavItem tab={Tab.TICKETS} label="Soporte & Tickets" icon={LifeBuoy} />
          </div>
          {isAdmin && <NavItem tab={Tab.BACKOFFICE} label="Admin BackOffice" icon={Settings} />}
        </nav>
      </div>

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300
          ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
        `}
      >

        {/* Top Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between shadow-sm transition-colors">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button className="lg:hidden text-gray-600 dark:text-gray-300 p-1" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex flex-col">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white leading-none">
                {activeTab === Tab.DASHBOARD && 'Panel de Control'}
                {activeTab === Tab.MODULES && 'Estado de Módulos'}
                {activeTab === Tab.CUSTOM_DEVS && 'Desarrollos'}
                {activeTab === Tab.ACTIONS && 'Gestión de Acciones'}
                {activeTab === Tab.TIMELINE && 'Línea de Tiempo'}
                {activeTab === Tab.TICKETS && 'Soporte Técnico'}
                {activeTab === Tab.FAQ && 'Centro de Ayuda'}
                {activeTab === Tab.BACKOFFICE && 'LAIMU - Control de Proyectos'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 hidden sm:block">Seguimiento en tiempo real</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">

            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors hidden sm:block"
              title={isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              title={isDarkMode ? "Modo Claro" : "Modo Oscuro"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>

            <div className="flex items-center space-x-3 pl-1 sm:pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{profile?.full_name || user?.email}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{profile?.role || 'User'}</p>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md ring-2 ring-white dark:ring-slate-700">
                {(profile?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="p-4 sm:p-6 md:p-8 w-full max-w-[1600px] mx-auto">
          {activeTab === Tab.DASHBOARD && <DashboardView modules={modules} timeline={timeline} actions={actions} onNavigate={setActiveTab} onModuleSelect={setSelectedModule} />}
          {activeTab === Tab.MODULES && <ModulesView modules={modules} activeModule={selectedModule} onSelectModule={setSelectedModule} />}
          {activeTab === Tab.CUSTOM_DEVS && <CustomDevsView customDevs={customDevs} />}
          {activeTab === Tab.ACTIONS && <ActionsView actions={actions} onToggle={handleToggleAction} onAdd={handleAddAction} onDelete={handleDeleteAction} />}
          {activeTab === Tab.TIMELINE && <TimelineView timeline={timeline} />}
          {activeTab === Tab.TICKETS && <TicketsView modules={modules} tickets={tickets} setTickets={setTickets} />}
          {activeTab === Tab.FAQ && <FaqView faqs={faqs} tutorials={tutorials} />}
          {activeTab === Tab.BACKOFFICE && isAdmin && (
            <BackOfficeView
              companyName={companyName}
              setCompanyName={setCompanyName}
              modules={modules}
              setModules={setModules}
              timeline={timeline}
              setTimeline={setTimeline}
              users={users}
              setUsers={setUsers}
              faqs={faqs}
              setFaqs={setFaqs}
              tutorials={tutorials}
              setTutorials={setTutorials}
            />
          )}
        </div>

      </main>
    </div >
  );
}

export default App;