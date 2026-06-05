# Структура `src/`

```
src/
├── main.tsx
├── app/                         # App, табы, tabNavigation
├── shell/                       # MobileFrame, BottomTabNav (обёртка), PlaceholderTabFlow
├── shared/
│   ├── ui/                      # ActionButton, BottomTabNav (базовый), ProgressOverview, …
│   ├── icons/
│   ├── styles/                  # global, tokens, frostedPlate, pageScrollLayout, …
│   └── lib/                     # formatDuration, workoutElapsed, tabStackNavigation, …
└── features/
    ├── catalog/                 # Заглушка таба «Справочник»
    ├── profile/                 # Заглушка таба «Профиль»
    ├── workouts-hub/            # Хаб программ (корень таба «Тренировки»)
    ├── workouts/                # Оркестратор таба «Тренировки»
    │   ├── WorkoutsFlow.tsx     # Стек: hub → program → list → exercise
    │   ├── hooks/, mocks/, utils/
    ├── program-weeks/           # Экран программы (недели, карточки)
    ├── workout-list/            # Листинг упражнений
    └── exercise-page/           # Страница упражнения
```

**Моки сессии:** `workouts/mocks/workoutSession.ts` — листинг и карусель.  
**Импорты:** `@/` → `src/` (`vite.config.ts`).
