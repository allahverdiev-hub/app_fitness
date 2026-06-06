import {
  useLayoutEffect,
  useRef,
  useEffect,
  type CSSProperties,
  type ReactNode,
} from "react";
import { DELETE_COLLAPSE_MS } from "@/shared/ui/ThanosDissolve/deleteAnimationTiming";
import styles from "@/shared/styles/deleteListItemCollapse.module.css";

type DeleteAnimatedListItemProps = {
  itemKey: string;
  isCollapsing: boolean;
  className: string;
  style?: CSSProperties;
  mergeRef?: (node: HTMLLIElement | null) => void;
  onCollapseComplete: () => void;
  children: ReactNode;
};

export function DeleteAnimatedListItem({
  itemKey,
  isCollapsing,
  className,
  style,
  mergeRef,
  onCollapseComplete,
  children,
}: DeleteAnimatedListItemProps) {
  const itemRef = useRef<HTMLLIElement>(null);
  const onCollapseCompleteRef = useRef(onCollapseComplete);
  const collapseDoneRef = useRef(false);

  useEffect(() => {
    onCollapseCompleteRef.current = onCollapseComplete;
  }, [onCollapseComplete]);

  const setItemRef = (node: HTMLLIElement | null) => {
    itemRef.current = node;
    mergeRef?.(node);
  };

  useLayoutEffect(() => {
    const el = itemRef.current;
    if (!el) return undefined;

    if (!isCollapsing) {
      collapseDoneRef.current = false;
      el.classList.remove(styles.listItemCollapsed);
      el.style.removeProperty("--collapse-from-height");
      el.style.removeProperty("--collapse-from-margin");
      el.style.removeProperty("--collapse-duration");
      return undefined;
    }

    if (collapseDoneRef.current) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      collapseDoneRef.current = true;
      onCollapseCompleteRef.current();
      return undefined;
    }

    const height = el.getBoundingClientRect().height;
    const marginBottom = Number.parseFloat(
      getComputedStyle(el).marginBottom || "0",
    );
    el.style.setProperty("--collapse-from-height", `${height}px`);
    el.style.setProperty("--collapse-from-margin", `${marginBottom}px`);
    el.classList.remove(styles.listItemCollapsed);

    let innerFrameId = 0;
    const frameId = requestAnimationFrame(() => {
      innerFrameId = requestAnimationFrame(() => {
        el.classList.add(styles.listItemCollapsed);
      });
    });

    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(innerFrameId);
    };
  }, [isCollapsing, itemKey]);

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLLIElement>) => {
    if (!isCollapsing || event.propertyName !== "height") return;
    if (collapseDoneRef.current) return;
    collapseDoneRef.current = true;
    onCollapseCompleteRef.current();
  };

  return (
    <li
      ref={setItemRef}
      className={`${className} ${isCollapsing ? styles.listItemCollapsing : ""}`}
      style={
        isCollapsing
          ? {
              ...style,
              ["--collapse-duration" as string]: `${DELETE_COLLAPSE_MS}ms`,
            }
          : style
      }
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </li>
  );
}
