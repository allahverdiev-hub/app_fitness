# Структура `src/`

```
src/
├── main.tsx
├── app/                         # App, табы, WorkoutsFlow
├── shell/                       # MobileFrame, StatusBar, BottomTabNav
├── shared/
│   ├── ui/                      # FloatingIsland, ActionPopup, bottom-sheet, …
│   ├── icons/
│   ├── styles/                  # global, tokens, responsive
│   └── lib/                     # formatDuration, workoutElapsed, kinescope
└── features/
    ├── workouts/                # Навигация list ↔ exercise, таймер сессии
    │   ├── WorkoutsFlow.tsx
    │   ├── hooks/useWorkoutTimer.ts
    │   └── mocks/workoutSession.ts   # Единый источник моков (листинг + карусель)
    ├── workout-list/            # Листинг тренировки, drag-reorder, нижняя панель
    └── exercise-page/           # Страница упражнения (карусель, подходы, sheet’ы)
        ├── ExercisePage.tsx
        ├── config/              # media, techniqueVideo
        ├── mocks/               # descriptions, diary (данные сессии — в workouts/)
        ├── types/, utils/, hooks/
        └── components/          # bottom-bar, carousel, chart, add-set-sheet, …
```

Иконки и картинки: `public/icons/`, `public/media/`. Импорты: `@/` → `src/` (`vite.config.ts`).
