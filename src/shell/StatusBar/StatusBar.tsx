import styles from "./StatusBar.module.css";

export function StatusBar() {
  return (
    <div className={styles.bar} aria-hidden>
      <span className={styles.time}>9:41</span>
      <div className={styles.indicators}>
        <span className={styles.signal} />
        <span className={styles.wifi} />
        <span className={styles.battery} />
      </div>
    </div>
  );
}
