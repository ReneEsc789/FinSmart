import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  Sparkles,
  ArrowRight,
  Target,
  BarChart3,
  X
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

type Goal = {
  name: string;
  target: number;
  current: number;
  color: string;
};

type SavingTip = {
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  detail: string;
};

const predictionData = [
  { name: 'Sem 1', actual: 2500, predicted: 2400 },
  { name: 'Sem 2', actual: 3200, predicted: 3000 },
  { name: 'Sem 3', actual: 2800, predicted: 2900 },
  { name: 'Sem 4', actual: null, predicted: 3100 },
  { name: 'Sem 5', actual: null, predicted: 2800 },
];

export const Analysis = () => {
  const [goals, setGoals] = React.useState<Goal[]>([
    { name: 'Fondo de Emergencia', target: 50000, current: 18500, color: 'bg-purple-500' },
    { name: 'Viaje a Japón', target: 80000, current: 12000, color: 'bg-blue-500' },
  ]);
  const [isAddingGoal, setIsAddingGoal] = React.useState(false);
  const [selectedTip, setSelectedTip] = React.useState<SavingTip | null>(null);
  const [newGoal, setNewGoal] = React.useState({ name: '', target: 0, current: 0 });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-yellow-500'];
    setGoals([...goals, { ...newGoal, color: colors[goals.length % colors.length] }]);
    setIsAddingGoal(false);
    setNewGoal({ name: '', target: 0, current: 0 });
  };

  return (
    <div className="min-h-screen bg-transparent text-white pb-32 pt-10 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="flex items-center gap-6">
          <div className="bg-purple-600 p-4 rounded-2xl shadow-2xl shadow-purple-600/40">
            <BrainCircuit size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight font-display">Análisis IA</h1>
            <p className="text-gray-400 font-medium">Predicciones y consejos personalizados basados en tu comportamiento</p>
          </div>
        </header>

        {/* Prediction Chart */}
        <section className="glass p-10 rounded-[3rem]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <h2 className="text-2xl font-black flex items-center gap-3 font-display">
              <BarChart3 className="text-purple-500" size={28} />
              Predicción de Gastos
            </h2>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
                <span className="text-gray-400">Real</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500/20 border border-purple-500/50" />
                <span className="text-gray-400">Predicción</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#8b5cf6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorActual)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  strokeDasharray="8 8"
                  fillOpacity={1} 
                  fill="url(#colorPredicted)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-10 p-8 bg-purple-600/10 border border-purple-500/20 rounded-[2rem] flex flex-col md:flex-row items-center gap-8">
            <div className="bg-purple-600 p-4 rounded-2xl shadow-xl shadow-purple-600/30">
              <Sparkles className="text-white" size={32} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-2">Resumen de Predicción</p>
              <p className="text-xl text-gray-200 leading-relaxed">
                Se estima que gastarás <span className="text-white font-black">$11,200</span> este mes, lo que representa un <span className="text-green-500 font-black">5% menos</span> que el mes pasado. ¡Excelente trabajo!
              </p>
            </div>
          </div>
        </section>

        {/* AI Tips Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Lightbulb className="text-yellow-500" />
              Consejos de Ahorro
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Optimiza tus suscripciones', desc: 'Tienes 3 servicios de streaming. Cancelar uno te ahorraría $2,400 al año.', icon: TrendingDown, color: 'text-red-500', detail: 'Analizamos tus cargos recurrentes y detectamos que pagas por Netflix, HBO y Disney+. Basado en tu uso, podrías consolidar o rotar estas suscripciones para ahorrar significativamente.' },
                { title: 'Días de mayor gasto', desc: 'Tus gastos en restaurantes aumentan los viernes. Intenta cocinar en casa un viernes sí y uno no.', icon: TrendingUp, color: 'text-purple-500', detail: 'Los viernes por la noche representan el 40% de tu gasto semanal en comida. Si reduces esto a la mitad, podrías alcanzar tu meta de ahorro un 15% más rápido.' },
                { title: 'Categoría Oportunidad', desc: 'Has gastado menos en Transporte este mes. Podrías mover ese excedente a tu fondo de ahorro.', icon: Target, color: 'text-green-500', detail: 'Este mes has caminado más y usado menos el auto. Tienes un excedente de $1,200 en la categoría de Transporte. Te recomendamos transferirlo a tu Fondo de Emergencia hoy mismo.' },
              ].map((tip, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedTip(tip)}
                  className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-sm group-hover:text-purple-400 transition-colors">{tip.title}</p>
                    <ArrowRight size={16} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-purple-500" />
              Metas Financieras
            </h3>
            <div className="space-y-6">
              {goals.map((goal, i) => {
                const percent = (goal.current / goal.target) * 100;
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold">{goal.name}</span>
                      <span className="text-gray-500">${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        className={`h-full rounded-full ${goal.color}`}
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 text-right font-bold uppercase tracking-widest">{Math.round(percent)}% completado</p>
                  </div>
                );
              })}
              <button 
                onClick={() => setIsAddingGoal(true)}
                className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 hover:text-white transition-all font-bold text-sm"
              >
                + Crear Nueva Meta
              </button>
            </div>
          </div>
        </section>

        {/* Tip Detail Modal */}
        <AnimatePresence>
          {selectedTip && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTip(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-yellow-500/10 text-yellow-500">
                      <Lightbulb size={24} />
                    </div>
                    <h2 className="text-2xl font-black font-display tracking-tight">Consejo IA</h2>
                  </div>
                  <button onClick={() => setSelectedTip(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white">{selectedTip.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{selectedTip.detail}</p>
                  </div>
                  
                  <div className="p-6 bg-purple-600/10 border border-purple-500/20 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles size={16} className="text-purple-400" />
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Impacto Estimado</p>
                    </div>
                    <p className="text-sm font-bold text-gray-200">Podrías ahorrar hasta un 12% adicional este mes siguiendo este consejo.</p>
                  </div>

                  <button 
                    onClick={() => setSelectedTip(null)}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                  >
                    Entendido
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* New Goal Modal */}
        <AnimatePresence>
          {isAddingGoal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddingGoal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black font-display tracking-tight">Nueva Meta</h2>
                  <button onClick={() => setIsAddingGoal(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleAddGoal} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Nombre de la Meta</label>
                    <input 
                      type="text" 
                      required
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                      placeholder="Ej: Fondo de Emergencia"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                    />
                  </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Monto Meta</label>
                        <input 
                          type="number" 
                          required
                          value={newGoal.target === 0 ? '' : newGoal.target}
                          onChange={(e) => {
                            const val = e.target.value;
                            const numericVal = val === '' ? 0 : Number(val.replace(/^0+/, ''));
                            setNewGoal({...newGoal, target: numericVal});
                          }}
                          placeholder="0"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black ml-2">Monto Actual</label>
                        <input 
                          type="number" 
                          required
                          value={newGoal.current === 0 ? '' : newGoal.current}
                          onChange={(e) => {
                            const val = e.target.value;
                            const numericVal = val === '' ? 0 : Number(val.replace(/^0+/, ''));
                            setNewGoal({...newGoal, current: numericVal});
                          }}
                          placeholder="0"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                        />
                      </div>
                    </div>
                  <button 
                    type="submit"
                    className="w-full py-5 rounded-2xl bg-purple-600 hover:bg-purple-500 font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-purple-600/20"
                  >
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
