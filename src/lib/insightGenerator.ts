import { DailyHealthRecord } from './storage';

export function generateInsight(data: DailyHealthRecord): string {
  const messages: string[] = [];
  
  const hydrationPercent = (data.hydrationLiters / data.hydrationGoal) * 100;
  if (hydrationPercent < 50) {
    messages.push("Your hydration levels are critically low today. This can spike your heart rate and disrupt tonight's sleep cycle.");
  } else if (hydrationPercent >= 100) {
    messages.push("Hydration targets met! Your cellular recovery is optimized for tonight.");
  }

  if (data.dailySteps < data.stepTarget / 2) {
    messages.push("Activity is running below baseline. Consider a 15-minute evening walk to support digestion and sleep pressure.");
  } else if (data.dailySteps >= data.stepTarget) {
    messages.push("You've crushed your step target—your cardiovascular system is thriving.");
  }

  if (data.sleepHours < 6) {
    messages.push("Recent sleep deficiency detected. Prioritize winding down by 9:30 PM to recover deep sleep cycles.");
  }

  if (messages.length === 0) {
    return "All biometrics are tracking harmoniously. Keep maintaining your steady rhythm.";
  }

  return messages[0];
}

export function calculateStreakData(historyData: Record<string, DailyHealthRecord>) {
  let streak = 0;
  
  // Sort dates descending
  const dates = Object.keys(historyData).sort((a, b) => b.localeCompare(a));
  
  for (const date of dates) {
    const rec = historyData[date];
    const hitWater = rec.hydrationLiters >= rec.hydrationGoal;
    const hitSteps = rec.dailySteps >= rec.stepTarget;
    // We'll consider a "win" if they hit both
    if (hitWater && hitSteps) {
      streak++;
    } else {
      break; 
    }
  }

  let rank = "Initiate";
  if (streak >= 21) rank = "Disciplined";
  else if (streak >= 7) rank = "Strong Habit";
  else if (streak >= 3) rank = "Good";

  return { streak, rank };
}
