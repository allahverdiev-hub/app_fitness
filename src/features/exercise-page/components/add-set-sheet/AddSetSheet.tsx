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
import { NumericKeypad } from "./NumericKeypad";
import { clampReps } from "@/features/exercise-page/utils/weightUnits";
import type { AddSetSheetDefaults } from "@/features/exercise-page/types/set";
import { PrimaryActionButton } from "@/shared/ui/ActionButton";
import styles from "./AddSetSheet.module.css";

export type { AddSetSheetDefaults };

type KeypadField = "reps" | "weightKg" | "weightGrams" | "note";

type AddSetSheetProps = {
  open: boolean;
  defaults: AddSetSheetDefaults;
  onClose: () => void;
  onConfirm: (values: AddSetFormValues) => void;
};

function clampGrams(value: number) {
  const stepped = Math.min(900, Math.max(0, Math.round(value / 100) * 100));
  return WEIGHT_GRAM_OPTIONS.includes(stepped)
    ? stepped
    : WEIGHT_GRAM_OPTIONS[0];
}

function clampKg(value: number) {
  const v = Math.min(200, Math.max(0, value));
  return WEIGHT_KG_OPTIONS.includes(v) ? v : WEIGHT_KG_OPTIONS[0];
}

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
  const [activeField, setActiveField] = useState<KeypadField | null>(null);
  const [entryBuffer, setEntryBuffer] = useState("");
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
    setActiveField(null);
    setEntryBuffer("");
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

  const commitBuffer = useCallback(
    (field: KeypadField, buffer: string) => {
      if (field === "note") return;
      const digits = buffer.replace(/\D/g, "");
      if (!digits) return;
      const n = Number.parseInt(digits, 10);
      if (Number.isNaN(n)) return;
      if (field === "reps") setReps(clampReps(n));
      if (field === "weightKg") setWeightKg(clampKg(n));
      if (field === "weightGrams") setWeightGrams(clampGrams(n));
    },
    [],
  );

  const selectField = (field: KeypadField) => {
    if (activeField && activeField !== "note") {
      commitBuffer(activeField, entryBuffer);
    }
    setActiveField(field);
    if (field === "reps") setEntryBuffer(String(reps));
    else if (field === "weightKg") setEntryBuffer(String(weightKg));
    else if (field === "weightGrams") setEntryBuffer(String(weightGrams));
    else setEntryBuffer(note);
  };

  const handleWheelReps = (value: number) => {
    setReps(value);
    if (activeField === "reps") setEntryBuffer(String(value));
  };

  const handleWheelKg = (value: number) => {
    setWeightKg(value);
    if (activeField === "weightKg") setEntryBuffer(String(value));
  };

  const handleWheelGrams = (value: number) => {
    setWeightGrams(value);
    if (activeField === "weightGrams") setEntryBuffer(String(value));
  };

  const handleKeypad = (key: string) => {
    if (
      !activeField ||
      activeField === "note"
    ) {
      return;
    }

    const next =
      key === "⌫" ? entryBuffer.slice(0, -1) : `${entryBuffer}${key}`.replace(/^0+(\d)/, "$1");
    setEntryBuffer(next);
    commitBuffer(activeField, next);
  };

  if (!shouldRender) return null;

  const numericKeypadVisible =
    activeField === "reps" ||
    activeField === "weightKg" ||
    activeField === "weightGrams";

  const handleSubmit = () => {
    if (activeField && activeField !== "note") {
      commitBuffer(activeField, entryBuffer);
    }
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
        className={`${styles.sheet} ${numericKeypadVisible ? styles.sheetKeyboard : ""}`}
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
          <div
            className={`${styles.pickerCard} ${styles.pickerCardReps} ${activeField === "reps" ? styles.pickerCardActive : ""}`}
          >
            <button
              type="button"
              className={styles.pickerCardTitle}
              onClick={() => selectField("reps")}
            >
              Повторения
            </button>
            <div className={styles.pickerCardDivider} aria-hidden />
            <div className={styles.pickerCardBody}>
              <WheelPicker
                aria-label="Повторения"
                options={REPS_OPTIONS}
                value={reps}
                onChange={handleWheelReps}
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
                <div
                  className={`${styles.weightCol} ${activeField === "weightKg" ? styles.weightColActive : ""}`}
                  onClick={() => selectField("weightKg")}
                >
                  <WheelPicker
                    aria-label="Килограммы"
                    options={WEIGHT_KG_OPTIONS}
                    value={weightKg}
                    onChange={handleWheelKg}
                    scrollReady={wheelsReady}
                  />
                </div>
                <div
                  className={`${styles.weightCol} ${activeField === "weightGrams" ? styles.weightColActive : ""}`}
                  onClick={() => selectField("weightGrams")}
                >
                  <WheelPicker
                    aria-label="Граммы"
                    options={WEIGHT_GRAM_OPTIONS}
                    value={weightGrams}
                    onChange={handleWheelGrams}
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
            onFocus={() => selectField("note")}
            onBlur={() => {
              if (activeField === "note") setActiveField(null);
            }}
          />
        </label>

        <div className={styles.footer}>
          <PrimaryActionButton className={styles.submitBtn} onClick={handleSubmit}>
            Добавить
          </PrimaryActionButton>
        </div>
        </div>

        {numericKeypadVisible && <NumericKeypad onKey={handleKeypad} />}
      </div>
    </div>
  );
}
