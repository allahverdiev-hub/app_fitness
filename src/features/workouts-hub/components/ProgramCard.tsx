import { programCoverSrc } from "@/features/workouts-hub/config/programMedia";

import type { HubProgramCard } from "@/features/workouts-hub/types/workoutsHub";

import { WorkoutExerciseTitle } from "@/features/workout-list/components/WorkoutExerciseTitle";

import styles from "./ProgramCard.module.css";



type ProgramCardProps = {

  program: HubProgramCard;

  title: string;

  onOpen?: (programId: string) => void;

};



export function ProgramCard({ program, title, onOpen }: ProgramCardProps) {

  return (

    <div className={styles.item}>

      <article className={`${styles.card} ${styles.cardPending}`}>

        <button

          type="button"

          className={styles.mainBtn}

          onClick={() => onOpen?.(program.programId)}

          aria-label={`${title}, ${program.subtitle}`}

        >

          <div className={styles.thumbWrap}>

            <div className={styles.thumbInset}>

              <img

                className={styles.thumb}

                src={programCoverSrc}

                alt=""

                draggable={false}

              />

            </div>

          </div>

          <div className={styles.body}>

            <WorkoutExerciseTitle as="h3">{title}</WorkoutExerciseTitle>

            <p className={styles.subtitle}>{program.subtitle}</p>

          </div>

        </button>

      </article>

    </div>

  );

}

