import type { AppTabId } from "@/shell/BottomTabNav";

export type TabPopSignals = Record<AppTabId, number>;

export const INITIAL_TAB_POP_SIGNALS: TabPopSignals = {
  workouts: 0,
  catalog: 0,
  profile: 0,
};

export function bumpTabPopSignal(
  signals: TabPopSignals,
  tab: AppTabId,
): TabPopSignals {
  return { ...signals, [tab]: signals[tab] + 1 };
}
