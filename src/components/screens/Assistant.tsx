import { motion } from 'motion/react';
import { 
  Sparkles, 
  Settings, 
  Mic, 
  ArrowUp, 
  Droplet, 
  Zap, 
  Clock, 
  Sun,
  LayoutGrid,
  TrendingUp,
  User
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Assistant() {
  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 pt-4 pb-48">
      {/* Welcome / Context Moment */}
      <div className="mb-10 mt-4">
        <h1 className="text-4xl font-extrabold font-headline text-white tracking-tight mb-2">Celestial Guide</h1>
        <p className="text-white/60 font-body">Your biometric insights transformed into action.</p>
      </div>

      {/* Chat Flow */}
      <div className="space-y-8 flex-1 overflow-y-auto">
        {/* AI Message */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start max-w-[85%]"
        >
          <div className="glass-card rounded-2xl p-5 text-white border-l-4 border-celestial-accent">
            <p className="leading-relaxed">Good evening, Julian. I noticed you've missed your morning hydration target and 2,000 steps today. Your rhythm seems slightly off-sync. Would you like a recovery plan for tomorrow?</p>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/30 mt-2 ml-1">Assistant • 19:02</span>
        </motion.div>

        {/* User Response */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-end self-end max-w-[85%]"
        >
          <div className="bg-celestial-accent/20 text-white rounded-2xl p-5 border border-celestial-accent/20">
            <p className="leading-relaxed font-medium">Yes, please. I had a long travel day. Help me get back on track.</p>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/30 mt-2 mr-1">You • 19:03</span>
        </motion.div>

        {/* AI Message: Recovery Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-start w-full"
        >
          <div className="glass-card rounded-3xl p-6 w-full border border-celestial-tertiary/20">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-celestial-tertiary w-6 h-6" />
              <h2 className="text-xl font-bold font-headline text-celestial-tertiary">Celestial Recovery Plan</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-celestial-bg/50 p-4 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-celestial-accent/10 rounded-xl">
                  <Droplet className="text-celestial-accent w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Morning Hydration</p>
                  <p className="text-lg font-bold">500ml + Electrolytes</p>
                </div>
              </div>
              <div className="bg-celestial-bg/50 p-4 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-celestial-tertiary/10 rounded-xl">
                  <Sun className="text-celestial-tertiary w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Light Exposure</p>
                  <p className="text-lg font-bold">15m Sunrise walk</p>
                </div>
              </div>
              <div className="bg-celestial-bg/50 p-4 rounded-2xl flex items-center gap-4 md:col-span-2">
                <div className="p-3 bg-celestial-secondary/10 rounded-xl">
                  <Clock className="text-celestial-secondary w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Rhythm Adjustment</p>
                  <p className="text-lg font-bold">Bedtime shifted to 10:15 PM</p>
                  <p className="text-sm text-white/40 mt-1">This optimizes your deep sleep cycle based on today's travel fatigue.</p>
                </div>
              </div>
            </div>
            
            <button className="mt-6 w-full py-4 bg-celestial-accent text-celestial-bg font-bold rounded-xl active:scale-95 transition-all shadow-[0_0_20px_rgba(133,173,255,0.3)]">
              Activate Recovery Plan
            </button>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/30 mt-2 ml-1">Assistant • 19:04</span>
        </motion.div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2 pt-4">
          {["Log my dinner", "How was my REM sleep?", "Adjust goals"].map((s, i) => (
            <button key={i} className="px-4 py-2 rounded-full border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-colors">
              "{s}"
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-40">
        <div className="glass-card rounded-full p-2 flex items-center shadow-2xl border border-white/5 bg-celestial-surface/80">
          <input 
            className="flex-1 bg-transparent border-none focus:ring-0 px-6 text-white placeholder:text-white/30" 
            placeholder="Ask your guide anything..." 
            type="text"
          />
          <button className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-celestial-accent active:scale-90 transition-all">
            <Mic className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 ml-2 rounded-full bg-celestial-accent text-celestial-bg flex items-center justify-center active:scale-90 transition-all">
            <ArrowUp className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
