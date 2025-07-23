import { createContext, type JSX } from "react";
import type { Breakpoint } from "@mui/material/styles";

export interface ConfigDialogType {
  visible?: boolean;
  fullWidth?: boolean;
  maxWidth?: false | Breakpoint;
  scroll?: "body" | "paper";
}

interface DialogContextType {
  openDialog: boolean;
  setConfigDialog: (config: ConfigDialogType) => void;
  setComponentRender?: (component: JSX.Element) => void;
}

export const DialogContext = createContext<DialogContextType | undefined>(
  undefined
);
