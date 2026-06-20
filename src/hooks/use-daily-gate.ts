import { getAffirmation } from "@/lib/affirmation";
import { todayISO } from "@/lib/dates";
import { useLoopStore } from "@/lib/store";
import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";

export function useDailyGate() {
  const hydrated = useLoopStore((s) => s._hasHydrated);
  const enabled = useLoopStore((s) => s.meta.affirmationEnabled);
  const tone = useLoopStore((s) => s.meta.affirmationTone);

  const [showGate, setShowGate] = useState(false);
  const [text, setText] = useState<string | null>(null);

  const evaluate = useCallback(async () => {
    if (!enabled) {
      setShowGate(false);
      return;
    }
    const today = todayISO();
    const store = useLoopStore.getState();
    const cached = store.getAffirmationFor(today);
    if (cached) {
      // already seen the gate today -> just have the text, no gate
      setText(cached);
      setShowGate(false);
      return;
    }
    // first open today -> generate, cache, show the gate
    const fresh = await getAffirmation(today, tone);
    useLoopStore.getState().setAffirmationFor(fresh, today);
    setText(fresh);
    setShowGate(true);
  }, [enabled, tone]);

  // run once hydrated, and whenever enabled/tone change
  useEffect(() => {
    if (hydrated) void evaluate();
  }, [hydrated, evaluate]);

  // re-check when app returns to foreground (date may have rolled past midnight)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && hydrated) void evaluate();
    });
    return () => sub.remove();
  }, [hydrated, evaluate]);

  const dismiss = useCallback(() => setShowGate(false), []);

  return { showGate, text, dismiss };
}
