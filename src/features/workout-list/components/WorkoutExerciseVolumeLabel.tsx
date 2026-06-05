import styles from "./WorkoutExerciseVolumeLabel.module.css";

type WorkoutExerciseVolumeLabelProps = {
  children: string;
  completed?: boolean;
  className?: string;
};

export function WorkoutExerciseVolumeLabel({
  children,
  completed = false,
  className = "",
}: WorkoutExerciseVolumeLabelProps) {
  return (
    <p
      className={[
        styles.label,
        completed ? styles.labelCompleted : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}
