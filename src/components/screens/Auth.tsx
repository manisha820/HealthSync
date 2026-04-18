import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export default function Auth() {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      if (isLogin) {
        await login(email, password); 
      } else {
        await signup(name, email, password);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="relative px-6 py-8 h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-celestial-bg -z-20" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-celestial-accent/10 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-celestial-tertiary/10 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-white/10 relative">
            <Sparkles className="w-8 h-8 text-celestial-accent" />
            <div className="absolute inset-0 bg-celestial-accent/20 blur-xl rounded-3xl" />
          </div>
          <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">
            Welcome to HealthSync
          </h1>
          <p className="text-white/40 font-body text-center">
            {isLogin ? 'Sign in to sync your vitality' : 'Create an account to begin your journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-[2.5rem] flex flex-col gap-5 border border-white/5 shadow-2xl">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2"
              >
                <label className="text-xs font-label uppercase tracking-widest text-white/50 pl-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black/20 focus:bg-white/5 border border-white/5 focus:border-celestial-accent/50 outline-none rounded-2xl px-5 py-4 text-white font-medium transition-all"
                  placeholder="Julian Alvarez"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-label uppercase tracking-widest text-white/50 pl-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/20 focus:bg-white/5 border border-white/5 focus:border-celestial-accent/50 outline-none rounded-2xl px-5 py-4 text-white font-medium transition-all"
              placeholder="julian@example.com"
            />
          </div>

          <div className="flex flex-col gap-2 mb-2">
            <label className="text-xs font-label uppercase tracking-widest text-white/50 pl-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/20 focus:bg-white/5 border border-white/5 focus:border-celestial-accent/50 outline-none rounded-2xl px-5 py-4 text-white font-medium transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-xl border border-red-400/20 text-center font-medium">
              {error}
            </p>
          )}

          <button 
            type="submit"
            className="group relative w-full py-5 bg-celestial-accent text-celestial-bg font-headline font-bold text-lg rounded-full shadow-2xl active:scale-95 transition-all duration-300 mt-2 flex items-center justify-center gap-2"
          >
            {isLogin ? 'Initialize Session' : 'Create Connection'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center mt-8 text-white/40 font-body">
          {isLogin ? "Don't have an origin point?" : "Already synchronized?"} 
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="ml-2 text-celestial-accent font-bold hover:underline transition-all"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
