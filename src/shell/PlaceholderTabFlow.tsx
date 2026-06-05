import { useState } from "react";
import { TabPlaceholder } from "@/shell/TabPlaceholder/TabPlaceholder";
import { useTabPopSignal } from "@/shared/lib/tabStackNavigation";

type PlaceholderTabFlowProps = {
  title: string;
  popSignal?: number;
};

function noopPopScreen<T extends string>(screen: T): T {
  return screen;
}

/** Заглушка таба с одним экраном (справочник, профиль и т.п.) */
export function PlaceholderTabFlow({
  title,
  popSignal = 0,
}: PlaceholderTabFlowProps) {
  const [, setScreen] = useState("root");

  useTabPopSignal(popSignal, noopPopScreen, setScreen);

  return <TabPlaceholder title={title} />;
}
