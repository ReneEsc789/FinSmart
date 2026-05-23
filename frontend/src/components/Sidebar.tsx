import { motion } from 'framer-motion';
import {
  ArrowLeftRight,
  Bell,
  LayoutDashboard,
  LogOut,
  Sparkles,
  User,
  Wallet,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useApp } from '../context/AppContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useApp();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', hint: 'Resumen general' },
    { to: '/accounts', icon: Wallet, label: 'Cuentas', hint: 'Presupuestos y saldos' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transacciones', hint: 'Movimientos diarios' },
    { to: '/analysis', icon: Sparkles, label: 'Analisis IA', hint: 'Prediccion y consejos' },
    { to: '/alerts', icon: Bell, label: 'Alertas', hint: 'Seguimiento activo' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-24 lg:w-80 z-50 transition-all duration-500 ease-in-out">
      <div className="relative h-full overflow-hidden bg-[linear-gradient(180deg,rgba(18,8,28,0.94)_0%,rgba(13,9,25,0.98)_55%,rgba(11,10,18,1)_100%)] backdrop-blur-3xl border-r border-white/10 flex flex-col p-6">
        <div className="absolute inset-x-6 top-8 h-28 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 top-1/3 w-32 h-32 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />

        <div className="relative mb-8">
          <div className="glass rounded-4xl p-4 lg:p-5 overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 p-3 rounded-2xl shadow-2xl shadow-purple-600/40 shrink-0">
                <span className="text-white text-2xl font-black tracking-tighter">$</span>
              </div>
              <div className="hidden lg:block min-w-0">
                <h1 className="text-2xl font-black tracking-tighter text-white font-display">
                  Fin<span className="text-purple-500">Smart</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500 font-black mt-1">Control Financiero</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block mb-4 px-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-black">Navegacion</p>
        </div>

        <nav className="flex-1 space-y-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative group flex items-center gap-4 p-4 rounded-[1.6rem] transition-all duration-300 overflow-hidden ${
                  isActive
                    ? 'text-white shadow-[0_18px_40px_rgba(139,92,246,0.28)]'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-shell"
                      className="absolute inset-0 rounded-[1.6rem] bg-[#8b5cf6]"
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.6 }}
                    />
                  )}
                  {isActive && <div className="absolute inset-px rounded-[1.55rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01))]" />}
                  <div className={`relative z-10 w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${isActive ? 'bg-white/12' : 'bg-white/0 group-hover:bg-white/5'}`}>
                    <item.icon size={22} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                  </div>
                  <div className="relative z-10 hidden lg:block min-w-0">
                    <p className="font-black text-sm">{item.label}</p>
                    <p className={`text-[11px] mt-1 ${isActive ? 'text-white/75' : 'text-gray-500 group-hover:text-gray-300'}`}>{item.hint}</p>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-dot"
                      className="relative z-10 ml-auto w-2.5 h-2.5 bg-white rounded-full hidden lg:block"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="pt-6 mt-auto border-t border-white/5 space-y-4 pb-14">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `group flex items-center gap-4 p-4 rounded-[1.6rem] transition-all duration-300 ${
                isActive ? 'text-white bg-white/7 border border-white/10' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
              <User size={22} />
            </div>
            <div className="hidden lg:block min-w-0">
              <p className="font-black text-sm">Mi Perfil</p>
              <p className="text-[11px] text-gray-500 group-hover:text-gray-300 mt-1 wrap-break-word">{user?.name ?? 'Cuenta'}</p>
            </div>
          </NavLink>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-4 p-4 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-[1.6rem] transition-all duration-300 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-red-500/5 flex items-center justify-center shrink-0">
              <LogOut size={22} className="group-hover:-translate-x-1 transition-transform text-red-500/70" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="font-black text-sm text-red-500/80">Salir</p>
              <p className="text-[11px] text-gray-600 mt-1">Salir de tu cuenta</p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};
