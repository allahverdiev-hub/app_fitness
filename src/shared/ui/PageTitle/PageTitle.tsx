import type { ReactNode } from "react";
import styles from "./PageTitle.module.css";

export type PageTitleVariant = "default" | "hero";

type PageTitleProps = {
  children: ReactNode;
  className?: string;
  variant?: PageTitleVariant;
};

export function PageTitle({
  children,
  className = "",
  variant = "default",
}: PageTitleProps) {
  const variantClass = variant === "hero" ? styles.hero : "";

  return (
    <h1
      className={[styles.title, variantClass, className].filter(Boolean).join(" ")}
    >
      {children}
    </h1>
  );
}
