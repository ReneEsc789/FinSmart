import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Edit2,
  Minus,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';

import { useApp } from '../context/AppContext';

export const Transactions = () => {
  const { categories, accounts, transactions, addTransaction, updateTransaction, deleteTransaction } = useApp();
  const INITIAL_VISIBLE_TRANSACTIONS = 20;
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_TRANSACTIONS);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: 0,
    name: '',
    category: '',
    account: '',
    note: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const normalizeDateInput = (value: string) => value.slice(0, 10);

  const resetForm = () => {
    setEditingTransactionId(null);
    setIsAdding(false);
    setStep(1);
    setNewTransaction({
      type: 'expense',
      amount: 0,
      name: '',
      category: '',
      account: '',
      note: '',
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const handleAmountChange = (delta: number) => {
    setNewTransaction((current) => ({
      ...current,
      amount: Math.max(0, current.amount + delta),
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewTransaction((current) => ({
      ...current,
      amount: value === '' ? 0 : Number(value),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    if (editingTransactionId) {
      const success = await updateTransaction({
        id: editingTransactionId,
        name: newTransaction.name,
        category: newTransaction.category,
        amount: newTransaction.amount,
        date: newTransaction.date,
        account: newTransaction.account,
        type: newTransaction.type,
        note: newTransaction.note,
      });

      if (!success) {
        return;
      }
    } else {
      await addTransaction({
        name: newTransaction.name,
        category: newTransaction.category,
        amount: newTransaction.amount,
        date: newTransaction.date,
        account: newTransaction.account,
        type: newTransaction.type,
        note: newTransaction.note,
      });
    }

    resetForm();
  };

  const handleEditTransaction = (transaction: (typeof transactions)[number]) => {
    setEditingTransactionId(transaction.id);
    setNewTransaction({
      type: transaction.type,
      amount: Math.abs(transaction.amount),
      name: transaction.name,
      category: transaction.category,
      account: transaction.account,
      note: transaction.note ?? '',
      date: normalizeDateInput(transaction.date),
    });
    setStep(1);
    setIsAdding(true);
  };

  const amountLength = newTransaction.amount === 0 ? 1 : String(newTransaction.amount).length;
  const amountSizeClass =
    amountLength >= 10 ? 'text-[clamp(2.75rem,8vw,5rem)]' : amountLength >= 7 ? 'text-[clamp(3.5rem,9vw,6rem)]' : 'text-[clamp(4.5rem,10vw,8rem)]';

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || transaction.type === filter;
    return matchesSearch && matchesFilter;
  });

  const visibleTransactions = filteredTransactions.slice(0, visibleCount);
  const hasMoreTransactions = visibleCount < filteredTransactions.length;

  return (
    <div className="min-h-screen bg-transparent text-white pb-32 pt-10 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight font-display">Transacciones</h1>
            <p className="text-gray-400 font-medium">Cada movimiento se guarda y recalcula saldos reales</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            disabled={categories.length === 0 || accounts.length === 0}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-400 px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95"
          >
            <Plus size={20} />
            <span>Nuevo Movimiento</span>
          </button>
        </header>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o categoria..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setVisibleCount(INITIAL_VISIBLE_TRANSACTIONS);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
            />
          </div>
          <div className="flex glass rounded-2xl p-1.5">
            {(['all', 'income', 'expense'] as const).map((value) => (
              <button
                key={value}
                onClick={() => {
                  setFilter(value);
                  setVisibleCount(INITIAL_VISIBLE_TRANSACTIONS);
                }}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === value ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
                }`}
              >
                {value === 'all' ? 'Todos' : value === 'income' ? 'Ingresos' : 'Gastos'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {visibleTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className="glass p-5 rounded-3xl flex items-center gap-6 group glass-hover"
              >
                <div className={`p-4 rounded-2xl ${transaction.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {transaction.type === 'income' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-lg truncate">{transaction.name}</h3>
                    <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] text-gray-400 font-black uppercase tracking-widest border border-white/5">
                      {transaction.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 mt-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-purple-500" />
                      {transaction.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CreditCard size={14} className="text-purple-500" />
                      {transaction.account}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-xl font-black ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all mt-2">
                    <button onClick={() => handleEditTransaction(transaction)} className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => void deleteTransaction(transaction.id)}
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

          {hasMoreTransactions && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => setVisibleCount((current) => current + INITIAL_VISIBLE_TRANSACTIONS)}
                className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-black uppercase tracking-[0.18em] text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                Cargar mas
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <motion.div className="h-full bg-purple-600" initial={{ width: '0%' }} animate={{ width: `${(step / 3) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black font-display tracking-tight">{editingTransactionId ? 'Editar Registro' : 'Nuevo Registro'}</h2>
                  <p className="text-xs text-gray-500 font-black uppercase tracking-widest mt-1">Paso {step} de 3</p>
                </div>
                <button onClick={resetForm} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <form className="space-y-8" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <div className="bg-white/5 p-1.5 rounded-2xl flex gap-2 border border-white/5">
                        <button
                          type="button"
                          onClick={() => setNewTransaction((current) => ({ ...current, type: 'expense' }))}
                          className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                            newTransaction.type === 'expense' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500 hover:text-white'
                          }`}
                        >
                          Gasto
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewTransaction((current) => ({ ...current, type: 'income' }))}
                          className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                            newTransaction.type === 'income' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-gray-500 hover:text-white'
                          }`}
                        >
                          Ingreso
                        </button>
                      </div>

                      <div className="text-center space-y-4 py-8">
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black">Monto del movimiento</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 min-w-0">
                          <span className={`text-5xl font-black transition-colors ${newTransaction.type === 'expense' ? 'text-red-500/50' : 'text-green-500/50'}`}>$</span>
                          <div className="flex items-center justify-center gap-4 sm:gap-6 w-full min-w-0">
                            <input
                              type="number"
                              required
                              autoFocus
                              value={newTransaction.amount === 0 ? '' : newTransaction.amount}
                              placeholder="0"
                              onChange={handleInputChange}
                              className={`${amountSizeClass} font-black tracking-tighter bg-transparent border-none focus:outline-none w-full max-w-[26rem] min-w-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors ${
                                newTransaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
                              }`}
                            />
                            <div className="flex flex-col gap-2 shrink-0">
                              <button type="button" onClick={() => handleAmountChange(100)} className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors">
                                <Plus size={20} />
                              </button>
                              <button type="button" onClick={() => handleAmountChange(-100)} className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors">
                                <Minus size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Categoria</label>
                          <div className="grid grid-cols-3 gap-3">
                            {categories.map((category) => (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() => setNewTransaction({ ...newTransaction, category: category.nombre })}
                                className={`glass p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border relative ${
                                  newTransaction.category === category.nombre ? 'border-purple-500 bg-purple-500/20 scale-105' : 'border-white/5 hover:bg-white/10'
                                }`}
                              >
                                {newTransaction.category === category.nombre && (
                                  <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-0.5">
                                    <Check size={10} className="text-white" />
                                  </div>
                                )}
                                <span className="text-2xl">{category.icono}</span>
                                <span className="text-[8px] font-black uppercase tracking-widest truncate w-full text-center">{category.nombre}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Cuenta</label>
                          <div className="space-y-3">
                            {accounts.map((account) => (
                              <button
                                key={account.id}
                                type="button"
                                onClick={() => setNewTransaction({ ...newTransaction, account: account.name })}
                                className={`w-full glass p-5 rounded-2xl flex items-center justify-between transition-all border relative ${
                                  newTransaction.account === account.name ? 'border-purple-500 bg-purple-500/20' : 'border-white/5 hover:bg-white/10'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${account.color}`} />
                                  <span className="font-black text-sm">{account.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-gray-500 font-bold">${account.balance.toLocaleString()}</span>
                                  {newTransaction.account === account.name && (
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
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Concepto</label>
                          <div className="relative">
                            <Edit2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                              type="text"
                              required
                              autoFocus
                              value={newTransaction.name}
                              onChange={(event) => setNewTransaction({ ...newTransaction, name: event.target.value })}
                              placeholder="Ej: Cena con amigos"
                              className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium text-lg"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Fecha</label>
                          <input
                            type="date"
                            required
                            value={newTransaction.date}
                            onChange={(event) => setNewTransaction({ ...newTransaction, date: event.target.value })}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium text-lg"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Nota</label>
                        <textarea
                          value={newTransaction.note}
                          onChange={(event) => setNewTransaction({ ...newTransaction, note: event.target.value })}
                          placeholder="Escribe algo opcional..."
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 h-40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium resize-none text-lg"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4 pt-4">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep((current) => current - 1)}
                      className="flex-1 py-5 rounded-2xl bg-white/5 hover:bg-white/10 font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2"
                    >
                      <ChevronLeft size={18} /> Atras
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
                      <>
                        {editingTransactionId ? 'Guardar' : 'Finalizar'} <Check size={18} />
                      </>
                    ) : (
                      <>
                        Siguiente <ChevronRight size={18} />
                      </>
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
