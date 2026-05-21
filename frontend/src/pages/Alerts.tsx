import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Bell, Brain, CheckCircle2, Settings, Sparkles, TrendingUp, X } from 'lucide-react';

import { useApp } from '../context/AppContext';

type AlertItem = {
  id: string;
  title: string;
  message: string;
  date: string;
  color: string;
  bg: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  type: 'warning' | 'ai' | 'info';
  read: boolean;
};

export const Alerts = () => {
  const { alertSettings, updateAlertSettings, budgetAlerts, prediction, advice } = useApp();
  const [readIds, setReadIds] = useState<string[]>([]);
  const [showSettings, setShowSettings] = React.useState(false);
  const [selectedAlert, setSelectedAlert] = React.useState<AlertItem | null>(null);

  const alertList = useMemo(() => {
    const nextAlerts: AlertItem[] = [];

    budgetAlerts.forEach((alert, index) => {
      nextAlerts.push({
        id: `budget-${index}`,
        type: 'warning',
        title: `Presupuesto: ${alert.categoriaNombre}`,
        message: alert.mensaje,
        date: 'Actualizado ahora',
        icon: AlertTriangle,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        read: false,
      });
    });

    if (prediction?.prediccion !== null && prediction?.prediccion !== undefined) {
      nextAlerts.push({
        id: 'prediction',
        type: 'ai',
        title: 'Prediccion Semanal',
        message: prediction.mensaje,
        date: 'Motor ML',
        icon: TrendingUp,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        read: false,
      });
    }

    if (advice?.consejo) {
      nextAlerts.push({
        id: 'advice',
        type: 'info',
        title: 'Consejo de Ahorro',
        message: advice.consejo,
        date: 'Motor ML',
        icon: Brain,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        read: false,
      });
    }

    if (nextAlerts.length === 0) {
      nextAlerts.push({
        id: 'empty',
        type: 'info',
        title: 'Sin alertas activas',
        message: 'Cuando detectemos presupuestos en riesgo, una prediccion relevante o una oportunidad clara de ahorro, la veras aqui.',
        date: 'Sistema',
        icon: CheckCircle2,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        read: false,
      });
    }

    return nextAlerts.map((alert) => ({
      ...alert,
      read: readIds.includes(alert.id),
    }));
  }, [advice, budgetAlerts, prediction, readIds]);

  const handleMarkAsRead = (id: string) => {
    setReadIds((current) => (current.includes(id) ? current : [...current, id]));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-white pb-32 pt-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 min-w-0">
          <div className="flex items-center gap-6 min-w-0">
            <div className="glass p-4 rounded-2xl border-purple-500/20 shadow-xl shadow-purple-600/10 shrink-0">
              <Bell size={32} className="text-purple-500" />
            </div>
            <div className="min-w-0">
              <h1 className="text-4xl font-black tracking-tight font-display">Alertas</h1>
              <p className="text-gray-400 font-medium break-words">Lectura en tiempo real de presupuestos, predicciones y recomendaciones activas.</p>
            </div>
          </div>
          <button onClick={() => setShowSettings(true)} className="p-4 glass rounded-2xl hover:bg-white/10 transition-all group self-start sm:self-auto">
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
                className={`glass p-6 sm:p-8 rounded-[2.5rem] flex flex-col sm:flex-row gap-6 sm:gap-8 group glass-hover relative overflow-hidden ${alert.read ? 'opacity-60' : ''}`}
              >
                <div className={`absolute top-0 left-0 w-2 h-full ${alert.color.replace('text', 'bg')}`} />
                <div className={`p-5 rounded-2xl h-fit ${alert.bg} ${alert.color} shadow-lg shrink-0`}>
                  <alert.icon size={28} />
                </div>

                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <h3 className="font-black text-xl break-words">{alert.title}</h3>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] shrink-0">{alert.date}</span>
                  </div>
                  <p className="text-gray-400 text-lg leading-relaxed break-words">{alert.message}</p>
                  <div className="flex flex-wrap gap-4 sm:gap-6 pt-4">
                    <button onClick={() => setSelectedAlert(alert)} className="text-xs font-black text-purple-500 hover:text-purple-400 uppercase tracking-widest transition-colors">
                      Ver detalles
                    </button>
                    {!alert.read && (
                      <button onClick={() => handleMarkAsRead(alert.id)} className="text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
                        Marcar como leida
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedAlert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAlert(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-6 sm:p-10 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`p-4 rounded-2xl ${selectedAlert.bg} ${selectedAlert.color} shrink-0`}>
                    <selectedAlert.icon size={24} />
                  </div>
                  <h2 className="text-2xl font-black font-display tracking-tight break-words">{selectedAlert.title}</h2>
                </div>
                <button onClick={() => setSelectedAlert(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors shrink-0">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Mensaje</p>
                  <p className="text-gray-200 text-lg leading-relaxed break-words">{selectedAlert.message}</p>
                </div>
                <button onClick={() => setSelectedAlert(null)} className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSettings(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-6 sm:p-10 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-black font-display tracking-tight">Configuracion</h2>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors shrink-0">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-black text-purple-500 uppercase tracking-[0.2em]">Preferencias</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Alertas de Presupuesto', key: 'budgetAlerts' },
                    { label: 'Deteccion de Gastos Inusuales', key: 'unusualSpending' },
                    { label: 'Predicciones Semanales', key: 'weeklyPredictions' },
                    { label: 'Notificaciones de Meta', key: 'goalNotifications' },
                  ].map((setting) => {
                    const isActive = alertSettings[setting.key as keyof typeof alertSettings];
                    return (
                      <div key={setting.key} className="flex justify-between items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-sm font-bold text-gray-300 break-words">{setting.label}</span>
                        <div onClick={() => updateAlertSettings({ [setting.key]: !isActive })} className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${isActive ? 'bg-purple-600' : 'bg-gray-700'}`}>
                          <motion.div animate={{ x: isActive ? 24 : 4 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-5 bg-purple-600/10 border border-purple-500/20 rounded-2xl text-sm text-gray-300 flex items-start gap-3">
                  <Sparkles size={18} className="text-purple-400 shrink-0 mt-0.5" />
                  <span className="break-words">Estas preferencias se guardan localmente en tu navegador para respetar tu configuracion aun cuando cierres sesion.</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
