import { IconReorder } from "@/shared/icons";
import { Level2ActionButton } from "@/shared/ui/ActionButton";
import type { WorkoutListExerciseItem } from "@/features/workout-list/types/workoutOverview";
import { useDragReorder } from "@/features/workout-list/hooks/useDragReorder";
import { buildExerciseSections } from "@/features/workout-list/utils/buildExerciseSections";
import { WorkoutExerciseCard } from "@/features/workout-list/components/WorkoutExerciseCard";
import styles from "./WorkoutExerciseList.module.css";

type WorkoutExerciseListProps = {
  exercises: WorkoutListExerciseItem[];
  editing: boolean;
  onReorder: (exercises: WorkoutListExerciseItem[]) => void;
  onOpenExercise?: (exerciseId: string) => void;
  onMenu?: (exercise: WorkoutListExerciseItem) => void;
  onAddExercise?: () => void;
};

export function WorkoutExerciseList({
  exercises,
  editing,
  onReorder,
  onOpenExercise,
  onMenu,
  onAddExercise,
}: WorkoutExerciseListProps) {
  const {
    listRef,
    setItemRef,
    startDrag,
    updateDrag,
    finishDrag,
    getItemStyle,
    dropIndicator,
    suppressTransitions,
    isDragging,
    draggingIndex,
    releasingIndex,
  } = useDragReorder(exercises, onReorder);

  const sections = buildExerciseSections(exercises);

  return (
    <div className={styles.wrap}>
      <div
        ref={listRef}
        className={`${styles.listAnchor} ${isDragging ? styles.listDragging : ""} ${suppressTransitions ? styles.listNoAnim : ""}`}
      >
        {dropIndicator ? (
          <div
            className={styles.dropZone}
            style={{ top: dropIndicator.top, height: dropIndicator.height }}
            aria-hidden
          />
        ) : null}
        <ul
          className={`${styles.list} ${editing ? styles.listEditing : ""}`}
        >
        {sections.map((group, groupIndex) => (
          <li
            key={group.title ?? `main-${groupIndex}`}
            className={`${styles.section} ${group.title ? styles.sectionLabeled : ""}`}
          >
            {group.title ? (
              <h2 className={styles.sectionTitle}>{group.title}</h2>
            ) : null}
            <ul className={styles.sectionList}>
              {group.entries.map(({ exercise, index }) => (
                <li
                  key={exercise.id}
                  ref={setItemRef(index)}
                  className={`${styles.listItem} ${editing ? styles.listItemEditing : ""} ${draggingIndex === index ? styles.listItemActive : ""} ${releasingIndex === index ? styles.listItemReleasing : ""}`}
                  style={getItemStyle(index)}
                >
                  <div
                    className={`${styles.dragHandleSlot} ${editing ? styles.dragHandleSlotVisible : ""}`}
                    aria-hidden={!editing}
                  >
                    <button
                      type="button"
                      className={styles.dragHandle}
                      aria-label={`Переместить: ${exercise.title}`}
                      tabIndex={editing ? 0 : -1}
                      disabled={!editing}
                      onPointerDown={(event) => startDrag(event, index)}
                      onPointerMove={updateDrag}
                      onPointerUp={finishDrag}
                      onPointerCancel={finishDrag}
                    >
                      <IconReorder size={20} />
                    </button>
                  </div>
                  <WorkoutExerciseCard
                    exercise={exercise}
                    onPress={
                      editing ? undefined : () => onOpenExercise?.(exercise.id)
                    }
                    onMenu={() => onMenu?.(exercise)}
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
        </ul>
      </div>

      <div
        className={`${styles.addRow} ${editing ? styles.addRowVisible : ""}`}
      >
        <Level2ActionButton
          block
          tabIndex={editing ? 0 : -1}
          aria-hidden={!editing}
          onClick={onAddExercise}
        >
          Добавить упражнение
        </Level2ActionButton>
      </div>
    </div>
  );
}
