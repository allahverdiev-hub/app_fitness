import type { ProgramOverview } from "@/features/program-weeks/types/programWeeks";

const week1Workouts = [
  { id: "w1-d1", dayLabel: "День 1", title: "Грудь + бицепс" },
  { id: "w1-d2", dayLabel: "День 2", title: "Спина + плечи" },
  { id: "w1-d3", dayLabel: "День 3", title: "Ноги + пресс" },
  { id: "w1-d4", dayLabel: "День 4" },
] as const;

function buildWeekWorkouts(
  prefix: string,
  titles: readonly (string | undefined)[],
) {
  return titles.map((title, index) => ({
    id: `${prefix}-d${index + 1}`,
    dayLabel: `День ${index + 1}`,
    ...(title ? { title } : {}),
  }));
}

const upperLowerWeek1Workouts = [
  { id: "ul-w1-d1", dayLabel: "День 1", title: "Верх" },
  { id: "ul-w1-d2", dayLabel: "День 2", title: "Низ" },
  { id: "ul-w1-d3", dayLabel: "День 3", title: "Верх" },
  { id: "ul-w1-d4", dayLabel: "День 4", title: "Низ" },
] as const;

export const mockProgramOverview: ProgramOverview = {
  id: "program-upper-lower",
  title: "Full body",
  weeks: [
    {
      id: "week-1",
      weekNumber: 1,
      title: "Неделя 1",
      difficulty: "light",
      description:
        "Неделя состоит из 4 лёгких тренировок, направленных на восстановление и адаптацию",
      workouts: [...week1Workouts],
    },
    {
      id: "week-2",
      weekNumber: 2,
      title: "Неделя 2",
      difficulty: "medium",
      description:
        "Неделя состоит из 4 тренировок средней интенсивности для развития силы и выносливости",
      workouts: buildWeekWorkouts("w2", [
        "Грудь + бицепс",
        "Спина + плечи",
        "Ноги + пресс",
        undefined,
      ]),
    },
    {
      id: "week-3",
      weekNumber: 3,
      title: "Неделя 3",
      difficulty: "medium",
      description:
        "Неделя состоит из 4 тренировок средней интенсивности с акцентом на технику и контроль",
      workouts: buildWeekWorkouts("w3", [
        "Грудь + бицепс",
        "Спина + плечи",
        "Ноги + пресс",
        undefined,
      ]),
    },
    {
      id: "week-4",
      weekNumber: 4,
      title: "Неделя 4",
      difficulty: "heavy",
      description:
        "Неделя состоит из 4 тяжёлых тренировок для пиковой нагрузки и прогресса",
      workouts: buildWeekWorkouts("w4", [
        "Грудь + бицепс",
        "Спина + плечи",
        "Ноги + пресс",
        undefined,
      ]),
    },
  ],
};

export const mockUpperLowerSplitOverview: ProgramOverview = {
  id: "program-upper-lower-split",
  title: "Верх и низ",
  weeks: [
    {
      id: "week-1",
      weekNumber: 1,
      title: "Неделя 1",
      difficulty: "light",
      description:
        "Неделя состоит из 4 лёгких тренировок: чередование верха и низа для адаптации",
      workouts: [...upperLowerWeek1Workouts],
    },
    {
      id: "week-2",
      weekNumber: 2,
      title: "Неделя 2",
      difficulty: "medium",
      description:
        "Неделя состоит из 4 тренировок средней интенсивности с чередованием верха и низа",
      workouts: buildWeekWorkouts("ul-w2", ["Верх", "Низ", "Верх", "Низ"]),
    },
    {
      id: "week-3",
      weekNumber: 3,
      title: "Неделя 3",
      difficulty: "medium",
      description:
        "Неделя состоит из 4 тренировок средней интенсивности с акцентом на технику",
      workouts: buildWeekWorkouts("ul-w3", ["Верх", "Низ", "Верх", "Низ"]),
    },
    {
      id: "week-4",
      weekNumber: 4,
      title: "Неделя 4",
      difficulty: "heavy",
      description:
        "Неделя состоит из 4 тяжёлых тренировок для пиковой нагрузки",
      workouts: buildWeekWorkouts("ul-w4", ["Верх", "Низ", "Верх", "Низ"]),
    },
  ],
};

/** Демо-сессия листинга: «Спина + плечи» (неделя 1, день 2) */
export const defaultProgramWorkoutId = "w1-d2";

export const mockProgramWeekPicker = [
  { id: "picker-1", weekNumber: 1, anchorId: "week-1" },
  { id: "picker-2", weekNumber: 2, anchorId: "week-2" },
  { id: "picker-3", weekNumber: 3, anchorId: "week-3" },
  { id: "picker-4", weekNumber: 4, anchorId: "week-4" },
] as const;
