import {
    addDays,
    shortDateLabel,
    todayISO,
    weekdayOf
} from "./dates";
import type { Completion, Habit } from "./types";

/** Is this habit due on the given day ("YYYY-MM-DD", defaults to today)? */
export function isDueToday(habit: Habit, today: string = todayISO()): boolean {
  switch (habit.schedule.type) {
    case "daily":
      return true;
    case "weekdays":
      return habit.schedule.days.includes(weekdayOf(today));
    case "interval":
      // due if never done, or the next due date has arrived/passed
      return !habit.nextDueAt || today >= habit.nextDueAt;
  }
}

/** Has this habit already been completed on the given day? */
export function isCompletedOn(habit: Habit, day: string = todayISO()): boolean {
  return habit.lastCompletedAt === day;
}

export function applyCompletion(habit: Habit, day: string = todayISO()): Habit {
  const updated: Habit = { ...habit, lastCompletedAt: day };
  if (habit.schedule.type === "interval") {
    updated.nextDueAt = addDays(day, habit.schedule.everyNDays);
  }
  return updated;
}

export function undoCompletion(
  habit: Habit,
  previousCompletion: string | null,
): Habit {
  const updated: Habit = { ...habit, lastCompletedAt: previousCompletion };
  if (habit.schedule.type === "interval") {
    updated.nextDueAt = previousCompletion
      ? addDays(previousCompletion, habit.schedule.everyNDays)
      : null;
  }
  return updated;
}

export function makeCompletion(
  habitId: string,
  day: string = todayISO(),
): Completion {
  return { id: `${habitId}:${day}`, habitId, completedOn: day };
}

export function nextDueDate(
  habit: Habit,
  from: string = todayISO(),
): string | null {
  switch (habit.schedule.type) {
    case "daily":
      return addDays(from, 1);
    case "interval":
      if (habit.nextDueAt && habit.nextDueAt > from) return habit.nextDueAt;
      return addDays(habit.lastCompletedAt ?? from, habit.schedule.everyNDays);
    case "weekdays": {
      const days = habit.schedule.days;
      if (days.length === 0) return null;
      for (let i = 1; i <= 7; i++) {
        const candidate = addDays(from, i);
        if (days.includes(weekdayOf(candidate))) return candidate;
      }
      return null;
    }
  }
}

const WD_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export function scheduleLabel(habit: Habit): string {
  const s = habit.schedule;
  switch (s.type) {
    case "daily":
      return "Daily";
    case "interval":
      return s.everyNDays === 1 ? "Daily" : `Every ${s.everyNDays} days`;
    case "weekdays":
      if (s.days.length === 7) return "Daily";
      return [...s.days]
        .sort((a, b) => a - b)
        .map((d) => WD_ABBR[d])
        .join(", ");
  }
}

export function comingUpLabel(habit: Habit, from: string = todayISO()): string {
  const base = scheduleLabel(habit);
  const next = nextDueDate(habit, from);
  return next ? `${base} · next ${shortDateLabel(next)}` : base;
}

export function partitionForToday(
  habits: Habit[],
  today: string = todayISO(),
): { due: Habit[]; upcoming: Habit[] } {
  const due: Habit[] = [];
  const upcoming: Habit[] = [];
  for (const h of habits) {
    (isDueToday(h, today) ? due : upcoming).push(h);
  }
  return { due, upcoming };
}
