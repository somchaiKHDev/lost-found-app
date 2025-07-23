import React, { useState, useContext } from "react";
import { SummaryItemContext } from "../contexts/SummaryItemContext";
import axios from "axios";
import { useLoadingContext } from "./LoadingProvider";

const apiUrl = import.meta.env.VITE_API_URL;

export const SummaryItemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setLoading } = useLoadingContext();
  const [summaryItem, setSummaryItem] = useState<SummaryItemInfo>();

  const fetchSummaryItem = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<SummaryItemInfo>(`${apiUrl}/summary`, {
        withCredentials: true,
      });
      setSummaryItem(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setSummaryItem]);

  return (
    <SummaryItemContext.Provider
      value={{ summaryItem, setSummaryItem, fetchSummaryItem }}
    >
      {children}
    </SummaryItemContext.Provider>
  );
};

// custom hook
export const useSummaryItemContext = () => {
  const context = useContext(SummaryItemContext);
  if (!context)
    throw new Error(
      "useSummaryItemContext must be used within a SummaryItemProvider"
    );
  return context;
};
