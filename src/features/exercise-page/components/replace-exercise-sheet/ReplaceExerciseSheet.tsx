import { useEffect, useMemo, useState } from "react";
import { ActionPopup } from "@/shared/ui/ActionPopup";
import { Level2ActionButton } from "@/shared/ui/ActionButton";
import actionStyles from "@/shared/ui/ActionButton/ActionButton.module.css";
import { getReplaceSuggestions } from "@/features/exercise-page/mocks/replaceSuggestions";
import { WorkoutExerciseMuscleLabel } from "@/features/workout-list/components/WorkoutExerciseMuscleLabel";
import { WorkoutExerciseTitle } from "@/features/workout-list/components/WorkoutExerciseTitle";
import styles from "./ReplaceExerciseSheet.module.css";

type ReplaceExerciseSheetProps = {
  open: boolean;
  exerciseId: string;
  onClose: () => void;
  onSelect?: (suggestionId: string) => void;
  onViewAll?: () => void;
};

export function ReplaceExerciseSheet({
  open,
  exerciseId,
  onClose,
  onSelect,
  onViewAll,
}: ReplaceExerciseSheetProps) {
  const suggestions = useMemo(
    () => getReplaceSuggestions(exerciseId),
    [exerciseId],
  );

  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (!open || suggestions.length === 0) return;
    setSelectedId(suggestions[0].id);
  }, [open, exerciseId, suggestions]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const selectedExercise =
    suggestions.find((item) => item.id === selectedId) ?? suggestions[0];

  const handleConfirm = () => {
    if (!selectedExercise) return;
    onSelect?.(selectedExercise.id);
    onClose();
  };

  const handleViewAll = () => {
    onViewAll?.();
    onClose();
  };

  return (
    <ActionPopup open={open} title="Заменить" onClose={onClose}>
      <div className={styles.content}>
        <ul className={styles.list} role="radiogroup" aria-label="Рекомендуемые упражнения">
          {suggestions.map((item) => (
            <li key={item.id}>
              <label className={styles.card}>
                <div className={styles.cardMain}>
                  <div className={styles.thumbWrap}>
                    <img
                      className={styles.thumb}
                      src={item.thumbnailSrc}
                      alt=""
                      width={72}
                      height={72}
                      draggable={false}
                    />
                  </div>
                  <div className={styles.body}>
                    <WorkoutExerciseTitle as="span">
                      {item.title}
                    </WorkoutExerciseTitle>
                    {item.muscleGroup ? (
                      <WorkoutExerciseMuscleLabel>
                        {item.muscleGroup}
                      </WorkoutExerciseMuscleLabel>
                    ) : null}
                  </div>
                </div>
                <input
                  type="radio"
                  name="replace-suggestion"
                  className={styles.radio}
                  checked={selectedId === item.id}
                  onChange={() => setSelectedId(item.id)}
                />
              </label>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <Level2ActionButton
            block
            className={styles.viewAllBtn}
            onClick={handleViewAll}
          >
            Посмотреть все упражнения
          </Level2ActionButton>
          <button
            type="button"
            className={`${actionStyles.primary} ${styles.sheetAction} ${styles.confirmBtn}`}
            disabled={!selectedExercise}
            onClick={handleConfirm}
          >
            <span className={styles.confirmHint}>Заменить на</span>
            <span className={styles.confirmTitle}>
              {selectedExercise?.title ?? ""}
            </span>
          </button>
        </div>
      </div>
    </ActionPopup>
  );
}
