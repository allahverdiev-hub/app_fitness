import {
  IconTabCatalog,
  IconTabProfile,
  IconTabWorkouts,
} from "@/shared/icons/tabNavIcons";
import {
  BottomTabNav as BottomTabNavBase,
  type BottomTabNavItem,
} from "@/shared/ui/BottomTabNav";

export type AppTabId = "workouts" | "catalog" | "profile";

const APP_TABS: readonly BottomTabNavItem<AppTabId>[] = [
  { id: "workouts", label: "Тренировки", Icon: IconTabWorkouts },
  { id: "catalog", label: "Справочник", Icon: IconTabCatalog },
  { id: "profile", label: "Профиль", Icon: IconTabProfile },
];

type AppBottomTabNavProps = {
  active: AppTabId;
  onChange: (tab: AppTabId) => void;
};

export function BottomTabNav({ active, onChange }: AppBottomTabNavProps) {
  return (
    <BottomTabNavBase items={APP_TABS} active={active} onChange={onChange} />
  );
}
