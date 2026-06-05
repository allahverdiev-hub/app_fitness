import { PageTitle } from "@/shared/ui/PageTitle/PageTitle";
import styles from "./ProgramOverviewHeader.module.css";

type ProgramOverviewHeaderProps = {
  title: string;
};

export function ProgramOverviewHeader({ title }: ProgramOverviewHeaderProps) {
  return (
    <header className={styles.block}>
      <PageTitle>{title}</PageTitle>
    </header>
  );
}
