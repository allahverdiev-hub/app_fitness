import { useEffect, type Dispatch, type SetStateAction } from "react";

/** Реакция на повторный тап по активному табу — шаг назад по стеку экранов */
export function useTabPopSignal<T extends string>(
  popSignal: number,
  popScreen: (screen: T) => T,
  setScreen: Dispatch<SetStateAction<T>>,
) {
  useEffect(() => {
    if (!popSignal) return;
    setScreen((prev) => popScreen(prev));
  }, [popSignal, popScreen, setScreen]);
}
