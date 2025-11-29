import { DailyHealthLog, User, UserInfo } from "@prisma/client";

export interface CreateLogDto {
  userId: number;
  date: string; // YYYY-MM-DD
  height?: number;
  weight?: number;
  stepCount?: number;
  sleepMinutes?: number;
  exerciseType?: string;
  exerciseTime?: number;
  conditionStatus?: string;
}

export interface AiResultDto {
  userId: number;
  date: string;
  finalConditionScore: number;
  recommendations: Array<{
    category: string;
    content: string;
  }>;
}

export const formatSummaryResponse = (
  user: User & { userInfo: UserInfo | null },
  todayLog: DailyHealthLog,
  yesterdayLog: DailyHealthLog | null,
  dateStr: string,
  plans: any[]
) => {
  const currentHeight = todayLog.height || user.userInfo?.height || 0;
  const currentWeight = todayLog.weight || user.userInfo?.weight || 0;

  const bmi =
    currentHeight > 0 ? currentWeight / Math.pow(currentHeight / 100, 2) : 0;

  const scoreDiff =
    yesterdayLog &&
    todayLog.conditionScore !== null &&
    yesterdayLog.conditionScore !== null
      ? todayLog.conditionScore - yesterdayLog.conditionScore
      : 0;

  return {
    date: dateStr,
    user: {
      nickname: user.nickname,
      goal_weight: user.userInfo?.goalWeight,
    },
    condition: {
      score: todayLog.conditionScore ?? 0,
      status: todayLog.conditionStatus,
      comparison_text: yesterdayLog
        ? `어제보다 ${scoreDiff >= 0 ? "+" : ""}${scoreDiff}점 변했어요.`
        : "어제 기록이 없어요.",
    },
    bmi: {
      value: bmi.toFixed(1),
      status: bmi >= 25 ? "과체중" : bmi >= 18.5 ? "정상" : "저체중",
    },
    stats: {
      steps: todayLog.stepCount,
      sleep: todayLog.sleepMinutes,
      exercise: todayLog.exerciseTime,
    },
    plans: plans.map((p) => ({
      id: p.planId,
      category: p.category,
      content: p.content,
      isChecked: p.isChecked,
    })),
  };
};
