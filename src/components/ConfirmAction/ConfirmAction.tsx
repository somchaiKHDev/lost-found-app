import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

type ConfirmActionProps = {
  title: string;
  submit: () => void;
};
export const ConfirmAction: React.FC<ConfirmActionProps> = ({
  title,
  submit,
}) => {
  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          color="success"
          onClick={() => submit()}
        >
          ยืนยัน
        </Button>
      </DialogActions>
    </>
  );
};

type RederFormConfirmProps = ConfirmActionProps;
export const rederConfirmAction = (props: RederFormConfirmProps) => {
  return <ConfirmAction {...props} />;
};
