import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Star, 
  Droplet, 
  GlassWater, 
  Moon, 
  Heart, 
  Footprints, 
  Sparkles, 
  ArrowRight, 
  Plus 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import DataEntryModal from '../DataEntryModal';
import { generateInsight, calculateStreakData } from '../../lib/insightGenerator';

export default function Dashboard() {
  const { user } = useAuth();
  const { todayData, historyData, addWater } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { streak } = calculateStreakData(historyData);

  const name = user?.name?.split(' ')[0] || 'Traveler';
  const hydration = todayData?.hydrationLiters || 0;
  const hydrationGoal = todayData?.hydrationGoal || 3;
  const hydrationPercent = Math.min(100, Math.round((hydration / hydrationGoal) * 100));
  const vitalityScore = Math.floor((hydrationPercent / 100) * 40 + 52);

  const sleepH = todayData?.sleepHours || 0;
  const sleepM = todayData?.sleepMinutes || 0;
  const deepSleepMinutes = todayData?.deepSleepMinutes || 0;
  const deepH = Math.floor(deepSleepMinutes / 60);
  const deepM = deepSleepMinutes % 60;
  const remCycles = todayData?.remCycles || 0;
  const heartRate = todayData?.heartRate || 0;
  const dailySteps = todayData?.dailySteps || 0;
  const stepTarget = todayData?.stepTarget || 10000;

  const currentInsight = todayData ? generateInsight(todayData) : "Tracking your rhythm...";

  return (
    <div className="max-w-7xl mx-auto px-6 pt-4 pb-32 space-y-10">
      <DataEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Welcome Hero Section */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold font-headline tracking-tight text-white"
          >
            Hello, {name}.
          </motion.h1>
          {streak === 0 && Object.keys(historyData).length > 2 && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-xl text-yellow-500 font-bold max-w-lg mt-3"
             >
               Let's build a recovery strategy. Try hitting just 50% of your targets today to bounce back!
             </motion.div>
          )}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-md"
          >
            Your celestial rhythms are aligning. Here is your vitality report for tonight.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card px-6 py-4 rounded-xl flex items-center gap-4"
        >
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-white/50 font-label">Vitality Score</p>
            <p className="text-3xl font-bold font-headline text-celestial-accent">{vitalityScore}/100</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-celestial-surface relative flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-celestial-accent rounded-full border-t-transparent -rotate-45" />
            <Star className="text-celestial-accent w-5 h-5 fill-current" />
          </div>
        </motion.div>
      </section>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Hydration Tracker */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-7 lg:col-span-8 glass-card rounded-3xl p-8 relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold font-headline mb-1">Hydration Flow</h2>
                <p className="text-white/60 font-medium">Fluid balance is optimal</p>
              </div>
              <div className="bg-celestial-accent/10 text-celestial-accent px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-celestial-accent animate-pulse" />
                Live Syncing
              </div>
            </div>

            <div className="mt-12 flex flex-col md:flex-row items-center gap-12">
              {/* Fluid Animation Display */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 bg-celestial-surface rounded-full shadow-inner" />
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${hydrationPercent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-celestial-accent/40 to-celestial-tertiary/20"
                  style={{ borderRadius: '0 0 100px 100px' }}
                >
                  <div className="absolute -top-4 left-0 w-full h-8 bg-celestial-accent/20 blur-md rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-wave" />
                </motion.div>
                <div className="relative z-20 text-center">
                  <span className="text-5xl font-extrabold font-headline block">{hydration.toFixed(1)}</span>
                  <span className="text-sm font-label uppercase tracking-widest text-white/40">Liters</span>
                </div>
              </div>

              <div className="flex-1 space-y-6 w-full">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-label">
                    <span className="text-white/50">Daily Goal</span>
                    <span className="text-white font-bold">{hydrationPercent}% Complete</span>
                  </div>
                  <div className="h-3 bg-celestial-surface rounded-full overflow-hidden">
                    <motion.div 
                      key={hydrationPercent}
                      initial={{ width: 0 }}
                      animate={{ width: `${hydrationPercent}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-celestial-accent to-celestial-tertiary rounded-full shadow-[0_0_15px_rgba(133,173,255,0.4)]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => addWater(0.25)}
                    className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-2xl flex flex-col items-center gap-2 group/btn active:scale-95 duration-200"
                  >
                    <Droplet className="text-celestial-accent group-hover/btn:scale-110 transition-transform w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-tighter">+250ml</span>
                  </button>
                  <button 
                    onClick={() => addWater(0.5)}
                    className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-2xl flex flex-col items-center gap-2 group/btn active:scale-95 duration-200"
                  >
                    <GlassWater className="text-celestial-accent group-hover/btn:scale-110 transition-transform w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-tighter">+500ml</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sleep Monitor */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-5 lg:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-celestial-secondary/10 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <Moon className="text-celestial-secondary w-8 h-8" />
                {todayData?.sleepTimerRunning && (
                  <span className="flex items-center gap-2 text-[10px] font-bold text-celestial-secondary animate-pulse uppercase border border-celestial-secondary/30 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-celestial-secondary rounded-full" />
                    Tracking Live
                  </span>
                )}
              </div>
              <span className="text-xs font-label uppercase tracking-widest text-white/40">Last Night</span>
            </div>
            <h2 className="text-6xl font-extrabold font-headline mb-4">
              {sleepH}<span className="text-2xl font-medium text-white/40 tracking-normal">h</span> {sleepM}
              <span className="text-2xl font-medium text-white/40 tracking-normal">m</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Deep Sleep</span>
                <span className="font-bold text-celestial-secondary">{deepH}h {deepM}m</span>
              </div>
              <div className="h-1.5 bg-celestial-surface rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.floor((deepSleepMinutes / (sleepH * 60 || 1)) * 100))}%` }}
                  className="h-full bg-celestial-secondary" 
                />
              </div>
              <div className="flex items-center justify-between text-sm pt-2">
                <span className="text-white/40">REM Cycles</span>
                <span className="font-bold text-celestial-secondary">{remCycles} Cycles</span>
              </div>
              <div className="h-1.5 bg-celestial-surface rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, remCycles * 20)}%` }}
                  className="h-full bg-celestial-secondary" 
                />
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-10">
            <p className="italic text-white/60 text-sm border-l-2 border-celestial-secondary/30 pl-4">
              "Your circadian rhythm is perfectly synced with the natural night cycle. Focus on wind-down by 10:30 PM."
            </p>
          </div>
        </motion.div>
      </div>

      {/* Secondary Insights Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card rounded-3xl p-6 group transition-all"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-celestial-tertiary/10 flex items-center justify-center">
              <Heart className="text-celestial-tertiary w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 font-label">Heart Rate</p>
              <p className="text-2xl font-bold">{heartRate} <span className="text-xs text-white/40">BPM</span></p>
            </div>
          </div>
          <div className="h-12 w-full flex items-end gap-1 px-1">
            {[0.5, 0.75, 0.3, 0.6, 1, 0.5].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h * 100}%` }}
                transition={{ delay: 0.1 * i }}
                className="flex-1 bg-celestial-tertiary/40 rounded-t-sm" 
              />
            ))}
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card rounded-3xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-celestial-accent/10 flex items-center justify-center">
              <Footprints className="text-celestial-accent w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 font-label">Daily Steps</p>
              <p className="text-2xl font-bold">{dailySteps.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-sm text-white/60">Targeting <span className="text-white font-bold">{stepTarget.toLocaleString()}</span> today</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card rounded-3xl p-6 bg-gradient-to-br from-celestial-accent/20 to-celestial-surface"
        >
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center gap-2 text-celestial-accent font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              AI Insight
            </div>
            <p className="text-sm leading-relaxed mt-2">{currentInsight}</p>
          </div>
        </motion.div>
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-celestial-accent text-celestial-bg rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform z-40 hover:scale-105"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
