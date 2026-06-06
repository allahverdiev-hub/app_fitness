# app_fitness — веб-прототип

Интерактивная **веб-версия** экрана тренировки. Открывается в обычном браузере на компьютере (Chrome, Edge, Firefox и т.д.).

Макет мобильный (ширина ~390px по центру экрана), но запуск и работа — полностью на ПК.

Шрифт **Montserrat** подключается из папки `font/` (начертания 400–700).

### Адаптив

- **&lt; 380px** — узкие телефоны, меньше отступы и миниатюры.
- **380–767px** — на весь экран (PWA-режим).
- **≥ 768px** — макет «телефон» 390px по центру с тенью.
- **Альбом** — ужаты hero и нижняя панель.

Переменные: `src/shared/styles/responsive.css`.

## Быстрый запуск (Windows)

1. Установите [Node.js](https://nodejs.org) (LTS), если ещё не установлен.
2. Дважды щёлкните **`Запуск.bat`** в папке проекта.
3. Откроется браузер с адресом `http://localhost:5173`.

Остановка: закройте чёрное окно терминала или нажмите `Ctrl+C` в нём.

## Запуск из Cursor / терминала

```bash
cd "D:\Антитренер\Прототипы\app_fitness"
npm install
npm start
```

Команда `npm start` поднимает локальный сервер и **сама открывает браузер**.

Альтернатива без автооткрытия:

```bash
npm run dev
```

## Статическая сборка (без dev-сервера)

Собрать готовые HTML/JS/CSS в папку `dist/`:

```bash
npm run build
npm run preview
```

Или дважды щёлкните **`Сборка-и-просмотр.bat`**.

Папку `dist/` можно открыть на любом веб-хостинге — это обычный сайт.

> **Важно:** файл `index.html` в корне нельзя просто открыть двойным щелчком — проект на React/Vite и требует сервер (`npm start`) или предварительной сборки (`npm run build`).

## Структура проекта

Подробнее: [src/STRUCTURE.md](src/STRUCTURE.md).

```
src/
├── app/                         # Корневое приложение
├── shell/                       # MobileFrame, StatusBar
├── shared/                      # ui, icons, styles, lib
└── features/exercise-page/      # Экран упражнения
    ├── ExercisePage.tsx
    ├── components/              # bottom-bar, carousel, chart, …
    ├── hooks/, utils/, mocks/, types/, config/

public/images/exercises/
├── thumbnails/                  # миниатюры в карусели
├── hero/                        # poster для видео
public/videos/exercises/         # hero-видео
```

## Расхождения с макетом

См. [docs/GAPS.md](docs/GAPS.md) — что ещё нужно докинуть (графика, интерактив, шрифты).

## Дальнейшая работа

| Задача | Куда смотреть |
|--------|----------------|
| Интерактив таймера | `TimerBar`, `ExercisePage` |
| Переключение упражнений | `ExerciseCarousel` |
| Модалки «Техника» / «Описание» | `features/exercise-page/components/details/ActionButtonRow` |
| Картинки упражнений | `public/images/exercises/thumbnails/`, `hero/` |
