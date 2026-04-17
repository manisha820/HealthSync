import { motion } from 'motion/react';
import { 
  Check, 
  Minus, 
  X, 
  Award, 
  Moon, 
  Droplet,
  Settings,
  LayoutGrid,
  TrendingUp,
  Bed
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';

const data = [
  { day: 'Mon', steps: 4000 },
  { day: 'Tue', steps: 3000 },
  { day: 'Wed', steps: 2000 },
  { day: 'Thu', steps: 12450 },
  { day: 'Fri', steps: 9000 },
  { day: 'Sat', steps: 11000 },
  { day: 'Sun', steps: 10000 },
];

export default function Insights() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-12 pb-32">
      {/* Hero: Discipline Score */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-7 space-y-4">
          <p className="font-headline font-bold text-white/50 uppercase tracking-[0.2em] text-xs">Current Standing</p>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-headline font-extrabold text-5xl md:text-7xl tracking-tighter text-glow"
          >
            Disciplined
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-sm leading-relaxed"
          >
            Your consistency has increased by 12% since last month. You're currently in the top 5% of HealthSync performers.
          </motion.p>
        </div>
        
        <div className="md:col-span-5 flex justify-end">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle className="text-white/5" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" stroke-width="12" />
              <motion.circle 
                initial={{ strokeDashoffset: 553 }}
                animate={{ strokeDashoffset: 83 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="96" cy="96" fill="transparent" r="88" 
                stroke="url(#vitalityGradient)" stroke-dasharray="553" 
                stroke-linecap="round" stroke-width="12" 
              />
              <defs>
                <linearGradient id="vitalityGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-celestial-accent)" />
                  <stop offset="100%" stopColor="var(--color-celestial-tertiary)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-headline font-extrabold text-4xl">85</span>
              <span className="font-label text-[10px] uppercase tracking-widest text-white/50">Discipline Score</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Habit Calendar & Insights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Habit Calendar */}
        <div className="md:col-span-2 glass-card rounded-[2rem] p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-headline font-bold text-xl">Consistency Matrix</h2>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-celestial-tertiary" />
              <span className="w-3 h-3 rounded-full bg-celestial-secondary/30" />
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-3">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-center text-[10px] uppercase font-bold text-white/40">{d}</div>
            ))}
            
            {/* Row 1 */}
            <div className="aspect-square rounded-xl bg-celestial-tertiary/20 flex items-center justify-center"><Check className="text-celestial-tertiary w-4 h-4" /></div>
            <div className="aspect-square rounded-xl bg-celestial-tertiary/20 flex items-center justify-center"><Check className="text-celestial-tertiary w-4 h-4" /></div>
            <div className="aspect-square rounded-xl bg-yellow-500/20 flex items-center justify-center"><Minus className="text-yellow-500 w-4 h-4" /></div>
            <div className="aspect-square rounded-xl bg-celestial-tertiary/20 flex items-center justify-center"><Check className="text-celestial-tertiary w-4 h-4" /></div>
            <div className="aspect-square rounded-xl bg-red-500/20 flex items-center justify-center"><X className="text-red-500 w-4 h-4" /></div>
            <div className="aspect-square rounded-xl bg-celestial-tertiary/20 flex items-center justify-center"><Check className="text-celestial-tertiary w-4 h-4" /></div>
            <div className="aspect-square rounded-xl bg-celestial-tertiary/20 flex items-center justify-center"><Check className="text-celestial-tertiary w-4 h-4" /></div>
            
            {/* Row 2 */}
            <div className="aspect-square rounded-xl bg-celestial-tertiary/20 flex items-center justify-center"><Check className="text-celestial-tertiary w-4 h-4" /></div>
            <div className="aspect-square rounded-xl bg-celestial-tertiary/20 flex items-center justify-center"><Check className="text-celestial-tertiary w-4 h-4" /></div>
            <div className="aspect-square rounded-xl bg-celestial-tertiary/20 flex items-center justify-center"><Check className="text-celestial-tertiary w-4 h-4" /></div>
            <div className="aspect-square rounded-xl bg-celestial-tertiary/20 flex items-center justify-center"><Check className="text-celestial-tertiary w-4 h-4" /></div>
            <div className="aspect-square rounded-xl bg-celestial-tertiary/20 flex items-center justify-center border-2 border-celestial-accent relative">
              <Check className="text-celestial-tertiary w-4 h-4" />
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <div className="aspect-square rounded-xl bg-celestial-tertiary/20 flex items-center justify-center"><Check className="text-celestial-tertiary w-4 h-4" /></div>
            <div className="aspect-square rounded-xl bg-yellow-500/20 flex items-center justify-center"><Minus className="text-yellow-500 w-4 h-4" /></div>
          </div>
        </div>

        {/* Achievement Levels */}
        <div className="glass-card rounded-[2rem] p-6 h-full flex flex-col justify-between">
          <div className="space-y-4">
            <Award className="text-celestial-tertiary w-10 h-10" />
            <h3 className="font-headline font-bold text-xl">Strong Habit</h3>
            <p className="text-sm text-white/50 leading-relaxed">You've hit your hydration goal for 14 days straight. One more week to reach 'Legendary'.</p>
          </div>
          <div className="pt-6 border-t border-white/10 mt-auto">
            <div className="flex justify-between text-xs mb-2">
              <span>Progress to next rank</span>
              <span className="text-celestial-tertiary">72%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '72%' }}
                className="h-full bg-celestial-tertiary" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vitality Trends */}
      <section className="space-y-8">
        <div className="flex justify-between items-baseline">
          <h2 className="font-headline font-bold text-2xl">Vitality Trends</h2>
          <div className="flex bg-white/5 rounded-full p-1">
            <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 text-celestial-accent">WEEKLY</button>
            <button className="px-4 py-1.5 rounded-full text-xs font-bold text-white/40">MONTHLY</button>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 min-h-[400px]">
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">Average Daily Activity</p>
              <h3 className="text-3xl font-headline font-extrabold">+24% <span className="text-sm font-medium text-celestial-tertiary ml-2">vs last week</span></h3>
            </div>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-celestial-accent flex items-center justify-center text-[10px] font-bold border-2 border-celestial-bg">7d</div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold border-2 border-celestial-bg">30d</div>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-celestial-accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-celestial-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff66', fontSize: 10, fontWeight: 'bold' }} 
                  dy={10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111126', border: '1px solid #ffffff1a', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="steps" 
                  stroke="var(--color-celestial-accent)" 
                  fillOpacity={1} 
                  fill="url(#colorSteps)" 
                  strokeWidth={4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Insight Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        <div className="glass-card p-8 rounded-[2rem] flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-celestial-secondary/20 flex items-center justify-center">
            <Bed className="text-celestial-secondary w-8 h-8" />
          </div>
          <div>
            <h4 className="font-headline font-bold">Sleep Quality</h4>
            <p className="text-2xl font-extrabold text-glow text-celestial-secondary">92%</p>
            <p className="text-xs text-white/40">Deep restorative cycle +12m</p>
          </div>
        </div>
        <div className="glass-card p-8 rounded-[2rem] flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-celestial-tertiary/20 flex items-center justify-center">
            <Droplet className="text-celestial-tertiary w-8 h-8" />
          </div>
          <div>
            <h4 className="font-headline font-bold">Hydration</h4>
            <p className="text-2xl font-extrabold text-glow text-celestial-tertiary">2.4L</p>
            <p className="text-xs text-white/40">85% of daily target reached</p>
          </div>
        </div>
      </section>
    </div>
  );
}
