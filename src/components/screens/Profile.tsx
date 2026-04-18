import { motion } from 'motion/react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { LogOut, Save, User, Settings, Droplet, Footprints, Download } from 'lucide-react';
import { cn } from '../../lib/utils';
import { jsPDF } from 'jspdf';
import { supabase } from '../../lib/supabaseClient';

export default function Profile() {
  const { user, logout } = useAuth();
  const { todayData, updateData } = useData();

  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(todayData?.age || 28);
  const [weight, setWeight] = useState(todayData?.weight || 68);
  const [waterGoal, setWaterGoal] = useState(todayData?.hydrationGoal || 3);
  const [stepTarget, setStepTarget] = useState(todayData?.stepTarget || 10000);

  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (user) {
      await supabase.from('profiles').update({ name }).eq('id', user.id);
      
      updateData({
        age,
        weight,
        hydrationGoal: waterGoal,
        stepTarget: stepTarget
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(`HealthSync Report: ${user?.name || 'User'}`, 20, 20);
    doc.setFontSize(16);
    doc.text(`Personal Details`, 20, 35);
    doc.setFontSize(12);
    doc.text(`Age: ${age}  |  Weight: ${weight}kg`, 20, 45);
    
    doc.setFontSize(16);
    doc.text(`Current Active Goals`, 20, 60);
    doc.setFontSize(12);
    doc.text(`Target Hydration: ${waterGoal} Liters`, 20, 70);
    doc.text(`Daily Steps Target: ${stepTarget.toLocaleString()}`, 20, 80);
    
    doc.save('HealthSync_Report.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 pb-32">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 rounded-full bg-celestial-accent/20 flex items-center justify-center border-2 border-celestial-accent/50 text-celestial-accent font-headline font-extrabold text-2xl uppercase">
          {name.charAt(0) || 'U'}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold font-headline">{name}</h1>
          <p className="text-white/40 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details */}
        <div className="glass-card p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 mb-4 text-celestial-accent border-b border-white/5 pb-4">
            <User className="w-5 h-5" />
            <h2 className="font-headline font-bold text-lg">Personal Details</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black/20 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-celestial-accent transition-colors w-full text-white font-medium"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Age</label>
                <input 
                  type="number" 
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="bg-black/20 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-celestial-accent transition-colors w-full text-white font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Weight (kg)</label>
                <input 
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="bg-black/20 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-celestial-accent transition-colors w-full text-white font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="glass-card p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 mb-4 text-celestial-tertiary border-b border-white/5 pb-4">
            <Settings className="w-5 h-5" />
            <h2 className="font-headline font-bold text-lg">Daily Goals</h2>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label className="text-xs uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
                  <Droplet className="w-3 h-3" /> Hydration Goal
                </label>
                <span className="font-bold text-celestial-tertiary">{waterGoal.toFixed(1)}L</span>
              </div>
              <input 
                type="range" min="1" max="6" step="0.5"
                value={waterGoal} onChange={(e) => setWaterGoal(Number(e.target.value))}
                className="w-full accent-celestial-tertiary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label className="text-xs uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
                  <Footprints className="w-3 h-3" /> Daily Steps
                </label>
                <span className="font-bold text-celestial-tertiary">{stepTarget.toLocaleString()}</span>
              </div>
              <input 
                type="range" min="1000" max="30000" step="500"
                value={stepTarget} onChange={(e) => setStepTarget(Number(e.target.value))}
                className="w-full accent-celestial-tertiary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 mt-8">
        <button 
          onClick={handleExportPDF}
          className="w-full py-4 bg-blue-500/10 text-blue-400 font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-blue-500/20"
        >
          <Download className="w-5 h-5" /> Download PDF Report
        </button>

        <button 
          onClick={handleSave}
          className={cn(
            "w-full py-4 rounded-xl font-bold font-headline transition-all flex justify-center items-center gap-2 shadow-lg",
            saved ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-celestial-accent text-celestial-bg active:scale-95"
          )}
        >
          {saved ? <><Settings className="w-5 h-5" /> Saved!</> : <><Save className="w-5 h-5" /> Save Configuration</>}
        </button>

        <button 
          onClick={logout}
          className="w-full py-4 bg-red-500/10 text-red-400 font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-red-500/20"
        >
          <LogOut className="w-5 h-5" /> Terminate Session
        </button>
      </div>

    </div>
  );
}
