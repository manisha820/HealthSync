import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { calculateStreakData } from '../lib/insightGenerator';

export interface DailyHealthRecord {
  id?: string;
  userId?: string;
  date: string;
  age: number;
  weight: number;
  gender: string;
  hydrationLiters: number;
  hydrationGoal: number;
  sleepHours: number;
  sleepMinutes: number;
  deepSleepMinutes: number;
  remCycles: number;
  heartRate: number;
  dailySteps: number;
  stepTarget: number;
  sleepTimerRunning: boolean;
  sleepTimerStartTime?: number;
}

interface DataContextType {
  todayData: DailyHealthRecord | null;
  historyData: Record<string, DailyHealthRecord>;
  updateData: (updates: Partial<DailyHealthRecord>) => void;
  addWater: (amountLiters: number) => void;
  startSleepTimer: () => void;
  stopSleepTimer: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const mapToLocal = (row: any): DailyHealthRecord => ({
  id: row.id,
  date: row.date,
  age: row.age,
  weight: row.weight,
  gender: row.gender,
  hydrationLiters: row.hydration_liters,
  hydrationGoal: row.hydration_goal,
  sleepHours: row.sleep_hours,
  sleepMinutes: row.sleep_minutes,
  deepSleepMinutes: row.deep_sleep_minutes,
  remCycles: row.rem_cycles,
  heartRate: row.heart_rate,
  dailySteps: row.daily_steps,
  stepTarget: row.step_target,
  sleepTimerRunning: row.sleep_timer_running,
  sleepTimerStartTime: row.sleep_timer_start_time
});

const mapToDb = (rec: Partial<DailyHealthRecord>) => {
  const payload: any = {};
  if (rec.age !== undefined) payload.age = rec.age;
  if (rec.weight !== undefined) payload.weight = rec.weight;
  if (rec.gender !== undefined) payload.gender = rec.gender;
  if (rec.hydrationLiters !== undefined) payload.hydration_liters = rec.hydrationLiters;
  if (rec.hydrationGoal !== undefined) payload.hydration_goal = rec.hydrationGoal;
  if (rec.sleepHours !== undefined) payload.sleep_hours = rec.sleepHours;
  if (rec.sleepMinutes !== undefined) payload.sleep_minutes = rec.sleepMinutes;
  if (rec.deepSleepMinutes !== undefined) payload.deep_sleep_minutes = rec.deepSleepMinutes;
  if (rec.remCycles !== undefined) payload.rem_cycles = rec.remCycles;
  if (rec.heartRate !== undefined) payload.heart_rate = rec.heartRate;
  if (rec.dailySteps !== undefined) payload.daily_steps = rec.dailySteps;
  if (rec.stepTarget !== undefined) payload.step_target = rec.stepTarget;
  if (rec.sleepTimerRunning !== undefined) payload.sleep_timer_running = rec.sleepTimerRunning;
  if (rec.sleepTimerStartTime !== undefined) payload.sleep_timer_start_time = rec.sleepTimerStartTime;
  return payload;
};

const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [todayData, setTodayData] = useState<DailyHealthRecord | null>(null);
  const [historyData, setHistoryData] = useState<Record<string, DailyHealthRecord>>({});

  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      setTodayData(null);
      setHistoryData({});
    }
  }, [user]);

  const refreshData = async () => {
    if (!user) return;
    
    // Fetch all history for user
    const { data: records, error } = await supabase
      .from('daily_health_records')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const hist: Record<string, DailyHealthRecord> = {};
    let todayRec = null;
    const todayStr = getTodayDateString();

    records?.forEach(row => {
      const loc = mapToLocal(row);
      hist[loc.date] = loc;
      if (loc.date === todayStr) {
        todayRec = loc;
      }
    });

    if (!todayRec) {
      // Create new record for today via RPC or insert
      const newRec = {
        user_id: user.id,
        date: todayStr,
        ...mapToDb({
          age: 28, weight: 70, gender: 'other', hydrationLiters: 0, hydrationGoal: 3, 
          sleepHours: 0, sleepMinutes: 0, deepSleepMinutes: 0, remCycles: 0, 
          heartRate: 70, dailySteps: 0, stepTarget: 10000, sleepTimerRunning: false
        })
      };
      
      const { data: inserted, error: insertError } = await supabase
        .from('daily_health_records')
        .insert([newRec])
        .select()
        .single();
        
      if (!insertError && inserted) {
        const parsed = mapToLocal(inserted);
        todayRec = parsed;
        hist[parsed.date] = parsed;
      }
    }

    // Smart goal adjustments based on streak
    if (todayRec) {
      const { streak } = calculateStreakData(hist);
      let adjustedTarget = todayRec.stepTarget;
      
      let needsDbUpdate = false;
      if (streak >= 7 && todayRec.stepTarget < 15000) {
        adjustedTarget += 500;
        needsDbUpdate = true;
      } else if (streak === 0 && Object.keys(hist).length > 3 && todayRec.stepTarget > 5000) {
        adjustedTarget -= 500;
        needsDbUpdate = true;
      }

      if (needsDbUpdate) {
        await supabase
          .from('daily_health_records')
          .update({ step_target: adjustedTarget })
          .eq('user_id', user.id)
          .eq('date', todayStr);
        todayRec.stepTarget = adjustedTarget;
      }
    }

    setHistoryData(hist);
    if (todayRec) setTodayData(todayRec);
  };

  const updateData = async (updates: Partial<DailyHealthRecord>) => {
    if (user && todayData) {
      if (updates.hydrationLiters && updates.hydrationLiters > todayData.hydrationGoal * 1.5) {
        alert("Exceeding recommended limits may be harmful to your health.");
        return; 
      }
      if (updates.sleepHours && updates.sleepHours > 12) {
        alert("Exceeding recommended sleep limits may be harmful to your health.");
        return; 
      }

      const payload = mapToDb(updates);
      const todayStr = getTodayDateString();

      // Optimistic locally
      setTodayData(prev => prev ? { ...prev, ...updates } : null);

      const { error } = await supabase
        .from('daily_health_records')
        .update(payload)
        .eq('user_id', user.id)
        .eq('date', todayStr);

      if (error) {
        console.error("Failed to sync record: ", error);
        refreshData(); // rollback
      }
    }
  };

  const addWater = (amountLiters: number) => {
    if (user && todayData) {
      const newHydration = todayData.hydrationLiters + amountLiters;
      updateData({ hydrationLiters: newHydration });
    }
  };

  const startSleepTimer = () => {
    updateData({ 
      sleepTimerRunning: true, 
      sleepTimerStartTime: Date.now() 
    });
  };

  const stopSleepTimer = () => {
    if (!todayData || !todayData.sleepTimerStartTime) return;
    const now = Date.now();
    const diff = now - todayData.sleepTimerStartTime;
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);

    const deepSleep = Math.floor((diff / (1000 * 60)) * 0.25);
    const rems = Math.floor(h / 1.5);

    updateData({
      sleepTimerRunning: false,
      sleepTimerStartTime: undefined,
      sleepHours: h,
      sleepMinutes: m,
      deepSleepMinutes: deepSleep,
      remCycles: rems
    });
  };

  return (
    <DataContext.Provider value={{ todayData, historyData, updateData, addWater, startSleepTimer, stopSleepTimer }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
