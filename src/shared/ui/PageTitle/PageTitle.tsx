import type { ReactNode } from "react";
import styles from "./PageTitle.module.css";

type PageTitleProps = {
  children: ReactNode;
  className?: string;
};

export function PageTitle({ children, className = "" }: PageTitleProps) {
  return (
    <h1 className={[styles.title, className].filter(Boolean).join(" ")}>
      {children}
    </h1>
  );
}
