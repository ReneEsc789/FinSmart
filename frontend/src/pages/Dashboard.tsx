import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Brain, Plus, Sparkles, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useApp } from '../context/AppContext';

const pieColors = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

export const Dashboard = () => {
  const navigate = useNavigate();
  const { transactions, accounts, budgets, user, prediction, advice, budgetAlerts } = useApp();
  const [showAlert, setShowAlert] = React.useState(true);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalIncome = transactions.filter((transaction) => transaction.type === 'income').reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const totalExpenses = transactions.filter((transaction) => transaction.type === 'expense').reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const budgetUsage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
  const budgetStatus = budgetUsage > 100 ? 'danger' : budgetUsage > 80 ? 'warning' : 'ok';
  const statusColor = budgetStatus === 'ok' ? 'text-green-500' : budgetStatus === 'warning' ? 'text-yellow-500' : 'text-red-500';
  const statusBg = budgetStatus === 'ok' ? 'bg-green-500/10' : budgetStatus === 'warning' ? 'bg-yellow-500/10' : 'bg-red-500/10';

  const categoryMap = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce<Record<string, number>>((accumulator, transaction) => {
      accumulator[transaction.category] = (accumulator[transaction.category] || 0) + Math.abs(transaction.amount);
      return accumulator;
    }, {});

  const categoryData = Object.entries(categoryMap).map(([name, value], index) => ({
    name,
    value,
    color: pieColors[index % pieColors.length],
  }));

  const weekdayLabels = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  const weeklyData = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - offset));
    const isoDate = date.toISOString().slice(0, 10);
    const dailyTransactions = transactions.filter((transaction) => transaction.date === isoDate);
    return {
      name: weekdayLabels[date.getDay()],
      income: dailyTransactions.filter((transaction) => transaction.type === 'income').reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0),
      expense: dailyTransactions.filter((transaction) => transaction.type === 'expense').reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0),
    };
  });

  const firstName = user?.name.split(' ')[0] ?? 'FinSmart';
  const predictionAmount = prediction?.prediccion ?? null;
  const adviceMessage = advice?.consejo ?? 'Conecta tus presupuestos para recibir recomendaciones personalizadas.';
  const alertMessage = budgetAlerts[0]?.mensaje ?? 'Sin alertas criticas por ahora.';

  return (
    <div className="min-h-screen bg-transparent text-white pb-32 pt-10 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight font-display">Hola, {firstName}</h1>
            </div>
            <p className="text-gray-400 font-medium">
              Tu salud financiera esta en un{' '}
              <span className={statusColor}>{budgetStatus === 'ok' ? 'nivel saludable' : budgetStatus === 'warning' ? 'nivel intermedio' : 'nivel critico'}</span>{' '}
              hoy.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">Saldo Total</p>
              <p className="text-4xl font-black text-white">${totalBalance.toLocaleString()}</p>
            </div>
            <button onClick={() => navigate('/transactions')} className="bg-purple-600 hover:bg-purple-500 p-4 rounded-2xl shadow-xl shadow-purple-600/30 transition-all hover:scale-110 active:scale-95">
              <Plus size={24} />
            </button>
          </div>
        </header>

        <div className={`w-full ${statusBg} border border-white/5 rounded-3xl p-4 flex items-center justify-between backdrop-blur-md`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${statusColor.replace('text', 'bg')}`} />
            <span className={`text-sm font-bold uppercase tracking-widest ${statusColor}`}>
              {budgetStatus === 'warning' ? 'Presupuesto en Riesgo' : budgetStatus === 'ok' ? 'Presupuesto Saludable' : 'Limite Excedido'}
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium">
            {totalBudget > 0 ? `Has usado ${budgetUsage.toFixed(0)}% de tus presupuestos activos` : 'Aun no tienes presupuestos configurados'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Ingresos', value: `$${totalIncome.toLocaleString()}`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: 'Gastos', value: `$${totalExpenses.toLocaleString()}`, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-500/10' },
            { label: 'Ahorro', value: `$${Math.max(totalIncome - totalExpenses, 0).toLocaleString()}`, icon: Wallet, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          ].map((stat) => (
            <motion.div key={stat.label} whileHover={{ y: -5 }} className="glass p-8 rounded-[2.5rem] relative overflow-hidden group">
              <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} blur-3xl rounded-full group-hover:scale-150 transition-transform duration-500`} />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`${stat.bg} p-4 rounded-2xl`}>
                  <stat.icon className={stat.color} size={28} />
                </div>
              </div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-1 relative z-10">{stat.label}</p>
              <p className="text-3xl font-black relative z-10">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showAlert && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="glass p-10 rounded-[3rem] relative z-10 border-purple-500/20">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-600 p-2 rounded-xl">
                        <Brain className="text-white" size={20} />
                      </div>
                      <span className="text-purple-400 font-black uppercase tracking-[0.2em] text-xs">Analisis Predictivo FinSmart</span>
                    </div>
                    <h2 className="text-4xl font-black leading-tight font-display">
                      {predictionAmount !== null ? (
                        <>
                          Proyeccion semanal: <span className="text-purple-500">${predictionAmount.toLocaleString()}</span>
                        </>
                      ) : (
                        'Todavia no hay suficientes datos para una prediccion confiable.'
                      )}
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">{prediction?.mensaje ?? 'Agrega mas movimientos y presupuestos para activar la capa de ML.'}</p>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <button onClick={() => navigate('/analysis')} className="bg-white text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-purple-500 hover:text-white transition-all">
                        Ver Analisis <ArrowRight size={20} />
                      </button>
                      <button onClick={() => setShowAlert(false)} className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-black hover:bg-white/10 transition-all">
                        Cerrar
                      </button>
                    </div>
                  </div>

                  <div className="w-full lg:w-72 space-y-4">
                    <div className="glass p-6 rounded-3xl border-green-500/20">
                      <div className="flex items-center gap-2 text-green-500 mb-2">
                        <Sparkles size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Consejo IA</span>
                      </div>
                      <p className="text-sm font-medium text-gray-300">{adviceMessage}</p>
                    </div>
                    <div className="glass p-6 rounded-3xl border-red-500/20">
                      <div className="flex items-center gap-2 text-red-500 mb-2">
                        <AlertCircle size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Alerta Presupuesto</span>
                      </div>
                      <p className="text-sm font-medium text-gray-300">{alertMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass p-10 rounded-[3rem]">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black font-display">Distribucion</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData.length > 0 ? categoryData : [{ name: 'Sin datos', value: 1, color: '#333' }]} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={8} dataKey="value">
                    {(categoryData.length > 0 ? categoryData : [{ name: 'Sin datos', value: 1, color: '#333' }]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '12px' }} itemStyle={{ color: '#fff', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem]">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black font-display">Flujo Semanal</h3>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' }} />
                  <Bar dataKey="expense" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={20} />
                  <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
