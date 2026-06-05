import { useCallback, useEffect, useRef, useState } from "react";
import {
  BOTTOM_SHEET_DURATION_MS,
  useBottomSheetMotion,
} from "@/shared/ui/bottom-sheet";
import { SheetPopupHeader } from "@/shared/ui/SheetPopupHeader";
import type { AddSetFormValues } from "@/features/exercise-page/types/set";
import {
  REPS_OPTIONS,
  WEIGHT_GRAM_OPTIONS,
  WEIGHT_KG_OPTIONS,
} from "./pickerData";
import { WheelPicker } from "./WheelPicker";
import type { AddSetSheetDefaults } from "@/features/exercise-page/types/set";
import { PrimaryActionButton } from "@/shared/ui/ActionButton";
import styles from "./AddSetSheet.module.css";

export type { AddSetSheetDefaults };

type AddSetSheetProps = {
  open: boolean;
  defaults: AddSetSheetDefaults;
  onClose: () => void;
  onConfirm: (values: AddSetFormValues) => void;
};

export function AddSetSheet({
  open,
  defaults,
  onClose,
  onConfirm,
}: AddSetSheetProps) {
  const [reps, setReps] = useState(defaults.reps);
  const [weightKg, setWeightKg] = useState(defaults.weightKg);
  const [weightGrams, setWeightGrams] = useState(defaults.weightGrams);
  const [note, setNote] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);
  const { shouldRender, shown, unmount } = useBottomSheetMotion(
    open,
    BOTTOM_SHEET_DURATION_MS,
  );
  const [wheelsReady, setWheelsReady] = useState(false);
  const wheelsFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetForm = useCallback(() => {
    setReps(defaults.reps);
    setWeightKg(defaults.weightKg);
    setWeightGrams(defaults.weightGrams);
    setNote("");
  }, [defaults.reps, defaults.weightKg, defaults.weightGrams]);

  useEffect(() => {
    if (!open) return;
    resetForm();
  }, [open, resetForm]);

  const enableWheels = useCallback(() => {
    if (wheelsFallbackRef.current) {
      window.clearTimeout(wheelsFallbackRef.current);
      wheelsFallbackRef.current = null;
    }
    setWheelsReady(true);
  }, []);

  useEffect(() => {
    if (!shown) {
      if (wheelsFallbackRef.current) {
        window.clearTimeout(wheelsFallbackRef.current);
        wheelsFallbackRef.current = null;
      }
      setWheelsReady(false);
      return undefined;
    }

    wheelsFallbackRef.current = window.setTimeout(
      enableWheels,
      BOTTOM_SHEET_DURATION_MS + 32,
    );
    return () => {
      if (wheelsFallbackRef.current) {
        window.clearTimeout(wheelsFallbackRef.current);
        wheelsFallbackRef.current = null;
      }
    };
  }, [shown, enableWheels]);

  useEffect(() => {
    if (!shouldRender) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shouldRender, open, onClose]);

  const handleSheetTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== sheetRef.current || e.propertyName !== "transform") return;
    if (open && shown) enableWheels();
    if (!open && !shown) unmount();
  };

  if (!shouldRender) return null;

  const handleSubmit = () => {
    onConfirm({ reps, weightKg, weightGrams, note: note.trim() });
  };

  return (
    <div
      className={`${styles.root} ${shown ? styles.rootShown : ""}`}
      role="presentation"
      aria-hidden={!open}
    >
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Закрыть"
        onClick={onClose}
        tabIndex={shown ? 0 : -1}
      />
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-set-title"
        onTransitionEnd={handleSheetTransitionEnd}
      >
        <div className={styles.sheetBody}>
        <SheetPopupHeader
          title="Добавить подход"
          titleId="add-set-title"
          onClose={onClose}
        />

        <div className={styles.pickers}>
          <div className={`${styles.pickerCard} ${styles.pickerCardReps}`}>
            <p className={`${styles.pickerCardTitle} ${styles.pickerCardTitleStatic}`}>
              Повторения
            </p>
            <div className={styles.pickerCardDivider} aria-hidden />
            <div className={styles.pickerCardBody}>
              <WheelPicker
                aria-label="Повторения"
                options={REPS_OPTIONS}
                value={reps}
                onChange={setReps}
                scrollReady={wheelsReady}
              />
            </div>
          </div>

          <div className={`${styles.pickerCard} ${styles.pickerCardWeight}`}>
            <p className={`${styles.pickerCardTitle} ${styles.pickerCardTitleStatic}`}>Кг</p>
            <div className={styles.pickerCardDivider} aria-hidden />
            <div className={styles.pickerCardBody}>
              <div className={styles.weightDrums}>
                <span className={styles.weightDot} aria-hidden>
                  ·
                </span>
                <div className={styles.weightCol}>
                  <WheelPicker
                    aria-label="Килограммы"
                    options={WEIGHT_KG_OPTIONS}
                    value={weightKg}
                    onChange={setWeightKg}
                    scrollReady={wheelsReady}
                  />
                </div>
                <div className={styles.weightCol}>
                  <WheelPicker
                    aria-label="Граммы"
                    options={WEIGHT_GRAM_OPTIONS}
                    value={weightGrams}
                    onChange={setWeightGrams}
                    scrollReady={wheelsReady}
                    format={(v) => String(v)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <label className={styles.noteWrap}>
          <span className={styles.srOnly}>Примечание</span>
          <input
            type="text"
            inputMode="text"
            enterKeyHint="done"
            autoComplete="off"
            autoCorrect="on"
            spellCheck
            maxLength={280}
            className={styles.noteInput}
            placeholder="Добавить примечание (по желанию)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        <div className={styles.footer}>
          <PrimaryActionButton className={styles.submitBtn} onClick={handleSubmit}>
            Добавить
          </PrimaryActionButton>
        </div>
        </div>
      </div>
    </div>
  );
}
