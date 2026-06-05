import { PageTitle } from "@/shared/ui/PageTitle/PageTitle";
import styles from "./TabPlaceholder.module.css";

type TabPlaceholderProps = {
  title: string;
};

export function TabPlaceholder({ title }: TabPlaceholderProps) {
  return (
    <div className={styles.page}>
      <PageTitle className={styles.title}>{title}</PageTitle>
      <p className={styles.hint}>Раздел в разработке</p>
    </div>
  );
}
