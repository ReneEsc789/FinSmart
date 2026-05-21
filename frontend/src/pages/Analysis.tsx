import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, BarChart3, BrainCircuit, Lightbulb, Sparkles, Trash2, TrendingUp, X } from 'lucide-react';

import { useApp } from '../context/AppContext';

export const Analysis = () => {
  const { transactions, prediction, advice, budgets, goals, addGoal, deleteGoal } = useApp();
  const [isAddingGoal, setIsAddingGoal] = React.useState(false);
  const [selectedTip, setSelectedTip] = React.useState<{ title: string; detail: string } | null>(null);
  const [newGoal, setNewGoal] = React.useState({ name: '', target: 0, current: 0, color: '#8B5CF6' });

  const weeklyExpenses = Array.from({ length: 4 }, (_, index) => {
    const start = new Date();
    start.setDate(start.getDate() - (27 - index * 7));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const total = transactions
      .filter((transaction) => {
        const currentDate = new Date(transaction.date);
        return transaction.type === 'expense' && currentDate >= start && currentDate <= end;
      })
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    return {
      name: `Sem ${index + 1}`,
      actual: total,
      predicted: index === 3 ? prediction?.prediccion ?? total : null,
    };
  });

  const handleAddGoal = async (event: React.FormEvent) => {
    event.preventDefault();
    const success = await addGoal(newGoal);
    if (success) {
      setIsAddingGoal(false);
      setNewGoal({ name: '', target: 0, current: 0, color: '#8B5CF6' });
    }
  };

  const topBudgets = budgets
    .map((budget) => ({
      title: budget.category,
      desc: `Llevas $${budget.spent.toLocaleString()} gastados de un limite de $${budget.limit.toLocaleString()}.`,
      detail: `Tu presupuesto de ${budget.category} tiene un uso del ${budget.limit > 0 ? Math.round((budget.spent / budget.limit) * 100) : 0}%.`,
    }))
    .slice(0, 2);

  const tips = [
    advice?.consejo
      ? {
          title: advice.categoriaNombre ? `Oportunidad en ${advice.categoriaNombre}` : 'Consejo principal',
          desc: advice.consejo,
          detail: advice.mensaje ? `${advice.mensaje}. ${advice.consejo}` : advice.consejo,
        }
      : null,
    ...topBudgets,
  ].filter(Boolean) as { title: string; desc: string; detail: string }[];

  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-white pb-32 pt-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="flex flex-col sm:flex-row sm:items-center gap-6 min-w-0">
          <div className="bg-purple-600 p-4 rounded-2xl shadow-2xl shadow-purple-600/40 shrink-0">
            <BrainCircuit size={32} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-4xl font-black tracking-tight font-display">Analisis IA</h1>
            <p className="text-gray-400 font-medium break-words">Lectura real de tus movimientos, metas y presupuestos conectados.</p>
          </div>
        </header>

        <section className="glass p-6 sm:p-10 rounded-[3rem] overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <h2 className="text-2xl font-black flex items-center gap-3 font-display">
              <BarChart3 className="text-purple-500" size={28} />
              Prediccion de Gastos
            </h2>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyExpenses}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '12px' }} itemStyle={{ color: '#fff', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2} strokeDasharray="8 8" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-10 p-6 sm:p-8 bg-purple-600/10 border border-purple-500/20 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 overflow-hidden">
            <div className="bg-purple-600 p-4 rounded-2xl shadow-xl shadow-purple-600/30 shrink-0">
              <Sparkles className="text-white" size={32} />
            </div>
            <div className="flex-1 min-w-0 text-center md:text-left">
              <p className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-2">Resumen</p>
              <p className="text-xl text-gray-200 leading-relaxed break-words">
                {prediction?.mensaje ?? 'Aun no hay suficientes datos para una prediccion robusta.'}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 space-y-6 overflow-hidden">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Lightbulb className="text-yellow-500" />
              Consejos de Ahorro
            </h3>
            <div className="space-y-4">
              {tips.length > 0 ? (
                tips.map((tip) => (
                  <div key={tip.title} onClick={() => setSelectedTip(tip)} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group cursor-pointer overflow-hidden">
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <p className="font-bold text-sm group-hover:text-purple-400 transition-colors break-words min-w-0">{tip.title}</p>
                      <ArrowRight size={16} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed break-words">{tip.desc}</p>
                  </div>
                ))
              ) : (
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-sm text-gray-400">
                  Agrega presupuestos y movimientos para recibir recomendaciones concretas.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 space-y-6 overflow-hidden">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-purple-500" />
              Metas Financieras
            </h3>
            <div className="space-y-6">
              {goals.map((goal) => {
                const percent = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-start justify-between gap-4 text-sm">
                      <span className="font-bold break-words min-w-0">{goal.name}</span>
                      <div className="flex items-start gap-3 shrink-0">
                        <span className="text-gray-500 text-right">
                          ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => void deleteGoal(goal.id)}
                          className="p-1.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          aria-label={`Eliminar meta ${goal.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: goal.color }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 text-right font-bold uppercase tracking-widest">{Math.round(percent)}% completado</p>
                  </div>
                );
              })}
              {goals.length === 0 && (
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-sm text-gray-400">
                  Crea una meta para darle seguimiento real desde tu cuenta y verla disponible cada vez que regreses.
                </div>
              )}
              <button onClick={() => setIsAddingGoal(true)} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 hover:text-white transition-all font-bold text-sm">
                + Crear Nueva Meta
              </button>
            </div>
          </div>
        </section>

        <AnimatePresence>
          {selectedTip && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTip(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-6 sm:p-10 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-4 rounded-2xl bg-yellow-500/10 text-yellow-500 shrink-0">
                      <Lightbulb size={24} />
                    </div>
                    <h2 className="text-2xl font-black font-display tracking-tight break-words">Consejo IA</h2>
                  </div>
                  <button onClick={() => setSelectedTip(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors shrink-0">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6 min-w-0">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white break-words">{selectedTip.title}</h3>
                    <p className="text-gray-400 leading-relaxed break-words">{selectedTip.detail}</p>
                  </div>
                  <button onClick={() => setSelectedTip(null)} className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                    Entendido
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {isAddingGoal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingGoal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-6 sm:p-10 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <h2 className="text-2xl font-black font-display tracking-tight break-words">Nueva Meta</h2>
                  <button onClick={() => setIsAddingGoal(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors shrink-0">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleAddGoal} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Nombre</label>
                    <input value={newGoal.name} required onChange={(event) => setNewGoal({ ...newGoal, name: event.target.value })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Monto Meta</label>
                      <input type="number" min="1" required value={newGoal.target === 0 ? '' : newGoal.target} onChange={(event) => setNewGoal({ ...newGoal, target: event.target.value === '' ? 0 : Number(event.target.value) })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Monto Actual</label>
                      <input type="number" min="0" value={newGoal.current === 0 ? '' : newGoal.current} onChange={(event) => setNewGoal({ ...newGoal, current: event.target.value === '' ? 0 : Number(event.target.value) })} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Color</label>
                    <input type="color" value={newGoal.color} onChange={(event) => setNewGoal({ ...newGoal, color: event.target.value })} className="h-14 w-full bg-white/5 border border-white/5 rounded-2xl p-3" />
                  </div>
                  <button type="submit" className="w-full py-5 rounded-2xl bg-purple-600 hover:bg-purple-500 font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-purple-600/20">
                    Crear Meta
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
