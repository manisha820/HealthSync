import { motion } from 'motion/react';
import { 
  Check, 
  Minus, 
  X, 
  Award, 
  Moon, 
  Droplet,
  Bed,
  Calendar as CalendarIcon,
  Activity,
  Timer
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';
import { useData } from '../../contexts/DataContext';
import { calculateStreakData } from '../../lib/insightGenerator';

export default function Insights() {
  const { historyData, todayData } = useData();

  // Helper to generate last N dates (YYYY-MM-DD)
  const getLastNDates = (n: number) => {
    const dates = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const chartDates = getLastNDates(7);
  const matrixDates = getLastNDates(14);

  // Parse chart data (Steps)
  const data = chartDates.map(dateStr => {
    const day = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
    const steps = historyData[dateStr]?.dailySteps || 0;
    return { day, steps, date: dateStr };
  });

  const { streak, rank } = calculateStreakData(historyData);
  // Calculate relative discipline score roughly where 21 days = 100%
  const disciplineScore = Math.min(100, Math.floor((streak / 21) * 100));

  const avgStepsLast7 = data.length > 0 ? data.reduce((acc, curr) => acc + curr.steps, 0) / data.length : 0;

  // Averages calculation for weekly and monthly reports
  const last30Dates = getLastNDates(30);
  
  const getPeriodAverages = (datesList: string[]) => {
    let w = 0, s = 0, st = 0;
    let counts = { w:0, s:0, st:0 };
    datesList.forEach(d => {
       const rec = historyData[d];
       if (rec) {
         if (rec.hydrationLiters !== undefined) { w += rec.hydrationLiters; counts.w++; }
         if (rec.sleepHours !== undefined) { s += (rec.sleepHours + (rec.sleepMinutes || 0)/60); counts.s++; }
         if (rec.dailySteps !== undefined) { st += rec.dailySteps; counts.st++; }
       }
    });
    return {
      water: counts.w ? w/counts.w : 0,
      sleep: counts.s ? s/counts.s : 0,
      steps: counts.st ? st/counts.st : 0
    };
  };

  const weeklyAvg = getPeriodAverages(chartDates);
  const monthlyAvg = getPeriodAverages(last30Dates);

  // Calendar logic
  const todayDateObj = new Date();
  const currentMonthYear = todayDateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(todayDateObj.getFullYear(), todayDateObj.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(todayDateObj.getFullYear(), todayDateObj.getMonth(), 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(todayDateObj.getFullYear(), todayDateObj.getMonth(), i);
    calendarDays.push(d.toISOString().split('T')[0]);
  }

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
            {rank}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-sm leading-relaxed"
          >
            You are on a {streak} day win streak! Hitting daily step targets and hydration goals steadily will elevate your rank.
          </motion.p>
        </div>
        
        <div className="md:col-span-5 flex justify-end">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle className="text-white/5" cx="96" cy="96" fill="transparent" r="88" strokeWidth="12" />
              <motion.circle 
                initial={{ strokeDashoffset: 553 }}
                animate={{ strokeDashoffset: 553 - (553 * disciplineScore) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="96" cy="96" fill="transparent" r="88" 
                stroke="url(#vitalityGradient)" strokeDasharray="553" 
                strokeLinecap="round" strokeWidth="12" 
              />
              <defs>
                <linearGradient id="vitalityGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-celestial-accent)" />
                  <stop offset="100%" stopColor="var(--color-celestial-tertiary)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-headline font-extrabold text-4xl">{disciplineScore}</span>
              <span className="font-label text-[10px] uppercase tracking-widest text-white/50">Discipline Score</span>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Reports */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Report */}
        <div className="glass-card rounded-[2rem] p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
            <Activity className="text-celestial-accent w-6 h-6" />
            <h2 className="font-headline font-bold text-xl">Weekly Report</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-white/80">
              <span className="text-sm">Avg. Sleep / Night</span>
              <span className="font-bold text-celestial-secondary">{weeklyAvg.sleep.toFixed(1)} hrs</span>
            </div>
            <div className="flex justify-between items-center text-white/80">
              <span className="text-sm">Avg. Daily Steps</span>
              <span className="font-bold text-celestial-accent">{Math.floor(weeklyAvg.steps).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-white/80">
              <span className="text-sm">Avg. Hydration</span>
              <span className="font-bold text-celestial-tertiary">{weeklyAvg.water.toFixed(1)} L</span>
            </div>
          </div>
        </div>

        {/* Monthly Report */}
        <div className="glass-card rounded-[2rem] p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
            <Timer className="text-celestial-tertiary w-6 h-6" />
            <h2 className="font-headline font-bold text-xl">Monthly Trajectory</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-white/80">
              <span className="text-sm">Avg. Sleep / Night</span>
              <span className="font-bold text-celestial-secondary">{monthlyAvg.sleep.toFixed(1)} hrs</span>
            </div>
            <div className="flex justify-between items-center text-white/80">
              <span className="text-sm">Avg. Daily Steps</span>
              <span className="font-bold text-celestial-accent">{Math.floor(monthlyAvg.steps).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-white/80">
              <span className="text-sm">Avg. Hydration</span>
              <span className="font-bold text-celestial-tertiary">{monthlyAvg.water.toFixed(1)} L</span>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Grid */}
      <section className="glass-card rounded-[2rem] p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CalendarIcon className="text-white/60 w-6 h-6" />
            <h2 className="font-headline font-bold text-xl">Vitality Calendar</h2>
          </div>
          <span className="text-sm font-bold text-celestial-accent">{currentMonthYear}</span>
        </div>
        
        <div className="grid grid-cols-7 gap-2 md:gap-4 lg:gap-6">
          {/* Days of the week header */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
            <div key={i} className="text-center text-[10px] md:text-xs uppercase font-bold text-white/40 mb-2">
              {d}
            </div>
          ))}
          
          {/* Calendar boxes */}
          {calendarDays.map((dateStr, i) => {
            if (!dateStr) {
              return <div key={`empty-${i}`} className="aspect-square bg-transparent rounded-2xl" />;
            }
            
            const rec = historyData[dateStr];
            const isToday = dateStr === todayDateObj.toISOString().split('T')[0];
            const dayNum = new Date(dateStr).getDate();

            if (!rec) {
              return (
                <div key={dateStr} className={cn("aspect-square rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-transparent transition-all hover:bg-white/10", isToday && "border-white/20 bg-white/10")}>
                  <span className="text-xs md:text-sm font-bold text-white/30">{dayNum}</span>
                </div>
              );
            }

            const isHydrationMet = rec.hydrationLiters >= rec.hydrationGoal;
            const isStepMet = rec.dailySteps >= rec.stepTarget;

            let bgColor = "bg-white/10";
            let textColor = "text-white/50";

            if (isHydrationMet && isStepMet) {
              bgColor = "bg-green-500/20";
              textColor = "text-green-400";
            } else if (isHydrationMet || isStepMet) {
              bgColor = "bg-yellow-500/20";
              textColor = "text-yellow-400";
            } else {
              bgColor = "bg-red-500/20";
              textColor = "text-red-400";
            }

            return (
              <div key={dateStr} className={cn("aspect-square rounded-2xl flex flex-col items-center justify-center border relative transition-transform hover:scale-105", bgColor, isToday ? "border-white/60" : "border-transparent")} title={`Water: ${rec.hydrationLiters}L | Steps: ${rec.dailySteps}`}>
                <span className={cn("text-xs md:text-sm font-extrabold mb-1", textColor)}>{dayNum}</span>
                <div className="flex gap-1 hidden md:flex">
                  {isHydrationMet ? <Check className="w-3 h-3 text-green-400" /> : <X className="w-3 h-3 text-red-500" />}
                  {isStepMet ? <Check className="w-3 h-3 text-green-400" /> : <X className="w-3 h-3 text-red-500" />}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Achievement Levels */}
      <section className="grid grid-cols-1">
          <div className="space-y-4">
            <Award className="text-celestial-tertiary w-10 h-10" />
            <h3 className="font-headline font-bold text-xl">Current Progress</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Your overall baseline determines your current tier ranking. Complete more consecutive days to rank up.
            </p>
          </div>
          <div className="pt-6 border-t border-white/10 mt-auto">
            <div className="flex justify-between text-xs mb-2">
              <span>Progress to next rank</span>
              <span className="text-celestial-tertiary">{disciplineScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${disciplineScore}%` }}
                className="h-full bg-celestial-tertiary" 
              />
            </div>
          </div>
      </section>

      {/* Vitality Trends */}
      <section className="space-y-8">
        <div className="flex justify-between items-baseline">
          <h2 className="font-headline font-bold text-2xl">Daily Steps Trend</h2>
          <div className="flex bg-white/5 rounded-full p-1">
            <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 text-celestial-accent">7 DAYS</button>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 min-h-[400px]">
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">Average Daily Activity</p>
              <h3 className="text-3xl font-headline font-extrabold">{Math.floor(avgStepsLast7).toLocaleString()} <span className="text-sm font-medium text-celestial-tertiary ml-2">steps/day</span></h3>
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
                  labelStyle={{ display: 'none' }}
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
            <h4 className="font-headline font-bold">Sleep Target</h4>
            <p className="text-2xl font-extrabold text-glow text-celestial-secondary">
              {todayData?.sleepHours}h {todayData?.sleepMinutes}m
            </p>
            <p className="text-xs text-white/40">Tonight's current duration</p>
          </div>
        </div>
        <div className="glass-card p-8 rounded-[2rem] flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-celestial-tertiary/20 flex items-center justify-center">
            <Droplet className="text-celestial-tertiary w-8 h-8" />
          </div>
          <div>
            <h4 className="font-headline font-bold">Hydration</h4>
            <p className="text-2xl font-extrabold text-glow text-celestial-tertiary">{todayData?.hydrationLiters.toFixed(1)}L</p>
            <p className="text-xs text-white/40">
              {todayData ? Math.floor((todayData.hydrationLiters / todayData.hydrationGoal)*100) : 0}% of daily target reached
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
