import { useState } from "react";
import { MobileFrame } from "@/shell/MobileFrame/MobileFrame";
import { BottomTabNav, type AppTabId } from "@/shell/BottomTabNav";
import { CatalogFlow } from "@/features/catalog/CatalogFlow";
import { ProfileFlow } from "@/features/profile/ProfileFlow";
import { WorkoutsFlow } from "@/features/workouts/WorkoutsFlow";
import {
  bumpTabPopSignal,
  INITIAL_TAB_POP_SIGNALS,
  type TabPopSignals,
} from "./tabNavigation";
import styles from "./App.module.css";

export function App() {
  const [activeTab, setActiveTab] = useState<AppTabId>("workouts");
  const [tabPopSignals, setTabPopSignals] = useState<TabPopSignals>(
    INITIAL_TAB_POP_SIGNALS,
  );

  const handleTabReselect = (tab: AppTabId) => {
    setTabPopSignals((signals) => bumpTabPopSignal(signals, tab));
  };

  return (
    <MobileFrame>
      <div className={styles.shell}>
        <main className={styles.main}>
          <div
            className={styles.flowLayer}
            hidden={activeTab !== "workouts"}
            aria-hidden={activeTab !== "workouts"}
          >
            <WorkoutsFlow popSignal={tabPopSignals.workouts} />
          </div>
          {activeTab === "catalog" ? (
            <CatalogFlow
              key="catalog-flow"
              popSignal={tabPopSignals.catalog}
            />
          ) : null}
          {activeTab === "profile" ? (
            <ProfileFlow
              key="profile-flow"
              popSignal={tabPopSignals.profile}
            />
          ) : null}
        </main>
        <BottomTabNav
          active={activeTab}
          onChange={setActiveTab}
          onReselect={handleTabReselect}
        />
      </div>
    </MobileFrame>
  );
}
