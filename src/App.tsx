import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  TrendingUp, 
  Sparkles, 
  User, 
  Settings 
} from 'lucide-react';
import { cn } from './lib/utils';

// Screens
import Dashboard from './components/screens/Dashboard';
import Insights from './components/screens/Insights';
import Assistant from './components/screens/Assistant';
import Onboarding from './components/screens/Onboarding';

type Screen = 'dashboard' | 'insights' | 'assistant' | 'profile' | 'onboarding';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <Onboarding onComplete={() => setCurrentScreen('dashboard')} />;
      case 'dashboard':
        return <Dashboard />;
      case 'insights':
        return <Insights />;
      case 'assistant':
        return <Assistant />;
      case 'profile':
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-white/40">Profile screen coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-celestial-bg relative overflow-x-hidden">
      {/* Background Flourish */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-celestial-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-celestial-tertiary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Header (Hidden in onboarding) */}
      <AnimatePresence>
        {currentScreen !== 'onboarding' && (
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full top-0 sticky z-50 bg-celestial-bg/80 backdrop-blur-md flex justify-between items-center px-6 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                <img 
                  alt="User profile" 
                  className="w-full h-full object-cover" 
                  src="https://picsum.photos/seed/user/100/100" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tighter text-celestial-accent font-headline">HealthSync</span>
            </div>
            <button className="text-celestial-accent hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <Settings className="w-6 h-6" />
            </button>
          </motion.header>
        )}
      </AnimatePresence>

      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Hidden in onboarding) */}
      <AnimatePresence>
        {currentScreen !== 'onboarding' && (
          <motion.nav 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[450px] rounded-[2rem] z-50 bg-celestial-surface/80 backdrop-blur-xl shadow-2xl border border-white/5 px-4 py-2 flex justify-around items-center"
          >
            <NavItem 
              active={currentScreen === 'dashboard'} 
              onClick={() => setCurrentScreen('dashboard')} 
              icon={<LayoutGrid className="w-6 h-6" />}
              label="Home"
            />
            <NavItem 
              active={currentScreen === 'insights'} 
              onClick={() => setCurrentScreen('insights')} 
              icon={<TrendingUp className="w-6 h-6" />}
              label="Insights"
            />
            <NavItem 
              active={currentScreen === 'assistant'} 
              onClick={() => setCurrentScreen('assistant')} 
              icon={<Sparkles className="w-6 h-6" />}
              label="Assistant"
            />
            <NavItem 
              active={currentScreen === 'profile'} 
              onClick={() => setCurrentScreen('profile')} 
              icon={<User className="w-6 h-6" />}
              label="Profile"
            />
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: ReactNode; 
  label: string;
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-3 transition-all duration-300 rounded-full",
        active ? "bg-white/10 text-celestial-accent" : "text-white/40 hover:text-white/60"
      )}
    >
      <div className={cn("transition-transform duration-300", active && "scale-110")}>
        {icon}
      </div>
      <span className="font-body font-medium text-[10px] uppercase tracking-widest mt-1">{label}</span>
    </button>
  );
}
