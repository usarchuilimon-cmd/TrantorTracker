import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, LogIn, Mail, Lock, AlertCircle, UserPlus, Shield } from 'lucide-react';
import { Department } from '../types';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // New fields for registration
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [department, setDepartment] = useState<Department | ''>('');

    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'error' | 'success', message: string } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            setFeedback({ type: 'error', message: 'Por favor, ingrese correo y contraseña.' });
            return;
        }

        // SignUp specific validation
        if (isSignUp) {
            if (!name || !phone || !jobTitle || !department) {
                setFeedback({ type: 'error', message: 'Por favor, complete todos los campos de registro.' });
                return;
            }
        }

        setIsLoading(true);
        setFeedback(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                            phone,
                            job_title: jobTitle,
                            department
                        }
                    }
                });
                if (error) throw error;
                setFeedback({ type: 'success', message: 'Registro exitoso. ¡Revise su correo para confirmar!' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                    options: {

                    }
                });
                if (error) throw error;
                // Success handled by App.tsx session listener
            }
        } catch (error: any) {
            console.error('Login error details:', error);
            let msg = error.message;
            if (msg === 'Invalid login credentials') msg = 'Credenciales inválidas.';
            setFeedback({ type: 'error', message: msg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900 transition-colors">
            {/* Left Side - Visual & Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-cyan-900 border-r border-gray-200 dark:border-slate-800">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
                        alt="Background"
                        className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/90 to-slate-900/90 mix-blend-multiply" />
                </div>

                <div className="relative z-10 flex flex-col justify-between p-12 w-full text-white">
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <img src="/laimu-logo.png" alt="Laimu Logo" className="h-12 w-auto object-contain bg-white/10 rounded-lg p-1 backdrop-blur-sm" />
                        </div>
                        <h2 className="text-4xl font-extrabold leading-tight max-w-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 bg-300% animate-gradient">
                            Conectando tu <br /> visión con la realidad.
                        </h2>
                        <p className="mt-4 text-cyan-100/80 text-lg max-w-md leading-relaxed">
                            Plataforma integral para la gestión estratégica, operativa y comercial de tu organización.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                            <div className="flex gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <svg key={i} className="w-5 h-5 text-orange-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-sm font-medium italic text-cyan-50">
                                "La transformación digital que necesitábamos. Laimu ha simplificado nuestros procesos críticos."
                            </p>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-white text-xs">
                                    DIR
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Carlos Méndez</p>
                                    <p className="text-[10px] text-cyan-200/70">Director General</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-400">
                            <span>© 2026 Laimu Inc.</span>
                            <a href="#" className="hover:text-cyan-400 transition-colors">Términos</a>
                            <a href="#" className="hover:text-cyan-400 transition-colors">Privacidad</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">

                    {/* Mobile Logo (Visible only on small screens) */}
                    <div className="lg:hidden text-center mb-8">
                        <img src="/laimu-logo.png" alt="Laimu Logo" className="h-16 w-auto mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Laimu</h2>
                    </div>

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {isSignUp ? 'Únete a Laimu' : 'Bienvenido'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                            {isSignUp
                                ? 'Crea tu cuenta empresarial hoy mismo.'
                                : 'Ingresa a tu espacio de trabajo.'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        {/* Feedback Alert */}
                        {feedback && (
                            <div className={`p-4 rounded-xl text-sm flex items-start gap-3 shadow-sm animate-in slide-in-from-top-2 ${feedback.type === 'success'
                                ? 'bg-cyan-50 text-cyan-800 border border-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800'
                                : 'bg-orange-50 text-orange-800 border border-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
                                }`}>
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="font-medium">{feedback.message}</p>
                            </div>
                        )}

                        {isSignUp && (
                            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 fade-in">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 block mb-1.5 ml-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-5 py-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                                        placeholder="Ej. Juan Pérez"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 block mb-1.5 ml-1">Celular</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-5 py-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                                            placeholder="55 1234 5678"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 block mb-1.5 ml-1">Puesto</label>
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            className="w-full px-5 py-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                                            placeholder="Ej. Gerente"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 block mb-1.5 ml-1">Departamento</label>
                                    <div className="relative">
                                        <select
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value as Department)}
                                            className="w-full px-5 py-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none appearance-none transition-all cursor-pointer"
                                            disabled={isLoading}
                                        >
                                            <option value="">Seleccione una opción...</option>
                                            {Object.values(Department).map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-px bg-gray-100 dark:bg-slate-800 my-4"></div>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 block mb-1.5 ml-1">Correo Electrónico</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                                        placeholder="nombre@empresa.com"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5 ml-1">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Contraseña</label>
                                    {!isSignUp && (
                                        <a href="#" className="text-xs font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 transition-colors">
                                            ¿Olvidaste tu contraseña?
                                        </a>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-600/30 hover:shadow-cyan-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                                        <span>{isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            {isSignUp ? '¿Ya tienes una cuenta?' : '¿Todavía no tienes cuenta?'}
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setFeedback(null);
                                }}
                                className="ml-2 font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors focus:outline-none"
                                disabled={isLoading}
                            >
                                {isSignUp ? 'Inicia sesión aquí' : 'Regístrate ahora'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
