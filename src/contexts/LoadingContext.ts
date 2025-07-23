import { createContext } from "react";

interface LoadingContextType {
  loading: boolean;
  setLoading: (isLoad: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);
