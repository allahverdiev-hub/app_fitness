import type { ReplaceSuggestionItem } from "@/features/exercise-page/mocks/replaceSuggestions";
import {
  WorkoutExerciseMuscleLabel,
  WorkoutExerciseTitle,
} from "@/shared/ui/exercise-list";
import sharedStyles from "./replaceExerciseShared.module.css";

type ReplaceExerciseOptionCardProps = {
  item: ReplaceSuggestionItem;
  checked: boolean;
  name: string;
  onChange: () => void;
};

export function ReplaceExerciseOptionCard({
  item,
  checked,
  name,
  onChange,
}: ReplaceExerciseOptionCardProps) {
  return (
    <label className={sharedStyles.card}>
      <div className={sharedStyles.cardMain}>
        <div className={sharedStyles.thumbWrap}>
          <img
            className={sharedStyles.thumb}
            src={item.thumbnailSrc}
            alt=""
            width={72}
            height={72}
            draggable={false}
          />
        </div>
        <div className={sharedStyles.body}>
          <WorkoutExerciseTitle as="span">{item.title}</WorkoutExerciseTitle>
          {item.muscleGroup ? (
            <WorkoutExerciseMuscleLabel>{item.muscleGroup}</WorkoutExerciseMuscleLabel>
          ) : null}
        </div>
      </div>
      <input
        type="radio"
        name={name}
        className={sharedStyles.radio}
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
}
