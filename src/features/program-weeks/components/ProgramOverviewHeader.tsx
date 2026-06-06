import { IconSettings } from "@/shared/icons";
import { PageTitle } from "@/shared/ui/PageTitle/PageTitle";
import { MutedIconActionButton } from "@/shared/ui/ActionButton";
import { ProgressOverview } from "@/shared/ui/ProgressOverview";
import styles from "./ProgramOverviewHeader.module.css";

type ProgramOverviewHeaderProps = {
  title: string;
  completedWorkouts: number;
  totalWorkouts: number;
  onSettings?: () => void;
};

export function ProgramOverviewHeader({
  title,
  completedWorkouts,
  totalWorkouts,
  onSettings,
}: ProgramOverviewHeaderProps) {
  return (
    <header className={styles.block}>
      <div className={styles.titleRow}>
        <PageTitle className={styles.title}>{title}</PageTitle>
        <MutedIconActionButton
          label="Настройки программы"
          className={styles.settingsBtn}
          onClick={onSettings}
        >
          <IconSettings size={18} />
        </MutedIconActionButton>
      </div>
      <ProgressOverview
        completed={completedWorkouts}
        total={totalWorkouts}
        variant="program"
        className={styles.progress}
        ariaLabel={`Выполнено тренировок по программе: ${completedWorkouts} из ${totalWorkouts}`}
      />
    </header>
  );
}
