import type { ElementType } from "react";
import styles from "./WorkoutExerciseTitle.module.css";

type WorkoutExerciseTitleProps = {
  children: string;
  as?: ElementType;
  className?: string;
};

export function WorkoutExerciseTitle({
  children,
  as: Tag = "h2",
  className = "",
}: WorkoutExerciseTitleProps) {
  return (
    <Tag className={[styles.title, className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
