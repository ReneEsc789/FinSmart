import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Sparkles, 
  Bell, 
  User,
  LogOut,
  Wallet,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/accounts', icon: Wallet, label: 'Cuentas' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transacciones' },
    { to: '/analysis', icon: Sparkles, label: 'Análisis IA' },
    { to: '/alerts', icon: Bell, label: 'Alertas' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 lg:w-72 z-50 transition-all duration-500 ease-in-out">
      <div className="h-full bg-white/2 backdrop-blur-3xl border-r border-white/10 flex flex-col p-6">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-16 px-2">
          <div className="bg-purple-600 p-3 rounded-2xl shadow-2xl shadow-purple-600/40 shrink-0">
            <span className="text-white text-2xl font-black tracking-tighter">$</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white hidden lg:block font-display">
            Fin<span className="text-purple-500">Smart</span>
          </h1>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                relative group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300
                ${isActive 
                  ? 'text-white bg-[#8b5cf6] shadow-lg shadow-purple-600/30' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={24} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                  <span className="font-bold text-sm hidden lg:block">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-dot"
                      className="absolute right-4 w-2 h-2 bg-white rounded-full hidden lg:block"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Footer Links */}
        <div className="pt-6 border-t border-white/5 space-y-4">
          <NavLink
            to="/profile"
            className={({ isActive }) => `
              flex items-center gap-4 p-4 rounded-2xl transition-all duration-300
              ${isActive ? 'text-white bg-white/5' : 'text-gray-500 hover:text-white hover:bg-white/5'}
            `}
          >
            <User size={24} />
            <span className="font-bold text-sm hidden lg:block">Mi Perfil</span>
          </NavLink>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-4 p-4 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all duration-300 group"
          >
            <LogOut size={24} className="group-hover:-translate-x-1 transition-transform text-red-500/70" />
            <span className="font-bold text-sm hidden lg:block text-red-500/70">Salir</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
