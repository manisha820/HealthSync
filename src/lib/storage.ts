/**
 * Simulates a real database with history using LocalStorage.
 */

const USERS_KEY = 'healthsync_users';
const CURRENT_USER_ID_KEY = 'healthsync_current_user_id';
const USER_DATA_PREFIX = 'healthsync_history_';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  onboardingCompleted: boolean;
}

export interface DailyHealthRecord {
  date: string; // YYYY-MM-DD
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
  
  // Sleep Timer logic
  sleepTimerRunning: boolean;
  sleepTimerStartTime: number | null; // Date.now() timestamp
}

const generateId = () => Math.random().toString(36).substr(2, 9);
export const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const storage = {
  getUsers: (): Record<string, User> => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  },
  
  saveUsers: (users: Record<string, User>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  
  createUser: (name: string, email: string, passwordHash: string): User => {
    const users = storage.getUsers();
    if (Object.values(users).find(u => u.email === email)) throw new Error("Email already registered");
    
    const id = generateId();
    const newUser: User = { id, name, email, passwordHash, onboardingCompleted: false };
    users[id] = newUser;
    storage.saveUsers(users);
    
    // Create first daily record placeholder
    const today = getTodayDateString();
    storage.saveUserHistory(id, {
      [today]: storage.createEmptyRecord(today)
    });
    
    return newUser;
  },

  createEmptyRecord: (dateStr: string): DailyHealthRecord => ({
    date: dateStr,
    age: 0,
    weight: 0,
    gender: '',
    hydrationLiters: 0,
    hydrationGoal: 3,
    sleepHours: 0,
    sleepMinutes: 0,
    deepSleepMinutes: 0,
    remCycles: 0,
    heartRate: 0,
    dailySteps: 0,
    stepTarget: 10000,
    sleepTimerRunning: false,
    sleepTimerStartTime: null,
  }),

  getCurrentUserId: (): string | null => {
    return localStorage.getItem(CURRENT_USER_ID_KEY);
  },
  
  setCurrentUserId: (id: string | null) => {
    if (id) localStorage.setItem(CURRENT_USER_ID_KEY, id);
    else localStorage.removeItem(CURRENT_USER_ID_KEY);
  },

  updateUser: (id: string, updates: Partial<User>) => {
    const users = storage.getUsers();
    if (users[id]) {
      users[id] = { ...users[id], ...updates };
      storage.saveUsers(users);
    }
  },

  getUserHistory: (userId: string): Record<string, DailyHealthRecord> => {
    const data = localStorage.getItem(USER_DATA_PREFIX + userId);
    return data ? JSON.parse(data) : {};
  },
  
  saveUserHistory: (userId: string, history: Record<string, DailyHealthRecord>) => {
    localStorage.setItem(USER_DATA_PREFIX + userId, JSON.stringify(history));
  },
  
  getTodayRecord: (userId: string): DailyHealthRecord => {
    const history = storage.getUserHistory(userId);
    const today = getTodayDateString();
    
    if (!history[today]) {
      // Find the most recent record to copy static traits (age, weight, goal)
      const pastDates = Object.keys(history).sort((a,b) => b.localeCompare(a));
      const newRec = storage.createEmptyRecord(today);
      if (pastDates.length > 0) {
        const last = history[pastDates[0]];
        newRec.age = last.age;
        newRec.weight = last.weight;
        newRec.gender = last.gender;
        newRec.hydrationGoal = last.hydrationGoal;
        newRec.stepTarget = last.stepTarget;
        
        // Ensure sleep timer state carries over if it was running overnight (past midnight)
        if (last.sleepTimerRunning) {
          newRec.sleepTimerRunning = last.sleepTimerRunning;
          newRec.sleepTimerStartTime = last.sleepTimerStartTime;
          // Clean it up from yesterday
          history[pastDates[0]].sleepTimerRunning = false;
        }
      }
      history[today] = newRec;
      storage.saveUserHistory(userId, history);
    }
    return history[today];
  },
  
  updateTodayRecord: (userId: string, updates: Partial<DailyHealthRecord>) => {
    const history = storage.getUserHistory(userId);
    const today = getTodayDateString();
    if (!history[today]) {
        storage.getTodayRecord(userId); // Forces creation
        const updatedHistory = storage.getUserHistory(userId);
        updatedHistory[today] = { ...updatedHistory[today], ...updates };
        storage.saveUserHistory(userId, updatedHistory);
    } else {
        history[today] = { ...history[today], ...updates };
        storage.saveUserHistory(userId, history);
    }
  }
};
