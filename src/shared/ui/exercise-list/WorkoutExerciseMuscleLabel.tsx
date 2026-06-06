import styles from "./WorkoutExerciseMuscleLabel.module.css";

type WorkoutExerciseMuscleLabelProps = {
  children: string;
  className?: string;
};

export function WorkoutExerciseMuscleLabel({
  children,
  className = "",
}: WorkoutExerciseMuscleLabelProps) {
  return (
    <p className={[styles.label, className].filter(Boolean).join(" ")}>
      {children}
    </p>
  );
}
