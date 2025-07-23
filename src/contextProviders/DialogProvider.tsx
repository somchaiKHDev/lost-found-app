import React, { useContext, useState, type JSX } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { DialogContext, type ConfigDialogType } from "../contexts/DialogContext";

export const DialogProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [componentRender, setComponentRender] = useState<JSX.Element>();
  const [configDialog, setConfigDialog] = useState<ConfigDialogType>();

  const handleClose = () => {
    setConfigDialog(undefined);
  };

  return (
    <DialogContext.Provider
      value={{
        openDialog: configDialog?.visible || false,
        setConfigDialog,
        setComponentRender,
      }}
    >
      <Dialog
        fullWidth={configDialog?.fullWidth || false}
        maxWidth={configDialog?.maxWidth || "sm"}
        open={configDialog?.visible || false}
        onClose={handleClose}
        scroll={configDialog?.scroll}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
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