import type { CSSProperties } from "react";

import { IconSignalBars } from "@/shared/icons";

import { getDifficultyStyle } from "@/features/program-weeks/utils/difficulty";

import type { ProgramDifficulty } from "@/features/program-weeks/types/programWeeks";

import styles from "./DifficultyBadge.module.css";



type DifficultyBadgeProps = {

  difficulty: ProgramDifficulty;

};



export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {

  const { label, color, activeBars } = getDifficultyStyle(difficulty);



  return (

    <span

      className={styles.badge}

      style={

        {

          "--difficulty-color": color,

        } as CSSProperties

      }

    >

      <span className={styles.content}>

        <span className={styles.label}>{label}</span>

        <IconSignalBars

          size={16}

          activeCount={activeBars}

          activeColor={color}

          className={styles.icon}

        />

      </span>

    </span>

  );

}

