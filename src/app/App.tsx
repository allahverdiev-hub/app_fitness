import { useState } from "react";
import { MobileFrame } from "@/shell/MobileFrame/MobileFrame";
import { BottomTabNav, type AppTabId } from "@/shell/BottomTabNav";
import { TabPlaceholder } from "@/shell/TabPlaceholder/TabPlaceholder";
import {
  WorkoutsFlow,
  type WorkoutsScreen,
} from "@/features/workouts/WorkoutsFlow";
import styles from "./App.module.css";

export function App() {
  const [activeTab, setActiveTab] = useState<AppTabId>("workouts");
  const [workoutsScreen, setWorkoutsScreen] =
    useState<WorkoutsScreen>("program");

  const showBottomTabNav =
    activeTab !== "workouts" || workoutsScreen !== "exercise";

  return (
    <MobileFrame>
      <div className={styles.shell}>
        <main className={styles.main}>
          {activeTab === "workouts" ? (
            <WorkoutsFlow
              key="workouts-flow"
              onScreenChange={setWorkoutsScreen}
            />
          ) : null}
          {activeTab === "catalog" && <TabPlaceholder title="Справочник" />}
          {activeTab === "profile" && <TabPlaceholder title="Профиль" />}
        </main>
        {showBottomTabNav ? (
          <BottomTabNav active={activeTab} onChange={setActiveTab} />
        ) : null}
      </div>
    </MobileFrame>
  );
}
