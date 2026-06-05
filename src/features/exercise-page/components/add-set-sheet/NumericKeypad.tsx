import styles from "./NumericKeypad.module.css";

type NumericKeypadProps = {
  onKey: (key: string) => void;
};

const ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "⌫"],
] as const;

export function NumericKeypad({ onKey }: NumericKeypadProps) {
  return (
    <div className={styles.keypad} role="group" aria-label="Цифровая клавиатура">
      {ROWS.flat().map((key, index) =>
        key === "" ? (
          <span key={`empty-${index}`} className={styles.keyEmpty} aria-hidden />
        ) : (
          <button
            key={key}
            type="button"
            className={styles.key}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => onKey(key)}
          >
            {key}
          </button>
        ),
      )}
    </div>
  );
}
