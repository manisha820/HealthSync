import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  Circle,
  Play
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState('female');
  const [weight, setWeight] = useState(68);

  return (
    <div className="relative px-6 py-8 max-w-4xl mx-auto flex flex-col gap-12 min-h-screen">
      {/* Header for onboarding */}
      <header className="flex justify-between items-center w-full">
        <span className="text-2xl font-extrabold tracking-tighter text-celestial-accent font-headline">HealthSync</span>
        <div className="flex items-center gap-4">
          <span className="text-white/40 font-label text-sm">Step 1 of 3</span>
          <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-celestial-accent" />
          </div>
        </div>
      </header>

      {/* Hero Editorial Moment */}
      <section className="mt-8 flex flex-col gap-4">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-headline font-extrabold text-5xl md:text-7xl text-white leading-tight tracking-tighter"
        >
          Begin your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestial-accent to-celestial-tertiary">Celestial Journey</span>
        </motion.h1>
        <p className="font-body text-white/60 text-lg max-w-md">
          We need a few details to calibrate your vitality engine and synchronize with your circadian rhythm.
        </p>
      </section>

      {/* Onboarding Form */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Visual Element */}
        <div className="md:col-span-4 h-full hidden md:block">
          <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden glass-card vitality-glow">
            <img 
              className="w-full h-full object-cover opacity-60" 
              src="https://picsum.photos/seed/nebula/800/1000" 
              alt="Cosmic art"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-celestial-bg to-transparent">
              <span className="font-headline font-bold text-2xl text-celestial-accent mb-2">Sync</span>
              <p className="text-white/40 text-sm">Personalizing your metabolic clock...</p>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="md:col-span-8 flex flex-col gap-8">
          {/* Age selection */}
          <div className="glass-card p-8 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-6">
              <label className="font-headline font-bold text-xl tracking-tight">Your Age</label>
              <span className="text-celestial-accent font-bold text-3xl">{age}</span>
            </div>
            <div className="relative w-full h-12 flex items-center">
              <input 
                type="range" 
                min="18" 
                max="80" 
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-celestial-accent"
              />
              <div className="flex justify-between w-full absolute top-10">
                {['18', '25', '35', '45', '55+'].map(l => (
                  <span key={l} className="text-xs font-label text-white/30">{l}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identity */}
            <div className="bg-celestial-surface p-8 rounded-[2.5rem]">
              <h3 className="font-headline font-bold text-xl mb-6">Identity</h3>
              <div className="flex flex-col gap-3">
                {['Female', 'Male', 'Non-binary'].map(g => (
                  <button 
                    key={g}
                    onClick={() => setGender(g.toLowerCase())}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl transition-all",
                      gender === g.toLowerCase() 
                        ? "bg-celestial-accent/20 text-celestial-accent border border-celestial-accent/30" 
                        : "bg-white/5 text-white/40 hover:bg-white/10"
                    )}
                  >
                    <span className="font-medium">{g}</span>
                    {gender === g.toLowerCase() ? <CheckCircle className="w-5 h-5 fill-current" /> : <Circle className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div className="bg-celestial-surface p-8 rounded-[2.5rem] flex flex-col justify-between">
              <div>
                <h3 className="font-headline font-bold text-xl mb-2">Weight</h3>
                <p className="text-sm text-white/40 mb-6">Used for precision metrics</p>
              </div>
              <div className="flex items-baseline gap-2">
                <input 
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  className="bg-transparent text-6xl font-headline font-extrabold text-white border-none focus:ring-0 w-24 p-0" 
                  placeholder="68"
                />
                <span className="text-2xl font-bold text-celestial-accent/50">KG</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 rounded-full text-xs font-label bg-white/10 text-celestial-accent border border-white/5">METRIC (KG)</button>
                <button className="px-4 py-2 rounded-full text-xs font-label text-white/40 hover:bg-white/5 transition-colors">IMPERIAL (LB)</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assistant Preview */}
      <section className="w-full bg-celestial-surface rounded-[3rem] p-8 md:p-12 overflow-hidden relative">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-celestial-tertiary/10 border border-celestial-tertiary/20 rounded-full w-fit">
              <Sparkles className="text-celestial-tertiary w-3 h-3" />
              <span className="text-xs font-label text-celestial-tertiary uppercase tracking-widest">Assistant Preview</span>
            </div>
            <h2 className="font-headline font-bold text-3xl text-white">Your personalized flow is ready to manifest.</h2>
            <p className="font-body text-white/60 leading-relaxed">
              Based on your profile, HealthSync will prioritize evening hydration and deep-sleep recovery cycles starting tonight.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-3xl overflow-hidden glass-card vitality-glow border border-white/10">
              <img 
                className="w-full h-full object-cover" 
                src="https://picsum.photos/seed/water/800/600" 
                alt="Water ripples"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-celestial-accent/10 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center text-celestial-accent active:scale-95 transition-transform">
                  <Play className="w-8 h-8 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center gap-8 py-12">
        <button 
          onClick={onComplete}
          className="group relative px-12 py-6 bg-celestial-accent text-celestial-bg font-headline font-bold text-xl rounded-full shadow-2xl active:scale-95 transition-all duration-300"
        >
          Initialize HealthSync Flow
          <ArrowRight className="inline-block ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-sm font-label text-white/30 uppercase tracking-widest opacity-60">By continuing, you agree to our Vitality Terms</p>
      </section>
    </div>
  );
}
