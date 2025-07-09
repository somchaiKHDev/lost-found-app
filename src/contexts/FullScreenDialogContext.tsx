import React, { createContext, useContext, useState, type JSX } from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { type TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface FullScreenDialogContextType {
  openDialogFullScreen: boolean;
  setOpenDialogFullScreen: (visible: boolean) => void;
  setComponentRender?: (component: JSX.Element) => void;
  dataRow?: DataItemType;
  setDataRow: (dt?: DataItemType) => void;
}

interface DataItemType {
  [key: string]: any;
}

const FullScreenDialogContext = createContext<
  FullScreenDialogContextType | undefined
>(undefined);

export const FullScreenDialogProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [openDialogFullScreen, setOpenDialogFullScreen] = useState<boolean>(false);
  const [dataRow, setDataRow] = useState<DataItemType>();
  const [componentRender, setComponentRender] = useState<JSX.Element>();

  const handleClose = () => {
    setOpenDialogFullScreen(false);
  };

  return (
    <FullScreenDialogContext.Provider
      value={{ openDialogFullScreen, setOpenDialogFullScreen, dataRow, setDataRow, setComponentRender }}
    >
      <Dialog
        fullScreen
        open={openDialogFullScreen}
        onClose={handleClose}
        slots={{
          transition: Transition,
        }}
      >
        {componentRender ?? 'Component not found!'}
      </Dialog>
      {children}
    </FullScreenDialogContext.Provider>
  );
};

export const useFullScreenDialogContext = () => {
  const context = useContext(FullScreenDialogContext);
  if (!context)
    throw new Error(
      "useFullScreenDialogContext must be used within a FullScreenDialogProvider"
    );
  return context;
};
