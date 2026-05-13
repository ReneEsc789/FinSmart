import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Settings,
  Trash2,
  Brain,
  TrendingUp,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type AlertItem = {
  id: number;
  type: 'warning' | 'ai' | 'info' | 'prediction';
  title: string;
  message: string;
  date: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bg: string;
  read: boolean;
};

export const Alerts = () => {
  const { alertSettings, updateAlertSettings } = useApp();
  const [alertList, setAlertList] = React.useState<AlertItem[]>([
    { id: 1, type: 'warning', title: 'Límite de Presupuesto', message: 'Has alcanzado el 90% de tu presupuesto en Comida.', date: 'Hace 2 horas', icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', read: false },
    { id: 2, type: 'ai', title: 'Gasto Inusual Detectado', message: 'Se registró un gasto de $1,200 en "Amazon", fuera de tu rango normal.', date: 'Hace 5 horas', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10', read: false },
    { id: 3, type: 'info', title: 'Meta Alcanzada', message: '¡Felicidades! Has ahorrado el 20% de tu meta "Fondo de Emergencia".', date: 'Ayer, 10:00 AM', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', read: false },
    { id: 4, type: 'prediction', title: 'Predicción Semanal', message: 'Basado en tu ritmo actual, podrías gastar $500 extras esta semana.', date: '2 Mar, 2024', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10', read: false },
  ]);
  const [showSettings, setShowSettings] = React.useState(false);
  const [selectedAlert, setSelectedAlert] = React.useState<AlertItem | null>(null);

  const handleDeleteAlert = (id: number) => {
    setAlertList(alertList.filter(a => a.id !== id));
    if (selectedAlert?.id === id) setSelectedAlert(null);
  };

  const handleMarkAsRead = (id: number) => {
    setAlertList(alertList.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const toggleSetting = (key: keyof typeof alertSettings) => {
    updateAlertSettings({ [key]: !alertSettings[key] });
  };

  return (
    <div className="min-h-screen bg-transparent text-white pb-32 pt-10 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="glass p-4 rounded-2xl border-purple-500/20 shadow-xl shadow-purple-600/10">
              <Bell size={32} className="text-purple-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight font-display">Alertas</h1>
              <p className="text-gray-400 font-medium">Mantente al tanto de tus finanzas en tiempo real</p>
            </div>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-4 glass rounded-2xl hover:bg-white/10 transition-all group"
          >
            <Settings size={24} className="text-gray-400 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </header>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {alertList.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass p-8 rounded-[2.5rem] flex gap-8 group glass-hover relative overflow-hidden ${alert.read ? 'opacity-60' : ''}`}
              >
                <div className={`absolute top-0 left-0 w-2 h-full ${alert.color.replace('text', 'bg')}`} />
                <div className={`p-5 rounded-2xl h-fit ${alert.bg} ${alert.color} shadow-lg`}>
                  <alert.icon size={28} />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-xl">{alert.title}</h3>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{alert.date}</span>
                  </div>
                  <p className="text-gray-400 text-lg leading-relaxed">{alert.message}</p>
                  <div className="flex gap-6 pt-4">
                    <button 
                      onClick={() => setSelectedAlert(alert)}
                      className="text-xs font-black text-purple-500 hover:text-purple-400 uppercase tracking-widest transition-colors"
                    >
                      Ver detalles
                    </button>
                    {!alert.read && (
                      <button 
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                      >
                        Marcar como leída
                      </button>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {alertList.length === 0 && (
            <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
              <Bell size={48} className="text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No tienes alertas nuevas</p>
            </div>
          )}
        </div>
      </div>

      {/* Alert Detail Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAlert(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white/2 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${selectedAlert.bg} ${selectedAlert.color}`}>
                    <selectedAlert.icon size={24} />
                  </div>
                  <h2 className="text-2xl font-black font-display tracking-tight">{selectedAlert.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedAlert(null)}
                  className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Mensaje</p>
                  <p className="text-gray-200 text-lg leading-relaxed">{selectedAlert.message}</p>
                </div>
                <div className="flex justify-between items-center py-4 border-y border-white/5">
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fecha</p>
                    <p className="font-bold">{selectedAlert.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tipo</p>
                    <p className={`font-bold uppercase ${selectedAlert.color}`}>{selectedAlert.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAlert(null)}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white/2 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black font-display tracking-tight">Configuración</h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-black text-purple-500 uppercase tracking-[0.2em]">Preferencias de Alertas</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Alertas de Presupuesto', key: 'budgetAlerts' },
                    { label: 'Detección de Gastos Inusuales', key: 'unusualSpending' },
                    { label: 'Predicciones Semanales', key: 'weeklyPredictions' },
                    { label: 'Notificaciones de Meta', key: 'goalNotifications' },
                  ].map((s) => {
                    const isActive = alertSettings[s.key as keyof typeof alertSettings];
                    return (
                      <div key={s.key} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-sm font-bold text-gray-300">{s.label}</span>
                        <div 
                          onClick={() => toggleSetting(s.key as keyof typeof alertSettings)}
                          className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${isActive ? 'bg-purple-600' : 'bg-gray-700'}`}
                        >
                          <motion.div 
                            animate={{ x: isActive ? 24 : 4 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-purple-600/20"
                >
                  Guardar Cambios
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
