import type { ExerciseDescription as ExerciseDescriptionData } from "@/features/exercise-page/types/exercise";

import { IconPlay, IconReplace } from "@/shared/icons";

import { Level2ActionButton } from "@/shared/ui/ActionButton";

import { ExerciseDescription } from "@/features/exercise-page/components/details/ExerciseDescription";

import styles from "./ActionButtonRow.module.css";



type ActionButtonRowProps = {

  description: ExerciseDescriptionData;

  onTechnique?: () => void;

  onReplace?: () => void;

};



export function ActionButtonRow({

  description,

  onTechnique,

  onReplace,

}: ActionButtonRowProps) {

  return (

    <nav className={styles.column} aria-label="Действия с упражнением">

      <div className={styles.actionsColumn}>
        <Level2ActionButton block icon={<IconPlay size={18} />} onClick={onTechnique}>
          Техника
        </Level2ActionButton>
        <Level2ActionButton block icon={<IconReplace size={18} />} onClick={onReplace}>
          Заменить
        </Level2ActionButton>
      </div>

      <ExerciseDescription description={description} />

    </nav>

  );

}

