import { motion, AnimatePresence } from 'motion/react';
import { X, Bed, Heart, Footprints, Play, Square } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataEntryModal({ isOpen, onClose }: Props) {
  const { todayData, updateData, startSleepTimer, stopSleepTimer } = useData();
  
  const [hr, setHr] = useState(todayData?.heartRate || 65);
  const [steps, setSteps] = useState(todayData?.dailySteps || 0);

  // Live timer state
  const [liveElapsed, setLiveElapsed] = useState('00:00:00');

  useEffect(() => {
    if (todayData?.heartRate !== undefined) setHr(todayData.heartRate);
    if (todayData?.dailySteps !== undefined) setSteps(todayData.dailySteps);
  }, [todayData]);

  const [alarmPlayed, setAlarmPlayed] = useState(false);

  useEffect(() => {
    let interval: any;
    if (todayData?.sleepTimerRunning && todayData?.sleepTimerStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = now - todayData.sleepTimerStartTime!;
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setLiveElapsed(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        
        // Feature 2: Alarm triggering when recommended sleep duration finishes
        if (h >= 8 && !alarmPlayed) {
           const audio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
           audio.play().catch(e=>console.log(e));
           setAlarmPlayed(true);
        }
      }, 1000);
    } else {
      setLiveElapsed('00:00:00');
      setAlarmPlayed(false);
    }
    return () => clearInterval(interval);
  }, [todayData?.sleepTimerRunning, todayData?.sleepTimerStartTime, alarmPlayed]);

  const handleSave = () => {
    updateData({
      heartRate: hr,
      dailySteps: steps
    });
    onClose();
  };

  if (!todayData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full bg-celestial-surface border-t border-white/10 rounded-t-[2.5rem] z-[101] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto pb-10"
          >
            <div className="p-6 sticky top-0 bg-celestial-surface/80 backdrop-blur-md z-10 flex justify-between items-center border-b border-white/5">
              <h2 className="font-headline font-bold text-2xl text-white">Log Vitality</h2>
              <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Sleep Tracker */}
              <div className="glass-card p-6 rounded-3xl border border-celestial-secondary/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-celestial-secondary/5" />
                <div className="relative z-10 flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-celestial-secondary/20 rounded-2xl">
                      <Bed className="text-celestial-secondary w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-lg">Sleep Tracker</h3>
                      <p className="text-xs text-white/50">Exact hours timing</p>
                    </div>
                  </div>
                  {todayData.sleepTimerRunning && (
                    <span className="flex items-center gap-2 text-xs font-bold text-celestial-secondary animate-pulse">
                      <span className="w-2 h-2 bg-celestial-secondary rounded-full" />
                      TRACKING
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-2xl mb-6">
                  <span className={cn(
                    "text-5xl font-headline font-extrabold tracking-tighter transition-colors",
                    todayData.sleepTimerRunning ? "text-celestial-secondary" : "text-white/40"
                  )}>
                    {liveElapsed}
                  </span>
                  <p className="text-[10px] font-bold text-celestial-secondary mt-3 uppercase tracking-widest px-3 py-1 bg-celestial-secondary/10 rounded-full border border-celestial-secondary/20">
                    Target: {todayData.age < 18 ? 9 : todayData.age > 65 ? 7 : 8} Exact Hours
                  </p>
                  {!todayData.sleepTimerRunning && todayData.sleepHours > 0 && (
                    <p className="text-sm mt-2 text-white/40">
                      Previous session: {todayData.sleepHours}h {todayData.sleepMinutes}m
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  {!todayData.sleepTimerRunning ? (
                    <button 
                      onClick={startSleepTimer}
                      className="flex-1 py-4 bg-celestial-secondary text-white font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(118,102,255,0.3)]"
                    >
                      <Play className="w-5 h-5 fill-current" /> Initialize Sleep Cycle
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        stopSleepTimer();
                        if ("Notification" in window && Notification.permission === "granted") {
                          new Notification("HealthSync Tracker", { body: "Your sleep session has been recorded successfully!" });
                        }
                      }}
                      className="flex-1 py-4 bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-red-500/30"
                    >
                      <Square className="w-5 h-5 fill-current" /> Wake Up & Save
                    </button>
                  )}
                </div>
              </div>

              {/* Steps */}
              <div className="glass-card p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-celestial-accent/10 rounded-2xl">
                    <Footprints className="text-celestial-accent w-6 h-6" />
                  </div>
                  <h3 className="font-headline font-bold text-lg">Daily Steps</h3>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <input 
                    type="number" 
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                    className="bg-transparent border-none text-4xl font-extrabold focus:ring-0 w-full"
                  />
                  <span className="text-white/40">Steps</span>
                </div>
                <input 
                  type="range" min="0" max="20000" step="100"
                  value={steps} onChange={(e) => setSteps(Number(e.target.value))}
                  className="w-full accent-celestial-accent mt-4"
                />
              </div>

              {/* Heart Rate */}
              <div className="glass-card p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-celestial-tertiary/10 rounded-2xl">
                    <Heart className="text-celestial-tertiary w-6 h-6" />
                  </div>
                  <h3 className="font-headline font-bold text-lg">Resting Heart Rate</h3>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <input 
                    type="number" 
                    value={hr}
                    onChange={(e) => setHr(Number(e.target.value))}
                    className="bg-transparent border-none text-4xl font-extrabold focus:ring-0 w-full"
                  />
                  <span className="text-white/40">BPM</span>
                </div>
                <input 
                  type="range" min="40" max="150" step="1"
                  value={hr} onChange={(e) => setHr(Number(e.target.value))}
                  className="w-full accent-celestial-tertiary mt-4"
                />
              </div>

              {/* Save */}
              <button 
                onClick={handleSave}
                className="w-full py-5 bg-celestial-accent text-celestial-bg font-headline font-bold text-lg rounded-full active:scale-95 transition-all shadow-xl mt-4"
              >
                Sync Metrics
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
