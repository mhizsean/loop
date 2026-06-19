import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { todayISO } from "./dates";
import {
    applyCompletion,
    isDueToday,
    makeCompletion,
    undoCompletion,
} from "./schedule";
import type {
    AffirmationTone,
    AppMeta,
    Completion,
    Habit,
    Reminder,
    Schedule,
    ThemePreference,
} from "./types";
import { emptyReminder } from "./types";

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface HabitDraft {
  name: string;
  schedule: Schedule;
  reminder?: Reminder;
}

interface LoopState {
  habits: Habit[];
  completions: Completion[];
  meta: AppMeta;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  addHabit: (draft: HabitDraft) => Habit;
  updateHabit: (id: string, patch: Partial<Omit<Habit, "id">>) => void;
  deleteHabit: (id: string) => void;
  toggleComplete: (id: string, day?: string) => void;
  setTheme: (t: ThemePreference) => void;
  setAffirmationTone: (t: AffirmationTone) => void;
  setAffirmationEnabled: (v: boolean) => void;
  getAffirmationFor: (day?: string) => string | null;
  setAffirmationFor: (text: string, day?: string) => void;
}

const initialMeta: AppMeta = {
  affirmationByDate: {},
  theme: "system",
  affirmationTone: "gentle",
  affirmationEnabled: true,
};

export const useLoopStore = create<LoopState>()(
  persist(
    (set, get) => ({
      habits: [],
      completions: [],
      meta: initialMeta,

      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      addHabit: (draft) => {
        const today = todayISO();
        const habit: Habit = {
          id: uid(),
          name: draft.name.trim(),
          schedule: draft.schedule,
          reminder: draft.reminder ?? emptyReminder(),
          createdAt: new Date().toISOString(),
          lastCompletedAt: null,
          nextDueAt: null,
        };

        void today;
        set((s) => ({ habits: [...s.habits, habit] }));
        return habit;
      },

      updateHabit: (id, patch) =>
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
        })),

      deleteHabit: (id) =>
        set((s) => ({
          habits: s.habits.filter((h) => h.id !== id),
          completions: s.completions.filter((c) => c.habitId !== id),
        })),

      toggleComplete: (id, day = todayISO()) => {
        const habit = get().habits.find((h) => h.id === id);
        if (!habit) return;

        const alreadyDone = habit.lastCompletedAt === day;

        if (alreadyDone) {
          const prior = get()
            .completions.filter((c) => c.habitId === id && c.completedOn < day)
            .sort((a, b) => (a.completedOn < b.completedOn ? 1 : -1))[0];
          const reverted = undoCompletion(habit, prior?.completedOn ?? null);
          set((s) => ({
            habits: s.habits.map((h) => (h.id === id ? reverted : h)),
            completions: s.completions.filter(
              (c) => !(c.habitId === id && c.completedOn === day),
            ),
          }));
        } else {
          const done = applyCompletion(habit, day);
          const record = makeCompletion(id, day);
          set((s) => ({
            habits: s.habits.map((h) => (h.id === id ? done : h)),
            completions: [
              ...s.completions.filter((c) => c.id !== record.id),
              record,
            ],
          }));
        }
      },

      setTheme: (t) => set((s) => ({ meta: { ...s.meta, theme: t } })),
      setAffirmationTone: (t) =>
        set((s) => ({ meta: { ...s.meta, affirmationTone: t } })),
      setAffirmationEnabled: (v) =>
        set((s) => ({ meta: { ...s.meta, affirmationEnabled: v } })),

      getAffirmationFor: (day = todayISO()) =>
        get().meta.affirmationByDate[day] ?? null,

      setAffirmationFor: (text, day = todayISO()) =>
        set((s) => ({
          meta: {
            ...s.meta,
            affirmationByDate: { ...s.meta.affirmationByDate, [day]: text },
          },
        })),
    }),
    {
      name: "loop-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        habits: s.habits,
        completions: s.completions,
        meta: s.meta,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      version: 1,
    },
  ),
);

export function selectToday(state: LoopState, day = todayISO()) {
  const due = state.habits.filter((h) => isDueToday(h, day));
  const upcoming = state.habits.filter((h) => !isDueToday(h, day));
  return { due, upcoming };
}

export function selectRemainingCount(state: LoopState, day = todayISO()) {
  return state.habits.filter(
    (h) => isDueToday(h, day) && h.lastCompletedAt !== day,
  ).length;
}
