import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Brain,
  CalendarRange,
  Coins,
  Plus,
  Sparkles,
  Target,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useApp } from '../context/AppContext';

const pieColors = ['#8b5cf6', '#ec4899', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

const weekdayLabels = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatChartValue = (value: number | string | null | undefined) =>
  typeof value === 'number' ? `$${formatCurrency(value)}` : '$0.00';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { transactions, accounts, budgets, user, prediction, advice, budgetAlerts } = useApp();
  const [showAlert, setShowAlert] = React.useState(true);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const savings = totalIncome - totalExpenses;
  const budgetUsage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
  const budgetStatus = budgetUsage > 100 ? 'danger' : budgetUsage > 80 ? 'warning' : 'ok';
  const statusColor = budgetStatus === 'ok' ? 'text-green-400' : budgetStatus === 'warning' ? 'text-yellow-400' : 'text-red-400';
  const statusBg = budgetStatus === 'ok' ? 'bg-green-500/10' : budgetStatus === 'warning' ? 'bg-yellow-500/10' : 'bg-red-500/10';

  const categoryMap = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce<Record<string, number>>((accumulator, transaction) => {
      accumulator[transaction.category] = (accumulator[transaction.category] || 0) + Math.abs(transaction.amount);
      return accumulator;
    }, {});

  const categoryData = Object.entries(categoryMap)
    .map(([name, value], index) => ({
      name,
      value,
      color: pieColors[index % pieColors.length],
      percent: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const highlightedCategory = categoryData[0];

  const weeklyData = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - offset));
    const isoDate = date.toISOString().slice(0, 10);
    const dailyTransactions = transactions.filter((transaction) => transaction.date === isoDate);
    const income = dailyTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const expense = dailyTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    return {
      name: weekdayLabels[date.getDay()],
      fullDate: isoDate,
      income,
      expense,
      net: income - expense,
    };
  });

  const strongestExpenseDay = weeklyData.reduce(
    (highest, current) => (current.expense > highest.expense ? current : highest),
    weeklyData[0] ?? { name: '-', expense: 0, income: 0, net: 0, fullDate: '' },
  );
  const activeDays = weeklyData.filter((day) => day.expense > 0 || day.income > 0).length;
  const weeklyNet = weeklyData.reduce((sum, day) => sum + day.net, 0);

  const mostCommittedBudget = budgets
    .map((budget) => ({
      ...budget,
      usage: budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0,
    }))
    .sort((a, b) => b.usage - a.usage)[0];

  const firstName = user?.name.split(' ')[0] ?? 'FinSmart';
  const predictionAmount = prediction?.prediccion ?? null;
  const adviceMessage = advice?.consejo ?? 'Agrega mas presupuesto y movimientos para recibir sugerencias mas concretas.';
  const alertMessage = budgetAlerts[0]?.mensaje ?? 'No hay alertas urgentes por ahora.';

  const summaryCards = [
    {
      label: 'Saldo disponible',
      value: `$${formatCurrency(totalBalance)}`,
      helper: accounts.length > 0 ? `${accounts.length} cuentas conectadas` : 'Sin cuentas registradas',
      icon: Wallet,
      color: 'text-white',
      bg: 'bg-white/8',
    },
    {
      label: 'Gasto acumulado',
      value: `$${formatCurrency(totalExpenses)}`,
      helper: totalIncome > 0 ? `${Math.round((totalExpenses / totalIncome) * 100)}% de tus ingresos` : 'Todavia sin ingresos registrados',
      icon: TrendingDown,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      label: 'Ahorro estimado',
      value: `${savings >= 0 ? '+' : '-'}$${formatCurrency(Math.abs(savings))}`,
      helper: savings >= 0 ? 'Vas cerrando con margen positivo' : 'Estas gastando mas de lo que entra',
      icon: Coins,
      color: savings >= 0 ? 'text-emerald-400' : 'text-red-400',
      bg: savings >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10',
    },
    {
      label: 'Categoria dominante',
      value: highlightedCategory?.name ?? 'Sin datos',
      helper: highlightedCategory ? `${Math.round(highlightedCategory.percent)}% del gasto total` : 'Aun no hay suficientes gastos',
      icon: Target,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-white pb-32 pt-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
          <div className="space-y-3 min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.32em] text-purple-300">
              <Sparkles size={14} />
              Panel de hoy
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight font-display break-words">Hola, {firstName}</h1>
            <p className="max-w-3xl text-gray-300 text-base sm:text-lg leading-relaxed">
              Hoy tu panorama financiero se ve{' '}
              <span className={statusColor}>
                {budgetStatus === 'ok' ? 'estable' : budgetStatus === 'warning' ? 'bajo presion' : 'delicado'}
              </span>
              . El tablero te resume en que se fue tu dinero, que categoria pesa mas y donde conviene actuar primero.
            </p>
          </div>

          <div className="w-full xl:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 min-w-[15rem]">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.28em] font-black mb-2">Saldo total</p>
              <p className="text-3xl font-black text-white">${formatCurrency(totalBalance)}</p>
            </div>
            <button
              onClick={() => navigate('/transactions')}
              className="bg-purple-600 hover:bg-purple-500 px-6 py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-95"
            >
              <Plus size={22} />
              Nuevo movimiento
            </button>
          </div>
        </header>

        <div className={`w-full ${statusBg} border border-white/10 rounded-[2rem] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 backdrop-blur-md overflow-hidden`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-3 h-3 rounded-full animate-pulse ${statusColor.replace('text', 'bg')}`} />
            <span className={`text-sm font-black uppercase tracking-[0.24em] ${statusColor}`}>
              {budgetStatus === 'warning' ? 'Presupuesto presionado' : budgetStatus === 'ok' ? 'Presupuesto bajo control' : 'Presupuesto excedido'}
            </span>
          </div>
          <p className="text-sm text-gray-300 font-medium break-words lg:text-right">
            {totalBudget > 0
              ? `Llevas ${budgetUsage.toFixed(0)}% de tus limites activos y tu categoria mas pesada es ${highlightedCategory?.name ?? 'sin definir'}.`
              : 'Crea presupuestos para que el tablero te avise con tiempo cuando una categoria empiece a desbordarse.'}
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {summaryCards.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className="glass p-6 rounded-[2.3rem] relative overflow-hidden group"
            >
              <div className={`absolute -right-6 -top-6 w-28 h-28 ${stat.bg} blur-3xl rounded-full group-hover:scale-150 transition-transform duration-500`} />
              <div className="relative z-10 space-y-5">
                <div className={`inline-flex rounded-2xl p-4 ${stat.bg}`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.28em] mb-2">{stat.label}</p>
                  <p className="text-2xl font-black break-words">{stat.value}</p>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{stat.helper}</p>
              </div>
            </motion.div>
          ))}
        </section>

        <AnimatePresence>
          {showAlert && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 rounded-[3rem] blur-2xl opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="glass p-6 sm:p-8 xl:p-10 rounded-[3rem] relative z-10 border-purple-500/20 overflow-hidden">
                <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.9fr] gap-8 xl:gap-10 items-start">
                  <div className="space-y-6 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-600 p-2 rounded-xl shadow-lg shadow-purple-600/30">
                        <Brain className="text-white" size={20} />
                      </div>
                      <span className="text-purple-300 font-black uppercase tracking-[0.24em] text-xs">Visor predictivo</span>
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-3xl sm:text-4xl font-black leading-tight font-display break-words">
                        {predictionAmount !== null ? (
                          <>
                            La proxima semana podria cerrar en <span className="text-purple-400">${formatCurrency(predictionAmount)}</span>
                          </>
                        ) : (
                          'Todavia faltan datos para proyectar con confianza tu siguiente semana.'
                        )}
                      </h2>
                      <p className="text-gray-300 text-lg leading-relaxed break-words">
                        {prediction?.mensaje ?? 'A medida que registres mas movimientos, este bloque te dira con mas claridad hacia donde se mueve tu gasto.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.24em] font-black mb-2">Dia mas pesado</p>
                        <p className="text-lg font-black">{strongestExpenseDay.name}</p>
                        <p className="text-sm text-gray-400 mt-1">${formatCurrency(strongestExpenseDay.expense)}</p>
                      </div>
                      <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.24em] font-black mb-2">Semana activa</p>
                        <p className="text-lg font-black">{activeDays} de 7 dias</p>
                        <p className="text-sm text-gray-400 mt-1">Con ingresos o gastos registrados</p>
                      </div>
                      <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.24em] font-black mb-2">Balance semanal</p>
                        <p className={`text-lg font-black ${weeklyNet >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {weeklyNet >= 0 ? '+' : '-'}${formatCurrency(Math.abs(weeklyNet))}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Resultado de los ultimos 7 dias</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <button
                        onClick={() => navigate('/analysis')}
                        className="bg-white text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-purple-500 hover:text-white transition-all"
                      >
                        Ver analisis <ArrowRight size={20} />
                      </button>
                      <button
                        onClick={() => setShowAlert(false)}
                        className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-black hover:bg-white/10 transition-all"
                      >
                        Cerrar resumen
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 min-w-0">
                    <div className="rounded-[2rem] border border-purple-500/20 bg-purple-500/10 p-6">
                      <div className="flex items-center gap-2 text-purple-300 mb-3">
                        <Sparkles size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.22em]">Lo mejor que puedes hacer hoy</span>
                      </div>
                      <p className="text-base text-gray-200 leading-relaxed break-words">{adviceMessage}</p>
                    </div>

                    <div className="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-6">
                      <div className="flex items-center gap-2 text-red-300 mb-3">
                        <AlertCircle size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.22em]">Atencion principal</span>
                      </div>
                      <p className="text-base text-gray-200 leading-relaxed break-words">{alertMessage}</p>
                    </div>

                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                      <div className="flex items-center gap-2 text-gray-300 mb-3">
                        <CalendarRange size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.22em]">Categoria que domina tu gasto</span>
                      </div>
                      <p className="text-lg font-black">{highlightedCategory?.name ?? 'Sin datos suficientes'}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {highlightedCategory
                          ? `Concentra ${Math.round(highlightedCategory.percent)}% de tus salidas y acumula $${formatCurrency(highlightedCategory.value)}.`
                          : 'Aun no hay movimientos suficientes para detectar una categoria dominante.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-8">
          <section className="glass p-6 sm:p-8 rounded-[3rem] overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
              <div>
                <p className="text-xs font-black text-purple-400 uppercase tracking-[0.28em] mb-2">Mapa de gasto</p>
                <h3 className="text-2xl font-black font-display">En que se fue tu dinero</h3>
              </div>
              <p className="text-sm text-gray-400">
                {highlightedCategory
                  ? `${highlightedCategory.name} lidera con ${Math.round(highlightedCategory.percent)}%`
                  : 'Todavia sin categorias con gasto'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6 items-center">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData.length > 0 ? categoryData.slice(0, 5) : [{ name: 'Sin datos', value: 1, color: '#312e81', percent: 100 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={102}
                      paddingAngle={6}
                      dataKey="value"
                    >
                      {(categoryData.length > 0 ? categoryData.slice(0, 5) : [{ name: 'Sin datos', value: 1, color: '#312e81', percent: 100 }]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatChartValue(value as number | string | null | undefined)}
                      contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '12px' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                {categoryData.length > 0 ? (
                  categoryData.slice(0, 5).map((category, index) => (
                    <div key={category.name} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
                          <p className="font-black text-white break-words">{index + 1}. {category.name}</p>
                        </div>
                        <span className="text-sm text-gray-300 shrink-0">{Math.round(category.percent)}%</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-sm text-gray-400">
                        <span>Acumulado</span>
                        <span className="font-bold text-white">${formatCurrency(category.value)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-6 text-gray-400">
                    Registra algunos gastos y aqui veras rapidamente que categorias se estan comiendo tu presupuesto.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="glass p-6 sm:p-8 rounded-[3rem] overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
              <div>
                <p className="text-xs font-black text-purple-400 uppercase tracking-[0.28em] mb-2">Pulso semanal</p>
                <h3 className="text-2xl font-black font-display">Como se movio tu semana</h3>
              </div>
              <p className="text-sm text-gray-400">
                {weeklyNet >= 0 ? 'Terminaste arriba esta semana' : 'Terminaste abajo esta semana'}
              </p>
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} barCategoryGap={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: '#ffffff05' }}
                    formatter={(value, name) => [
                      formatChartValue(value as number | string | null | undefined),
                      name === 'expense' ? 'Gastos' : 'Ingresos',
                    ]}
                    labelFormatter={(label) => `Dia ${label}`}
                    contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' }}
                  />
                  <Bar dataKey="expense" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={18} />
                  <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.24em] font-black mb-2">Punto rojo</p>
                <p className="text-lg font-black">{strongestExpenseDay.name}</p>
                <p className="text-sm text-gray-400 mt-1">${formatCurrency(strongestExpenseDay.expense)}</p>
              </div>
              <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.24em] font-black mb-2">Actividad</p>
                <p className="text-lg font-black">{activeDays} dias</p>
                <p className="text-sm text-gray-400 mt-1">Con movimiento registrado</p>
              </div>
              <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.24em] font-black mb-2">Resultado</p>
                <p className={`text-lg font-black ${weeklyNet >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {weeklyNet >= 0 ? '+' : '-'}${formatCurrency(Math.abs(weeklyNet))}
                </p>
                <p className="text-sm text-gray-400 mt-1">Balance de la semana</p>
              </div>
            </div>
          </section>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass p-6 sm:p-8 rounded-[3rem] overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-2xl bg-red-500/10 p-3">
                <AlertCircle className="text-red-400" size={22} />
              </div>
              <div>
                <p className="text-xs font-black text-red-300 uppercase tracking-[0.28em] mb-1">Presion principal</p>
                <h3 className="text-2xl font-black font-display">Presupuesto mas comprometido</h3>
              </div>
            </div>

            {mostCommittedBudget ? (
              <div className="space-y-5">
                <div>
                  <p className="text-2xl font-black">{mostCommittedBudget.category}</p>
                  <p className="text-gray-400 mt-2">
                    Llevas ${formatCurrency(mostCommittedBudget.spent)} de un limite de ${formatCurrency(mostCommittedBudget.limit)}.
                  </p>
                </div>
                <div className="w-full h-4 rounded-full bg-white/5 overflow-hidden border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(mostCommittedBudget.usage, 100)}%` }}
                    className={`h-full rounded-full ${mostCommittedBudget.usage >= 100 ? 'bg-red-500' : mostCommittedBudget.usage >= 80 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Va en {Math.round(mostCommittedBudget.usage)}% de uso y es la categoria que primero conviene revisar.
                </p>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-6 text-gray-400">
                En cuanto crees presupuestos, aqui veras cual es el que va mas justo y cuanto margen te queda.
              </div>
            )}
          </div>

          <div className="glass p-6 sm:p-8 rounded-[3rem] overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-2xl bg-purple-500/10 p-3">
                <Brain className="text-purple-400" size={22} />
              </div>
              <div>
                <p className="text-xs font-black text-purple-300 uppercase tracking-[0.28em] mb-1">Lectura clara</p>
                <h3 className="text-2xl font-black font-display">Que te esta diciendo tu tablero</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-black text-white mb-2">Tu gasto dominante</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {highlightedCategory
                    ? `${highlightedCategory.name} concentra la mayor parte del gasto. Si recortas ahi, es donde mas se notara el cambio.`
                    : 'Todavia no hay suficientes gastos para detectar una categoria dominante.'}
                </p>
              </div>
              <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-black text-white mb-2">Tu semana reciente</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {weeklyNet >= 0
                    ? 'La ultima semana cerraste con mejor equilibrio entre ingresos y salidas.'
                    : 'La ultima semana gasto mas de lo que recupero, asi que conviene frenar la categoria mas alta.'}
                </p>
              </div>
              <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-black text-white mb-2">Siguiente accion recomendada</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {budgetAlerts[0]?.mensaje ?? adviceMessage}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
