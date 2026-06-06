import { useEffect, useMemo, useState } from "react";
import { PageTitle } from "@/shared/ui/PageTitle/PageTitle";
import { PageBackButton } from "@/shared/ui/PageBackButton";
import { SearchField } from "@/shared/ui/SearchField";
import { FilterTag, FilterTagRow } from "@/shared/ui/FilterTag";
import {
  getAllReplaceExercises,
  getReplaceMuscleCategories,
  groupReplaceExercisesByMuscle,
} from "@/features/exercise-page/mocks/replaceSuggestions";
import { ReplaceExerciseOptionCard } from "@/features/exercise-page/components/replace-exercise-sheet/ReplaceExerciseOptionCard";
import sharedStyles from "@/features/exercise-page/components/replace-exercise-sheet/replaceExerciseShared.module.css";
import styles from "./ReplaceExerciseCatalogPage.module.css";

type ReplaceExerciseCatalogPageProps = {
  exerciseId: string;
  onBack: () => void;
  onConfirm: (replacementId: string) => void;
};

export function ReplaceExerciseCatalogPage({
  exerciseId,
  onBack,
  onConfirm,
}: ReplaceExerciseCatalogPageProps) {
  const allItems = useMemo(
    () => getAllReplaceExercises(exerciseId),
    [exerciseId],
  );

  const muscleCategories = useMemo(
    () => getReplaceMuscleCategories(allItems),
    [allItems],
  );

  const [search, setSearch] = useState("");
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState("");

  const searchFiltered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return allItems;
    return allItems.filter((item) =>
      item.title.toLowerCase().includes(query),
    );
  }, [allItems, search]);

  const muscleFiltered = useMemo(() => {
    if (selectedMuscles.length === 0) return searchFiltered;
    return searchFiltered.filter((item) =>
      selectedMuscles.includes(item.muscleGroup ?? "Другое"),
    );
  }, [searchFiltered, selectedMuscles]);

  const groups = useMemo(
    () => groupReplaceExercisesByMuscle(muscleFiltered),
    [muscleFiltered],
  );

  const flatVisible = useMemo(
    () => groups.flatMap((group) => group.items),
    [groups],
  );

  useEffect(() => {
    if (flatVisible.length === 0) {
      setSelectedId("");
      return;
    }
    if (!flatVisible.some((item) => item.id === selectedId)) {
      setSelectedId(flatVisible[0].id);
    }
  }, [flatVisible, selectedId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);

  const selectedExercise =
    flatVisible.find((item) => item.id === selectedId) ?? flatVisible[0];

  const handleConfirm = () => {
    if (!selectedExercise) return;
    onConfirm(selectedExercise.id);
  };

  const handleTagToggle = (muscle: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((item) => item !== muscle)
        : [...prev, muscle],
    );
  };

  return (
    <div className={styles.page} role="dialog" aria-modal="true" aria-label="Все упражнения">
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <PageBackButton onClick={onBack} />
          <PageTitle className={styles.title}>Все упражнения</PageTitle>
        </div>
      </header>

      <div className={styles.scroll}>
        <div className={styles.content}>
          <div className={styles.filters}>
            <SearchField
              value={search}
              onValueChange={setSearch}
              placeholder="Поиск по названию"
              aria-label="Поиск по названию"
            />

            {muscleCategories.length > 0 ? (
              <FilterTagRow ariaLabel="Категории мышц">
                {muscleCategories.map((muscle) => (
                  <FilterTag
                    key={muscle}
                    active={selectedMuscles.includes(muscle)}
                    onClick={() => handleTagToggle(muscle)}
                  >
                    {muscle}
                  </FilterTag>
                ))}
              </FilterTagRow>
            ) : null}
          </div>

          {groups.length > 0 ? (
            <div className={styles.groups}>
              {groups.map((group) => (
                <section key={group.muscleGroup} className={styles.group}>
                  <h2 className={styles.sectionTitle}>{group.muscleGroup}</h2>
                  <ul
                    className={styles.list}
                    role="radiogroup"
                    aria-label={group.muscleGroup}
                  >
                    {group.items.map((item) => (
                      <li key={item.id}>
                        <ReplaceExerciseOptionCard
                          item={item}
                          checked={selectedId === item.id}
                          name="replace-catalog"
                          onChange={() => setSelectedId(item.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Упражнения не найдены</p>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={sharedStyles.confirmBtn}
          disabled={!selectedExercise}
          onClick={handleConfirm}
        >
          <span className={sharedStyles.confirmHint}>Заменить на</span>
          <span className={sharedStyles.confirmTitle}>
            {selectedExercise?.title ?? ""}
          </span>
        </button>
      </div>
    </div>
  );
}
