import React, { createContext, useContext, useState, type JSX } from "react";
import Dialog from "@mui/material/Dialog";

interface DialogContextType {
  openDialog: boolean;
  setOpenDialog: (visible: boolean) => void;
  setComponentRender?: (component: JSX.Element) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [componentRender, setComponentRender] = useState<JSX.Element>();

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <DialogContext.Provider
      value={{ openDialog, setOpenDialog, setComponentRender }}
    >
      <Dialog fullWidth maxWidth="sm" open={openDialog} onClose={handleClose}>
        {componentRender ?? "Component not found!"}
      </Dialog>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context)
    throw new Error("useDialogContext must be used within a DialogProvider");
  return context;
};
