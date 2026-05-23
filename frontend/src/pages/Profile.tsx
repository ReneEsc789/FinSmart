import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Bell, Check, ChevronRight, LogOut, Mail, Shield, Sparkles, Trash2, User, Wallet, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useApp } from '../context/AppContext';

const currencyOptions = [
  { code: 'MXN', label: 'Peso Mexicano' },
  { code: 'USD', label: 'Dolar Estadounidense' },
  { code: 'EUR', label: 'Euro' },
];

export const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, alertSettings, updateAlertSettings, logout, deleteCurrentUser, isLoading } = useApp();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', currency: 'MXN' });
  const [securityForm, setSecurityForm] = useState({ current: '', new: '', confirm: '' });
  const [profileError, setProfileError] = useState('');
  const [securityError, setSecurityError] = useState('');

  const closeProfileModal = () => {
    setProfileError('');
    setIsEditingProfile(false);
  };

  const closeSecurityModal = () => {
    setSecurityError('');
    setSecurityForm({ current: '', new: '', confirm: '' });
    setShowSecurityModal(false);
  };

  const initials = user?.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') ?? 'FS';

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileError('');

    const result = await updateUser({
      name: editForm.name,
      email: editForm.email,
      currency: editForm.currency,
    });

    if (result.success) {
      setIsEditingProfile(false);
      return;
    }

    setProfileError(result.message ?? 'No se pudo actualizar el perfil');
  };

  const handleUpdateSecurity = async (event: React.FormEvent) => {
    event.preventDefault();
    setSecurityError('');

    const result = await updateUser({
      currentPassword: securityForm.current,
      newPassword: securityForm.new,
      confirmPassword: securityForm.confirm,
    });

    if (!result.success) {
      setSecurityError(result.message ?? 'No se pudo actualizar la contrasena');
      return;
    }

    setShowSecurityModal(false);
    setSecurityForm({ current: '', new: '', confirm: '' });
  };

  const passwordsMatch = securityForm.new === securityForm.confirm;
  const securityFieldsComplete = Boolean(securityForm.current && securityForm.new && securityForm.confirm);
  const isPasswordLengthValid = securityForm.new.length >= 8 && securityForm.new.length <= 50;
  const canSubmitSecurity = securityFieldsComplete && passwordsMatch && isPasswordLengthValid;

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="glass px-8 py-6 rounded-3xl font-bold uppercase tracking-[0.3em] text-gray-300">Cargando Perfil</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-white pb-32 pt-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="glass rounded-[3rem] p-8 sm:p-10 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-purple-500/30 to-fuchsia-500/10 border border-purple-400/30 flex items-center justify-center shadow-2xl shadow-purple-500/20 shrink-0">
              <span className="text-4xl font-black tracking-tight text-white">{initials}</span>
            </div>

            <div className="flex-1 min-w-0 space-y-5">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-purple-400">Centro de Cuenta</p>
                <h1 className="text-4xl font-black tracking-tight font-display break-words">{user.name}</h1>
                <p className="text-gray-400 font-medium text-lg break-words">{user.email}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.25em] mb-2">Moneda</p>
                  <p className="text-lg font-black">{user.currency}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.25em] mb-2">Alertas</p>
                  <p className="text-lg font-black">{alertSettings.budgetAlerts ? 'Activadas' : 'Pausadas'}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.25em] mb-2">Estado</p>
                  <div className="flex items-center gap-2 text-green-400">
                    <Sparkles size={16} />
                    <span className="font-black">Cuenta Activa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          <section className="glass rounded-[3rem] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center gap-4">
              <h2 className="text-xs font-black text-purple-500 uppercase tracking-[0.3em]">Configuracion Personal</h2>
              <button
                onClick={() => {
                  setEditForm({ name: user.name, email: user.email, currency: user.currency });
                  setProfileError('');
                  setIsEditingProfile(true);
                }}
                className="text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors shrink-0"
              >
                Editar
              </button>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { label: 'Nombre', value: user.name, icon: User },
                { label: 'Correo', value: user.email, icon: Mail },
                { label: 'Moneda Preferida', value: user.currency, icon: Wallet },
              ].map((item) => (
                <div key={item.label} className="w-full p-8 flex items-center justify-between text-left">
                  <div className="flex items-center gap-6 min-w-0">
                    <div className="p-4 rounded-2xl bg-white/5 text-gray-400 shrink-0">
                      <item.icon size={24} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">{item.label}</p>
                      <p className="text-lg font-black break-words">{item.value}</p>
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
              <div className="p-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6 min-w-0">
                  <div className="p-4 rounded-2xl bg-white/5 text-gray-400 shrink-0">
                    <Bell size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-black">Alertas de Presupuesto</p>
                    <p className="text-xs text-gray-500 font-medium break-words">Tu preferencia se conserva para futuras visitas.</p>
                  </div>
                </div>
                <button
                  onClick={() => updateAlertSettings({ budgetAlerts: !alertSettings.budgetAlerts })}
                  className={`w-14 h-8 rounded-full transition-all relative shrink-0 ${alertSettings.budgetAlerts ? 'bg-purple-600' : 'bg-white/10'}`}
                >
                  <motion.div animate={{ x: alertSettings.budgetAlerts ? 28 : 4 }} className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg" />
                </button>
              </div>

              <button
                onClick={() => {
                  setSecurityError('');
                  setSecurityForm({ current: '', new: '', confirm: '' });
                  setShowSecurityModal(true);
                }}
                className="w-full p-8 flex items-center justify-between gap-4 hover:bg-white/5 transition-all text-left group"
              >
                <div className="flex items-center gap-6 min-w-0">
                  <div className="p-4 rounded-2xl bg-white/5 text-gray-400 group-hover:text-purple-500 transition-colors shrink-0">
                    <Shield size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-black">Seguridad de la Cuenta</p>
                    <p className="text-xs text-gray-500 font-medium break-words">Prepara credenciales y reglas de acceso sin depender de una foto de perfil.</p>
                  </div>
                </div>
                <ChevronRight size={24} className="text-gray-700 group-hover:text-white transition-colors shrink-0" />
              </button>
            </div>
          </section>

          <section className="bg-red-500/5 border border-red-500/10 rounded-[3rem] overflow-hidden">
            <div className="p-8 border-b border-red-500/10">
              <h2 className="text-xs font-black text-red-500 uppercase tracking-[0.3em]">Zona de Peligro</h2>
            </div>
            <div className="divide-y divide-red-500/10">
              <button onClick={() => setShowLogoutConfirm(true)} className="w-full p-8 flex items-center justify-between hover:bg-red-500/10 transition-all text-left group">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-red-500/10 text-red-500">
                    <LogOut size={24} />
                  </div>
                  <p className="text-lg font-black text-red-500">Cerrar Sesion</p>
                </div>
              </button>
              <button onClick={() => setShowDeleteConfirm(true)} className="w-full p-8 flex items-center justify-between hover:bg-red-500/10 transition-all text-left group">
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
      </div>

      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeProfileModal} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-xl bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-6 sm:p-10 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-black font-display tracking-tight">Configuracion de Cuenta</h2>
                <button onClick={closeProfileModal} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors shrink-0">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Nombre Completo</label>
                  <input value={editForm.name} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Correo Electronico</label>
                  <input value={editForm.email} onChange={(event) => setEditForm({ ...editForm, email: event.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium" />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Moneda</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currencyOptions.map((currency) => (
                      <button
                        key={currency.code}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, currency: currency.code })}
                        className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                          editForm.currency === currency.code
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <p className="text-sm font-black">{currency.code}</p>
                        <p className="text-xs text-gray-400 mt-1">{currency.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {profileError && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {profileError}
                  </div>
                )}

                <button type="submit" className="w-full py-5 rounded-2xl bg-purple-600 hover:bg-purple-500 font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2">
                  <Check size={18} />
                  Guardar Cambios
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showSecurityModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeSecurityModal} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-6 sm:p-10 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black font-display tracking-tight">Seguridad</h2>
                <button onClick={closeSecurityModal} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateSecurity} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Contrasena Actual</label>
                  <input type="password" value={securityForm.current} onChange={(event) => setSecurityForm({ ...securityForm, current: event.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Nueva Contrasena</label>
                  <input type="password" value={securityForm.new} onChange={(event) => setSecurityForm({ ...securityForm, new: event.target.value })} className={`w-full bg-white/5 border rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 font-medium ${securityForm.new && !isPasswordLengthValid ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/5 focus:ring-purple-500/50'}`} />
                  {securityForm.new && !isPasswordLengthValid && (
                    <p className="text-xs text-red-300 ml-2">La contrasena debe tener entre 8 y 50 caracteres.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Confirmar Contrasena</label>
                  <input type="password" value={securityForm.confirm} onChange={(event) => setSecurityForm({ ...securityForm, confirm: event.target.value })} className={`w-full bg-white/5 border rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 font-medium ${securityForm.confirm && !passwordsMatch ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/5 focus:ring-purple-500/50'}`} />
                  {securityForm.confirm && !passwordsMatch && (
                    <p className="text-xs text-red-300 ml-2">Las contrasenas no coinciden.</p>
                  )}
                </div>

                {securityError && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {securityError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmitSecurity}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl flex items-center justify-center gap-2 ${
                    canSubmitSecurity
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20'
                      : 'bg-gray-700 text-gray-500 shadow-none cursor-not-allowed'
                  }`}
                >
                  <Shield size={18} />
                  Guardar
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogoutConfirm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-sm bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 text-center">
              <div className="w-20 h-20 bg-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <LogOut size={40} className="text-purple-500" />
              </div>
              <h2 className="text-2xl font-black mb-2">Cerrar Sesion?</h2>
              <p className="text-gray-400 mb-8">Tendras que volver a iniciar sesion para entrar de nuevo.</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowLogoutConfirm(false)} className="py-4 rounded-2xl bg-white/5 font-bold hover:bg-white/10 transition-all">Cancelar</button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="py-4 rounded-2xl bg-purple-600 font-bold hover:bg-purple-500 transition-all"
                >
                  Salir
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-sm bg-white/[0.02] backdrop-blur-3xl border border-red-500/20 rounded-[3rem] p-10 text-center">
              <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-black mb-2 text-red-500">Eliminar Cuenta?</h2>
              <p className="text-gray-400 mb-8">Esto eliminara tu cuenta y la informacion vinculada de forma permanente.</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowDeleteConfirm(false)} className="py-4 rounded-2xl bg-white/5 font-bold hover:bg-white/10 transition-all">Cancelar</button>
                <button
                  onClick={async () => {
                    const success = await deleteCurrentUser();
                    if (success) {
                      navigate('/');
                    }
                  }}
                  className="py-4 rounded-2xl bg-red-600 font-bold hover:bg-red-500 transition-all"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
