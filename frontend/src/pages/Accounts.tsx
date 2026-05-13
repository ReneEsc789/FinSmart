import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Target, 
  AlertTriangle,
  PiggyBank,
  X,
  CreditCard,
  Banknote,
  Coins,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const accountTypes = ['Débito', 'Crédito', 'Ahorro', 'Efectivo'];

export const Accounts = () => {
  const { 
    categories, 
    accounts, 
    budgets, 
    addCategory, 
    deleteCategory, 
    addAccount, 
    deleteAccount 
  } = useApp();

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  const [newCategory, setNewCategory] = useState({
    nombre: '',
    icono: '📂',
    color: '#8b5cf6',
    limit: 0
  });

  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'Débito',
    balance: 0
  });

  const customCategoriesCount = categories.filter(c => !c.es_default).length;
  // Initial accounts are 2, so we allow 3 more.
  const customAccountsCount = accounts.length - 2;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const success = addCategory({ 
      nombre: newCategory.nombre, 
      icono: newCategory.icono, 
      color: newCategory.color, 
      es_default: false,
      limit: newCategory.limit 
    });
    
    if (success) {
      setIsAddingCategory(false);
      setNewCategory({ nombre: '', icono: '📂', color: '#8b5cf6', limit: 0 });
    } else {
      alert('Has alcanzado el límite de 3 categorías personalizadas.');
    }
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const colors = {
      'Débito': 'bg-blue-600',
      'Crédito': 'bg-red-600',
      'Ahorro': 'bg-green-600',
      'Efectivo': 'bg-purple-600'
    };
    const success = addAccount({ 
      name: newAccount.name, 
      type: newAccount.type, 
      balance: newAccount.balance,
      color: colors[newAccount.type as keyof typeof colors] || 'bg-gray-600'
    });

    if (success) {
      setIsAddingAccount(false);
      setNewAccount({ name: '', type: 'Débito', balance: 0 });
    } else {
      alert('Has alcanzado el límite de 3 cuentas adicionales.');
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white pb-32 pt-10 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight font-display">Cuentas</h1>
            <p className="text-gray-400 font-medium">Planifica tus gastos y gestiona tus bolsillos</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAddingCategory(true)}
              disabled={customCategoriesCount >= 3}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg ${
                customCategoriesCount >= 3 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20'
              }`}
            >
              <Plus size={18} /> {customCategoriesCount >= 3 ? 'Límite alcanzado' : 'Nueva Categoría'}
            </button>
          </div>
        </header>

        {/* Accounts Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black flex items-center gap-3 font-display">
              <PiggyBank className="text-purple-500" size={28} />
              Mis Cuentas
            </h2>
            <button 
              onClick={() => setIsAddingAccount(true)}
              disabled={customAccountsCount >= 3}
              className={`text-sm font-black flex items-center gap-2 uppercase tracking-widest transition-colors ${
                customAccountsCount >= 3 ? 'text-gray-600 cursor-not-allowed' : 'text-purple-500 hover:text-purple-400'
              }`}
            >
              <Plus size={18} /> {customAccountsCount >= 3 ? 'Límite 3/3' : 'Nueva Cuenta'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accounts.map((acc) => (
              <motion.div 
                key={acc.name}
                whileHover={{ y: -5 }}
                className="glass p-8 rounded-[2.5rem] relative overflow-hidden group glass-hover"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${acc.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                <div className="flex justify-between items-start relative z-10">
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-2">{acc.type}</p>
                  <button 
                    onClick={() => deleteAccount(acc.name)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
                <h3 className="text-xl font-black mb-6 relative z-10">{acc.name}</h3>
                <p className="text-3xl font-black relative z-10">${acc.balance.toLocaleString()}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Budgets Section */}
        <section className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black flex items-center gap-3 font-display">
              <Target className="text-purple-500" size={28} />
              Límites por Categoría
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {budgets.map((b) => {
              const percent = (b.spent / b.limit) * 100;
              const isCritical = percent > 90;
              
              return (
                <div key={b.category} className="glass p-8 rounded-[2.5rem] glass-hover">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg text-2xl" style={{ backgroundColor: `${b.color}20` }}>
                        {b.icono || '📂'}
                      </div>
                      <div>
                        <h3 className="text-xl font-black">{b.category}</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Límite: ${b.limit.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-left md:text-right">
                        <p className={`text-2xl font-black ${isCritical ? 'text-red-500' : 'text-white'}`}>
                          ${b.spent.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">{Math.round(percent)}% utilizado</p>
                      </div>
                      <button 
                        onClick={() => deleteCategory(b.category)}
                        className="p-3 hover:bg-red-500/10 rounded-2xl text-gray-500 hover:text-red-500 transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      className="h-full rounded-full shadow-lg"
                      style={{ backgroundColor: isCritical ? '#ef4444' : b.color }}
                    />
                  </div>
                  {isCritical && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                      <AlertTriangle size={14} />
                      <span>¡Cuidado! Estás por superar el límite</span>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* New Budget Button */}
        <button 
          onClick={() => setIsAddingCategory(true)}
          disabled={customCategoriesCount >= 3}
          className={`w-full py-6 border-2 border-dashed rounded-3xl transition-all flex flex-col items-center gap-2 ${
            customCategoriesCount >= 3 
            ? 'border-white/5 text-gray-700 cursor-not-allowed' 
            : 'border-white/10 text-gray-500 hover:text-white hover:border-purple-500/50'
          }`}
        >
          <Plus size={32} />
          <span className="font-bold">{customCategoriesCount >= 3 ? 'Límite de categorías alcanzado' : 'Agregar nuevo límite'}</span>
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isAddingCategory && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingCategory(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white/2 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black font-display tracking-tight">Nueva Categoría</h2>
                <button onClick={() => setIsAddingCategory(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddCategory} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Icono (Emoji)</label>
                    <input 
                      type="text" 
                      required
                      maxLength={2}
                      value={newCategory.icono}
                      onChange={(e) => setNewCategory({...newCategory, icono: e.target.value})}
                      placeholder="📂"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium text-center text-2xl"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Nombre</label>
                    <input 
                      type="text" 
                      required
                      value={newCategory.nombre}
                      onChange={(e) => setNewCategory({...newCategory, nombre: e.target.value})}
                      placeholder="Ej: Gimnasio"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Límite Mensual</label>
                  <input 
                    type="number" 
                    required
                    value={newCategory.limit === 0 ? '' : newCategory.limit}
                    onChange={(e) => {
                      const val = e.target.value;
                      const numericVal = val === '' ? 0 : Number(val.replace(/^0+/, ''));
                      setNewCategory({...newCategory, limit: numericVal});
                    }}
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Sugerencias Predeterminadas</label>
                  <div className="grid grid-cols-4 gap-3">
                    {categories.filter(c => c.es_default).map((cat) => (
                      <button
                        key={cat.nombre}
                        type="button"
                        onClick={() => setNewCategory({
                          ...newCategory,
                          nombre: cat.nombre,
                          icono: cat.icono,
                          color: cat.color
                        })}
                        className={`glass p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border ${
                          newCategory.nombre === cat.nombre 
                          ? 'border-purple-500 bg-purple-500/20 scale-105' 
                          : 'border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-2xl">{cat.icono}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest truncate w-full text-center">{cat.nombre}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 rounded-2xl bg-purple-600 hover:bg-purple-500 font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-purple-600/20"
                >
                  Crear Categoría
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isAddingAccount && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingAccount(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white/2 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black font-display tracking-tight">Nueva Cuenta</h2>
                <button onClick={() => setIsAddingAccount(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddAccount} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Nombre de la Cuenta</label>
                  <input 
                    type="text" 
                    required
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                    placeholder="Ej: Nómina Santander"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Tipo</label>
                    <select 
                      value={newAccount.type}
                      onChange={(e) => setNewAccount({...newAccount, type: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium appearance-none"
                    >
                      {accountTypes.map(type => (
                        <option key={type} value={type} className="bg-[#0a0a0c]">{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Saldo Inicial</label>
                    <input 
                      type="number" 
                      required
                      value={newAccount.balance === 0 ? '' : newAccount.balance}
                      onChange={(e) => {
                        const val = e.target.value;
                        const numericVal = val === '' ? 0 : Number(val.replace(/^0+/, ''));
                        setNewAccount({...newAccount, balance: numericVal});
                      }}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {accountTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAccount({...newAccount, type})}
                      className={`glass p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border ${
                        newAccount.type === type 
                        ? 'border-purple-500 bg-purple-500/20 scale-105' 
                        : 'border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {type === 'Débito' && <CreditCard size={20} className="text-blue-500" />}
                      {type === 'Crédito' && <CreditCard size={20} className="text-red-500" />}
                      {type === 'Ahorro' && <Banknote size={20} className="text-green-500" />}
                      {type === 'Efectivo' && <Coins size={20} className="text-purple-500" />}
                      <span className="text-[8px] font-black uppercase tracking-widest">{type}</span>
                    </button>
                  ))}
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 rounded-2xl bg-purple-600 hover:bg-purple-500 font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-purple-600/20"
                >
                  Crear Cuenta
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
