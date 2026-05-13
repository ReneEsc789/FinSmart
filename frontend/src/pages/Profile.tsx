import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  DollarSign, 
  Shield, 
  Bell, 
  ChevronRight, 
  Camera,
  LogOut,
  Trash2,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, alertSettings, updateAlertSettings } = useApp();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [securityForm, setSecurityForm] = useState({ current: '', new: '', confirm: '' });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(editForm);
    setIsEditingProfile(false);
  };

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate password update
    setShowSecurityModal(false);
    setSecurityForm({ current: '', new: '', confirm: '' });
  };

  const handleLogout = () => {
    // In a real app, clear tokens/session
    navigate('/');
  };

  const handleDeleteAccount = () => {
    // In a real app, call API to delete
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-transparent text-white pb-32 pt-10 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="flex flex-col items-center text-center space-y-6">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[3rem] bg-purple-600/20 border-4 border-purple-600/30 flex items-center justify-center shadow-2xl shadow-purple-500/30 transition-transform duration-500 group-hover:scale-105">
              <User size={64} className="text-purple-500" />
            </div>
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="absolute bottom-2 right-2 p-4 bg-purple-600 rounded-2xl border-4 border-[#050507] text-white hover:bg-purple-500 transition-all shadow-xl"
            >
              <Camera size={20} />
            </button>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight font-display">{user.name}</h1>
            <p className="text-gray-400 font-medium text-lg">{user.email}</p>
          </div>
        </header>

        {/* Settings Groups */}
        <div className="space-y-8">
          <section className="glass rounded-[3rem] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-xs font-black text-purple-500 uppercase tracking-[0.3em]">Información Personal</h2>
              <button 
                onClick={() => {
                  setEditForm({ ...user });
                  setIsEditingProfile(true);
                }}
                className="text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
              >
                Editar
              </button>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { label: 'Nombre', value: user.name, icon: User },
                { label: 'Correo', value: user.email, icon: Mail },
                { label: 'Moneda Preferida', value: user.currency, icon: DollarSign },
              ].map((item, i) => (
                <div key={i} className="w-full p-8 flex items-center justify-between text-left">
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-white/5 text-gray-400">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">{item.label}</p>
                      <p className="text-lg font-black">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass rounded-[3rem] overflow-hidden">
            <div className="p-8 border-b border-white/5">
              <h2 className="text-xs font-black text-purple-500 uppercase tracking-[0.3em]">Notificaciones y Seguridad</h2>
            </div>
            <div className="divide-y divide-white/5">
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-white/5 text-gray-400">
                    <Bell size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-black">Alertas de Presupuesto</p>
                    <p className="text-xs text-gray-500 font-medium">Recibe avisos cuando superes tus límites</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateAlertSettings({ budgetAlerts: !alertSettings.budgetAlerts })}
                  className={`w-14 h-8 rounded-full transition-all relative ${alertSettings.budgetAlerts ? 'bg-purple-600' : 'bg-white/10'}`}
                >
                  <motion.div 
                    animate={{ x: alertSettings.budgetAlerts ? 28 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>

              <button 
                onClick={() => setShowSecurityModal(true)}
                className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-all text-left group"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-white/5 text-gray-400 group-hover:text-purple-500 transition-colors">
                    <Shield size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-black">Seguridad de la Cuenta</p>
                    <p className="text-xs text-gray-500 font-medium">Cambiar contraseña y autenticación</p>
                  </div>
                </div>
                <ChevronRight size={24} className="text-gray-700 group-hover:text-white transition-colors" />
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-500/5 border border-red-500/10 rounded-[3rem] overflow-hidden">
            <div className="p-8 border-b border-red-500/10">
              <h2 className="text-xs font-black text-red-500 uppercase tracking-[0.3em]">Zona de Peligro</h2>
            </div>
            <div className="divide-y divide-red-500/10">
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full p-8 flex items-center justify-between hover:bg-red-500/10 transition-all text-left group"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-red-500/10 text-red-500">
                    <LogOut size={24} />
                  </div>
                  <p className="text-lg font-black text-red-500">Cerrar Sesión</p>
                </div>
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full p-8 flex items-center justify-between hover:bg-red-500/10 transition-all text-left group"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-red-500/10 text-red-500">
                    <Trash2 size={24} />
                  </div>
                  <p className="text-lg font-black text-red-500">Eliminar Cuenta</p>
                </div>
              </button>
            </div>
          </section>
        </div>
        
        <p className="text-center text-gray-600 text-xs pb-10">
          FinSmart v1.0.0 • Hecho con ❤️ para tus finanzas
        </p>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingProfile(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black font-display tracking-tight">Editar Perfil</h2>
                <button onClick={() => setIsEditingProfile(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Nombre Completo</label>
                  <input 
                    type="text" 
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Correo Electrónico</label>
                  <input 
                    type="email" 
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Moneda</label>
                  <select 
                    value={editForm.currency}
                    onChange={(e) => setEditForm({...editForm, currency: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium appearance-none"
                  >
                    <option value="MXN">MXN - Peso Mexicano</option>
                    <option value="USD">USD - Dólar Estadounidense</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 rounded-2xl bg-purple-600 hover:bg-purple-500 font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Guardar Cambios
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Security Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecurityModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black font-display tracking-tight">Seguridad</h2>
                <button onClick={() => setShowSecurityModal(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateSecurity} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Contraseña Actual</label>
                  <input 
                    type="password" 
                    required
                    value={securityForm.current}
                    onChange={(e) => setSecurityForm({...securityForm, current: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Nueva Contraseña</label>
                  <input 
                    type="password" 
                    required
                    value={securityForm.new}
                    onChange={(e) => setSecurityForm({...securityForm, new: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Confirmar Contraseña</label>
                  <input 
                    type="password" 
                    required
                    value={securityForm.confirm}
                    onChange={(e) => setSecurityForm({...securityForm, confirm: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 rounded-2xl bg-purple-600 hover:bg-purple-500 font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2"
                >
                  <Shield size={18} />
                  Actualizar Seguridad
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogoutConfirm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-sm bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 text-center">
              <div className="w-20 h-20 bg-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <LogOut size={40} className="text-purple-500" />
              </div>
              <h2 className="text-2xl font-black mb-2">¿Cerrar Sesión?</h2>
              <p className="text-gray-400 mb-8">Tendrás que volver a ingresar tus credenciales para acceder.</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowLogoutConfirm(false)} className="py-4 rounded-2xl bg-white/5 font-bold hover:bg-white/10 transition-all">Cancelar</button>
                <button onClick={handleLogout} className="py-4 rounded-2xl bg-purple-600 font-bold hover:bg-purple-500 transition-all">Salir</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-sm bg-white/[0.02] backdrop-blur-3xl border border-red-500/20 rounded-[3rem] p-10 text-center">
              <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-black mb-2 text-red-500">¿Eliminar Cuenta?</h2>
              <p className="text-gray-400 mb-8">Esta acción es permanente y borrará todos tus datos financieros.</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowDeleteConfirm(false)} className="py-4 rounded-2xl bg-white/5 font-bold hover:bg-white/10 transition-all">Cancelar</button>
                <button onClick={handleDeleteAccount} className="py-4 rounded-2xl bg-red-600 font-bold hover:bg-red-500 transition-all">Eliminar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
