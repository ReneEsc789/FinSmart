import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Mail, Lock, User, EyeOff, Eye, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';

export const Login = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const passwordsMatch = mode === 'login' || formData.password === formData.confirmPassword;
    const canSubmit = mode === 'login' 
        ? (formData.email && formData.password)
        : (formData.name && formData.email && formData.password && formData.confirmPassword && passwordsMatch);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard');
        }, 1500);
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (        
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent p-4 lg:p-8">
            <AnimatedBackground />
            
            <div className="w-full max-w-md relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                    className="w-full glass p-10 rounded-[3rem] relative shadow-2xl shadow-purple-500/10 border border-white/10"
                >
                    {/* Decorative elements */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-600/20 blur-3xl rounded-full" />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-600/20 blur-3xl rounded-full" />

                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="bg-purple-600 p-2 rounded-xl shadow-lg shadow-purple-500/50">
                                <span className="text-white text-2xl font-black tracking-tighter">$</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter text-white font-display">
                                Fin<span className="text-purple-500">Smart</span>
                            </h1>
                        </div>
                        <p className="text-purple-400 text-[10px] uppercase tracking-[0.4em] font-black mb-6">Tus finanzas inteligentes</p>
                        
                        <h3 className="text-2xl font-black mb-2 font-display">
                            {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                        </h3>
                        <p className="text-gray-400 text-sm">
                            {mode === 'login' ? 'Ingresa tus credenciales para acceder' : 'Comienza tu viaje financiero hoy mismo'}
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <AnimatePresence mode="popLayout">
                            {mode === 'register' && (
                                <motion.div
                                    key="name-field"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="relative"
                                >
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input 
                                        type="text" 
                                        name="name"
                                        placeholder="Nombre completo"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                        required
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Correo electrónico"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input 
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {mode === 'register' && (
                                <motion.div
                                    key="confirm-password-field"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-2"
                                >
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirmar contraseña"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full bg-white/5 border ${!passwordsMatch && formData.confirmPassword ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-purple-500/50'} rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 transition-all`}
                                            required
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {!passwordsMatch && formData.confirmPassword && (
                                        <motion.p 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-red-500 text-xs font-bold pl-2"
                                        >
                                            Las contraseñas no son iguales
                                        </motion.p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            type="submit"
                            disabled={isLoading || !canSubmit}
                            whileHover={canSubmit ? { scale: 1.02, y: -2 } : {}}
                            whileTap={canSubmit ? { scale: 0.98 } : {}}
                            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-3 group ${
                                canSubmit 
                                ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20 cursor-pointer' 
                                : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <span>{mode === 'login' ? 'Iniciar Sesión' : 'Registrarme'}</span>
                                    <ArrowRight size={20} className={`${canSubmit ? 'group-hover:translate-x-1' : ''} transition-transform`} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-px bg-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black">
                            <span className="bg-transparent px-4 text-gray-500">O continúa con</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold group shadow-lg"
                    >
                        <div className="bg-white p-1.5 rounded-lg shadow-inner">
                            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
                        </div>
                        <span className="text-white group-hover:text-purple-300 transition-colors">Continuar con Google</span>
                    </button>

                    <button 
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')} 
                        className="w-full mt-8 text-sm text-gray-400 hover:text-purple-400 transition-colors text-center font-medium"
                    >
                        {mode === 'login' ? '¿No tienes cuenta? Crea una aquí' : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                </motion.div>
            </div>
        </div>
    );
};
