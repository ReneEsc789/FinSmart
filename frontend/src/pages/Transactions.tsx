import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  CreditCard,
  Trash2,
  Edit2,
  Minus,
  ChevronRight,
  ChevronLeft,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Transactions = () => {
  const { 
    categories, 
    accounts, 
    transactions, 
    addTransaction, 
    deleteTransaction 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [step, setStep] = useState(1);
  
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: 0,
    name: '',
    category: '',
    account: '',
    note: ''
  });

  const handleAmountChange = (delta: number) => {
    setNewTransaction(prev => ({
      ...prev,
      amount: Math.max(0, prev.amount + delta)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Remove leading zeros and handle empty string
    const numericVal = val === '' ? 0 : Number(val.replace(/^0+/, ''));
    setNewTransaction(prev => ({ ...prev, amount: numericVal }));
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    const transaction = {
      id: Date.now(),
      name: newTransaction.name,
      category: newTransaction.category,
      amount: newTransaction.type === 'expense' ? -newTransaction.amount : newTransaction.amount,
      date: new Date().toISOString().split('T')[0],
      account: newTransaction.account,
      type: newTransaction.type,
      note: newTransaction.note
    };
    
    addTransaction(transaction);
    setIsAdding(false);
    setStep(1);
    setNewTransaction({
      type: 'expense',
      amount: 0,
      name: '',
      category: '',
      account: '',
      note: ''
    });
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || t.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-transparent text-white pb-32 pt-10 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight font-display">Transacciones</h1>
            <p className="text-gray-400 font-medium">Gestiona tus movimientos financieros con precisión</p>
          </div>
          <button 
            onClick={() => {
              setIsAdding(true);
              setStep(1);
            }}
            className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95"
          >
            <Plus size={20} />
            <span>Nuevo Movimiento</span>
          </button>
        </header>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
            />
          </div>
          <div className="flex glass rounded-2xl p-1.5">
            {(['all', 'income', 'expense'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'income' ? 'Ingresos' : 'Gastos'}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className="glass p-5 rounded-3xl flex items-center gap-6 group glass-hover"
              >
                <div className={`p-4 rounded-2xl ${t.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {t.type === 'income' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-lg truncate">{t.name}</h3>
                    <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] text-gray-400 font-black uppercase tracking-widest border border-white/5">
                      {t.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 mt-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-purple-500" />
                      {t.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CreditCard size={14} className="text-purple-500" />
                      {t.account}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-xl font-black ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}
                  </p>
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all mt-2">
                    <button className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"><Edit2 size={16} /></button>
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <p className="text-gray-500">No se encontraron transacciones</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <motion.div 
                  className="h-full bg-purple-600"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black font-display tracking-tight">Nuevo Registro</h2>
                  <p className="text-xs text-gray-500 font-black uppercase tracking-widest mt-1">Paso {step} de 3</p>
                </div>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <form className="space-y-8" onSubmit={handleAddTransaction}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      {/* Type Selector */}
                      <div className="bg-white/5 p-1.5 rounded-2xl flex gap-2 border border-white/5">
                        <button 
                          type="button" 
                          onClick={() => setNewTransaction(prev => ({ ...prev, type: 'expense' }))}
                          className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                            newTransaction.type === 'expense' 
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                            : 'text-gray-500 hover:text-white'
                          }`}
                        >
                          Gasto
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setNewTransaction(prev => ({ ...prev, type: 'income' }))}
                          className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                            newTransaction.type === 'income' 
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                            : 'text-gray-500 hover:text-white'
                          }`}
                        >
                          Ingreso
                        </button>
                      </div>

                      {/* Amount Display */}
                      <div className="text-center space-y-4 py-8">
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black">
                          Monto del {newTransaction.type === 'expense' ? 'gasto' : 'ingreso'}
                        </p>
                        <div className="flex items-center justify-center gap-4">
                          <span className={`text-5xl font-black transition-colors ${
                            newTransaction.type === 'expense' ? 'text-red-500/50' : 'text-green-500/50'
                          }`}>$</span>
                          <div className="flex items-center gap-6">
                            <input 
                              type="number"
                              required
                              autoFocus
                              value={newTransaction.amount === 0 ? '' : newTransaction.amount}
                              placeholder="0"
                              onChange={handleInputChange}
                              className={`text-8xl font-black tracking-tighter bg-transparent border-none focus:outline-none w-64 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors ${
                                newTransaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
                              }`}
                            />
                            <div className="flex flex-col gap-2">
                              <button 
                                type="button" 
                                onClick={() => handleAmountChange(100)}
                                className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors"
                              >
                                <Plus size={20} />
                              </button>
                              <button 
                                type="button" 
                                onClick={() => handleAmountChange(-100)}
                                className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors"
                              >
                                <Minus size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Categoría</label>
                          <div className="grid grid-cols-3 gap-3">
                            {categories.map(cat => (
                              <button
                                key={cat.nombre}
                                type="button"
                                onClick={() => setNewTransaction({...newTransaction, category: cat.nombre})}
                                className={`glass p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border relative ${
                                  newTransaction.category === cat.nombre 
                                  ? 'border-purple-500 bg-purple-500/20 scale-105' 
                                  : 'border-white/5 hover:bg-white/10'
                                }`}
                              >
                                {newTransaction.category === cat.nombre && (
                                  <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-0.5">
                                    <Check size={10} className="text-white" />
                                  </div>
                                )}
                                <span className="text-2xl">{cat.icono}</span>
                                <span className="text-[8px] font-black uppercase tracking-widest truncate w-full text-center">{cat.nombre}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Cuenta de Origen</label>
                          <div className="space-y-3">
                            {accounts.map(acc => (
                              <button
                                key={acc.name}
                                type="button"
                                onClick={() => setNewTransaction({...newTransaction, account: acc.name})}
                                className={`w-full glass p-5 rounded-2xl flex items-center justify-between transition-all border relative ${
                                  newTransaction.account === acc.name 
                                  ? 'border-purple-500 bg-purple-500/20' 
                                  : 'border-white/5 hover:bg-white/10'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${acc.color}`} />
                                  <span className="font-black text-sm">{acc.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-gray-500 font-bold">${acc.balance.toLocaleString()}</span>
                                  {newTransaction.account === acc.name && (
                                    <div className="bg-purple-500 rounded-full p-0.5">
                                      <Check size={10} className="text-white" />
                                    </div>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Concepto / Nombre</label>
                        <div className="relative">
                          <Edit2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input 
                            type="text" 
                            required
                            autoFocus
                            value={newTransaction.name}
                            onChange={(e) => setNewTransaction({...newTransaction, name: e.target.value})}
                            placeholder="Ej: Cena con amigos" 
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium text-lg" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Nota Adicional</label>
                        <textarea 
                          value={newTransaction.note}
                          onChange={(e) => setNewTransaction({...newTransaction, note: e.target.value})}
                          placeholder="Escribe algo opcional..." 
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 h-40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium resize-none text-lg"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-4">
                  {step > 1 && (
                    <button 
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 py-5 rounded-2xl bg-white/5 hover:bg-white/10 font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2"
                    >
                      <ChevronLeft size={18} /> Atrás
                    </button>
                  )}
                  <button 
                    type="submit" 
                    disabled={step === 2 && (!newTransaction.category || !newTransaction.account)}
                    className={`flex-[2] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl flex items-center justify-center gap-2 ${
                      step === 2 && (!newTransaction.category || !newTransaction.account)
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20 active:scale-95'
                    }`}
                  >
                    {step === 3 ? (
                      <>Finalizar <Check size={18} /></>
                    ) : (
                      <>Siguiente <ChevronRight size={18} /></>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
