export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Schedule =
  | { type: "daily" }
  | { type: "interval"; everyNDays: number }
  | { type: "weekdays"; days: Weekday[] };

export interface Reminder {
  enabled: boolean;
  time: string | null;
  notificationId: string | null;
}

export interface Habit {
  id: string;
  name: string;
  schedule: Schedule;
  reminder: Reminder;
  createdAt: string;
  lastCompletedAt: string | null;
  nextDueAt: string | null;
}

export interface Completion {
  id: string;
  habitId: string;
  completedOn: string;
}

export type ThemePreference = "light" | "dark" | "system";
export type AffirmationTone = "gentle" | "direct";

export interface AppMeta {
  affirmationByDate: Record<string, string>;
  theme: ThemePreference;
  affirmationTone: AffirmationTone;
  affirmationEnabled: boolean;
}

export const emptyReminder = (): Reminder => ({
  enabled: false,
  time: null,
  notificationId: null,
});
