import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Mic, 
  ArrowUp,
  Droplet,
  Sun,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect, useRef } from 'react';
import { useData } from '../../contexts/DataContext';

interface RecommendationPayload {
  title: string;
  items: { icon: string; title: string; value: string; desc?: string }[];
  actionLabel: string;
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  recommendation?: RecommendationPayload;
}

export default function Assistant() {
  const { todayData, updateData } = useData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        text: `Good evening. I've analyzed your vitality sync patterns today. How can I guide you?`
      }
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, activePlan]);

  const generateReply = (userMsg: string): Message => {
    const text = userMsg.toLowerCase();
    const baseId = Date.now().toString();

    if (!todayData) {
      return { id: baseId, role: 'assistant', text: "I cannot read your metrics right now." };
    }

    // Recommendation Trigger
    if (text.includes("plan") || text.includes("recommendation") || text.includes("recovery")) {
      return {
        id: baseId,
        role: 'assistant',
        text: "Based on your recent metrics, here is a customized protocol to stabilize your circadian rhythm and hydration.",
        recommendation: {
          title: "Celestial Recovery Protocol",
          items: [
            { icon: 'drop', title: "Morning Hydration", value: "+500ml upon waking", desc: "Jumpstarts cellular recovery" },
            { icon: 'sun', title: "Light Exposure", value: "15m Sunrise walk", desc: "Anchors circadian clock" },
            { icon: 'clock', title: "Rhythm Adjustment", value: "Bedtime shifted to 10:15 PM", desc: "Optimizes deep sleep cycle based on current fatigue" }
          ],
          actionLabel: "Activate Protocol & Sync Goals"
        }
      };
    }

    if (text.includes("sleep") || text.includes("tired")) {
      return { id: baseId, role: 'assistant', text: `Your last session logged ${todayData.sleepHours}h ${todayData.sleepMinutes}m (${todayData.remCycles} REM cycles). Maintain a cool room temperature tonight to deepen recovery.` };
    }
    if (text.includes("water") || text.includes("hydration") || text.includes("drink")) {
      const remaining = todayData.hydrationGoal - todayData.hydrationLiters;
      return { id: baseId, role: 'assistant', text: remaining > 0 
        ? `You've recorded ${todayData.hydrationLiters.toFixed(1)}L. You still need ${remaining.toFixed(1)}L to meet your baseline goal.`
        : `Hydration optimized! You've successfully hit your ${todayData.hydrationGoal}L target.` };
    }
    if (text.includes("steps") || text.includes("walk") || text.includes("activity")) {
      return { id: baseId, role: 'assistant', text: `You've clocked ${todayData.dailySteps.toLocaleString()} steps today. Your target is set at ${todayData.stepTarget.toLocaleString()}.` };
    }
    
    return { id: baseId, role: 'assistant', text: "I can construct unique daily plans based on your stats. Try asking for a 'recovery plan'." };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userEntry: Message = { id: Date.now().toString(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userEntry]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateReply(userEntry.text);
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 1500);
  };

  const sendPrompt = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => {
      const btn = document.getElementById('assistant-send-btn');
      btn?.click();
    }, 100);
  };

  const handleActivatePlan = (planId: string) => {
    setActivePlan(planId);
    // Actually apply the recommendation logic to the DataContext
    updateData({
      hydrationGoal: (todayData?.hydrationGoal || 0) + 0.5,
      stepTarget: (todayData?.stepTarget || 10000) + 1000 
    });
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: 'Protocol Activated! I have adjusted your daily step target and hydration goal in your profile permanently to reflect this new rhythm.'
      }]);
    }, 1000);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'drop': return <Droplet className="text-celestial-accent w-5 h-5" />;
      case 'sun': return <Sun className="text-celestial-tertiary w-5 h-5" />;
      case 'clock': default: return <Clock className="text-celestial-secondary w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto w-full px-6 pt-4 pb-32">
      {/* Welcome */}
      <div className="mb-6 mt-4">
        <h1 className="text-4xl font-extrabold font-headline text-white tracking-tight flex items-center gap-2 mb-2">
          <Sparkles className="text-celestial-tertiary" /> Celestial Guide
        </h1>
        <p className="text-white/60 font-body">Actionable biometric recommendations.</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto w-full space-y-6 pb-20 scrollbar-hide">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex flex-col",
                msg.role === 'user' ? "items-end self-end ml-auto max-w-[85%]" : "items-start mr-auto w-full max-w-[95%] md:max-w-[85%]"
              )}
            >
              <div className={cn(
                "rounded-2xl p-5 leading-relaxed font-medium shadow-sm transition-all relative overflow-hidden",
                msg.role === 'user' 
                  ? "bg-celestial-accent/20 text-white border border-celestial-accent/20" 
                  : "glass-card text-white/90 border-l-4 border-celestial-accent"
              )}>
                <p>{msg.text}</p>
                
                {/* Embedded Recommendation Component */}
                {msg.recommendation && (
                  <div className="mt-6 pt-6 border-t border-white/10 w-full">
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="text-celestial-tertiary w-6 h-6" />
                      <h2 className="text-xl font-bold font-headline text-celestial-tertiary">{msg.recommendation.title}</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 mb-6">
                      {msg.recommendation.items.map((item, i) => (
                        <div key={i} className="bg-black/20 p-4 rounded-2xl flex items-center gap-4 border border-white/5">
                          <div className={cn("p-3 rounded-xl", 
                            item.icon === 'drop' ? "bg-celestial-accent/10" : 
                            item.icon === 'sun' ? "bg-celestial-tertiary/10" : "bg-celestial-secondary/10"
                          )}>
                            {renderIcon(item.icon)}
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{item.title}</p>
                            <p className="text-md font-bold text-white">{item.value}</p>
                            {item.desc && <p className="text-xs text-white/50 mt-1 leading-tight">{item.desc}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {activePlan === msg.id ? (
                      <button disabled className="w-full py-4 bg-green-500/20 text-green-400 font-bold rounded-xl flex items-center justify-center gap-2 border border-green-500/30">
                        <CheckCircle2 className="w-5 h-5" /> Protocol Active
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleActivatePlan(msg.id)}
                        className="w-full py-4 bg-celestial-accent text-celestial-bg font-bold rounded-xl active:scale-95 transition-all shadow-[0_0_20px_rgba(133,173,255,0.3)] hover:scale-[1.02]"
                      >
                        {msg.recommendation.actionLabel}
                      </button>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-white/30 mt-2 mx-1">
                {msg.role === 'user' ? 'You' : 'Assistant'}
              </span>
            </motion.div>
          ))}

          {isTyping && (
             <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col items-start max-w-[85%]"
           >
             <div className="glass-card rounded-2xl p-5 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-celestial-accent animate-bounce" style={{ animationDelay: '0ms' }} />
               <span className="w-2 h-2 rounded-full bg-celestial-accent animate-bounce" style={{ animationDelay: '150ms' }} />
               <span className="w-2 h-2 rounded-full bg-celestial-accent animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
           </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length < 3 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {["Generate a Recovery Plan", "How is my sleep?", "Hydration check"].map((s, i) => (
            <button 
              key={i} 
              onClick={() => sendPrompt(s)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs md:text-sm text-white/60 hover:bg-white/10 active:scale-95 transition-all focus:outline-none whitespace-nowrap"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] max-w-2xl z-40">
        <div className="glass-card rounded-full p-2 flex items-center shadow-2xl border border-white/5 bg-celestial-surface/80 backdrop-blur-xl">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 md:px-6 text-white placeholder:text-white/30 font-medium text-sm md:text-base outline-none" 
            placeholder="Ask your guide anything..." 
            type="text"
          />
          <button onClick={startVoiceInput} className="w-10 h-10 md:w-12 md:h-12 ml-2 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all">
            <Mic className="w-5 h-5" />
          </button>
          <button 
            id="assistant-send-btn"
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 md:w-12 md:h-12 ml-2 rounded-full bg-celestial-accent text-celestial-bg flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
