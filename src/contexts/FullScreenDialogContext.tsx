import React, { createContext, useContext, useState, type JSX } from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { type TransitionProps } from "@mui/material/transitions";
import { DataPreview } from "../components/DataPreview";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface FullScreenDialogContextType {
  open: boolean;
  setOpen: (visible: boolean) => void;
  setComponentRender?: (component: JSX.Element) => void;
  dataRow?: DataItemType;
  setDataRow: (dt: DataItemType) => void;
}

interface DataItemType {
  [key: string]: string;
}

const FullScreenDialogContext = createContext<
  FullScreenDialogContextType | undefined
>(undefined);

export const FullScreenDialogProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [dataRow, setDataRow] = useState<DataItemType>();
  const [componentRender, setComponentRender] = useState<JSX.Element>();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <FullScreenDialogContext.Provider
      value={{ open, setOpen, dataRow, setDataRow, setComponentRender }}
    >
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        slots={{
          transition: Transition,
        }}
      >
        {componentRender ?? null}
      </Dialog>
      {children}
    </FullScreenDialogContext.Provider>
  );
};

export const useFullScreenDialogContext = () => {
  const context = useContext(FullScreenDialogContext);
  if (!context)
    throw new Error(
      "useFullScreenDialogContext must be used within a UserProvider"
    );
  return context;
};
