import { createContext, type JSX } from "react";

interface FullScreenDialogContextType {
  openDialogFullScreen: boolean;
  setOpenDialogFullScreen: (visible: boolean) => void;
  setComponentRender?: (component: JSX.Element) => void;
  dataRow?: DataItemType;
  setDataRow: (dt?: DataItemType) => void;
}

export const FullScreenDialogContext = createContext<
  FullScreenDialogContextType | undefined
>(undefined);
