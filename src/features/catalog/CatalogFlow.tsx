import { PlaceholderTabFlow } from "@/shell/PlaceholderTabFlow";

type CatalogFlowProps = {
  popSignal?: number;
};

export function CatalogFlow({ popSignal = 0 }: CatalogFlowProps = {}) {
  return <PlaceholderTabFlow title="Справочник" popSignal={popSignal} />;
}
