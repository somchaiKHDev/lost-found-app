import { createContext } from "react";

interface SummaryItemContextType {
  summaryItem?: SummaryItemInfo;
  setSummaryItem: (item?: SummaryItemInfo) => void;
  fetchSummaryItem: () => Promise<void>;
}

export const SummaryItemContext = createContext<
  SummaryItemContextType | undefined
>(undefined);
