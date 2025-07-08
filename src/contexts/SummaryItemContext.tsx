import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import { useLoadingContext } from "./LoadingContext";

const apiUrl = import.meta.env.VITE_API_URL;

interface SummaryItemContextType {
  summaryItem: SummaryItem | null;
  setSummaryItem: (item: SummaryItem | null) => void;
  fetchSummaryItem: () => Promise<void>;
}

const SummaryItemContext = createContext<SummaryItemContextType | undefined>(
  undefined
);

export const SummaryItemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setLoading } = useLoadingContext();
  const [summaryItem, setSummaryItem] = useState<SummaryItem | null>(null);

  const fetchSummaryItem = async () => {
    setLoading(true)
    axios
      .get(`${apiUrl}/summary`, { withCredentials: true })
      .then((res) => {
        setSummaryItem(res.data);
      })
      .catch()
      .finally(() => {
        setLoading(false)
      });
  };

  return (
    <SummaryItemContext.Provider
      value={{ summaryItem, setSummaryItem, fetchSummaryItem }}
    >
      {children}
    </SummaryItemContext.Provider>
  );
};

export const useSummaryItemContext = () => {
  const context = useContext(SummaryItemContext);
  if (!context) throw new Error('useSummaryItemContext must be used within a UserProvider');
  return context;
};