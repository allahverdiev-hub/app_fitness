import { PlaceholderTabFlow } from "@/shell/PlaceholderTabFlow";

type ProfileFlowProps = {
  popSignal?: number;
};

export function ProfileFlow({ popSignal = 0 }: ProfileFlowProps = {}) {
  return <PlaceholderTabFlow title="Профиль" popSignal={popSignal} />;
}
