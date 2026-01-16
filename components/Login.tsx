
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, LogIn, Mail, Lock, AlertCircle, UserPlus, Shield } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'error' | 'success', message: string } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setFeedback({ type: 'error', message: 'Por favor, ingrese correo y contraseña.' });
            return;
        }

        setIsLoading(true);
        setFeedback(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setFeedback({ type: 'success', message: 'Registro exitoso. ¡Revise su correo para confirmar!' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
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
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="bg-emerald-600 p-8 text-center text-white">
                    <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Trantor Tracker</h1>
                    <p className="text-emerald-100 mt-2 text-sm">Sistema de Gestión y Seguimiento</p>
                </div>

                {/* Form */}
                <div className="p-8">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                        {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
                    </h2>

                    <form onSubmit={handleAuth} className="space-y-5">
                        {/* Feedback Alert */}
                        {feedback && (
                            <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${feedback.type === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <p>{feedback.message}</p>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                                    placeholder="usuario@empresa.com"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                                    {isSignUp ? 'Registrarse' : 'Ingresar'}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setFeedback(null);
                            }}
                            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
                            disabled={isLoading}
                        >
                            {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
