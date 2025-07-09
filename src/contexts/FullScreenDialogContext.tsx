import React, { createContext, useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { type TransitionProps } from "@mui/material/transitions";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { ItemTypeLabels } from "../enums/itemTypeEnum";
import { ItemStatusLabels } from "../enums/itemStatusEnum";
import Divider from "@mui/material/Divider";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

interface FullScreenDialogContextType {
  open: boolean;
  setOpen: (visible: boolean) => void;
  setDataRow: (dt: DataItemInfo) => void;
}

const FullScreenDialogContext = createContext<
  FullScreenDialogContextType | undefined
>(undefined);

export const FullScreenDialogProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [dataRow, setDataRow] = useState<DataItemInfo>();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <FullScreenDialogContext.Provider value={{ open, setOpen, setDataRow }}>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        slots={{
          transition: Transition,
        }}
      >
        <AppBar sx={{ position: "relative", bgcolor: "#1e2939" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              ข้อมูล
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              สร้างประกาศ
            </Button>
          </Toolbar>
        </AppBar>
        <Box component={Typography} variant="h6" p={2}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <CardMedia
                component="img"
                height="194"
                image={dataRow?.imageUrl}
                alt="Paella dish"
                sx={{ borderRadius: "1rem" }}
              />
            </Grid>
            <Grid container spacing={2} item xs>
              <Grid item xs={12}>
                <Typography variant="h5">
                  สถานะ :{" "}
                  {ItemStatusLabels[
                    dataRow?.status as keyof typeof ItemStatusLabels
                  ] ?? "-"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">ประเภทสิ่งของ</Typography>
                <Item>
                  <Typography>
                    {ItemTypeLabels[
                      dataRow?.type as keyof typeof ItemTypeLabels
                    ] ?? "-"}
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">รายละเอียด</Typography>
                <Item>
                  <Typography>{dataRow?.description || "-"}</Typography>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">สถานที่พบเจอ</Typography>
                <Item>
                  <Typography>{dataRow?.location || "-"}</Typography>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">วัน/เวลาที่พบ</Typography>
                <Item>
                  <Typography>
                    {dataRow?.datetime
                      ? new Date(dataRow.datetime).toLocaleString("th-TH", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        }) + " น."
                      : "-"}
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">ผู้พบ (ถ้ามี)</Typography>
                <Item>
                  <Typography>{dataRow?.found_by || "-"}</Typography>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">หมายเหตุเพิ่มเติม</Typography>
                <Item>
                  <Typography>{dataRow?.note || "-"}</Typography>
                </Item>
              </Grid>
            </Grid>
          </Grid>
          <Box py={2}>
            <Divider textAlign="center">ข้อมูลประกาศ</Divider>
            <Item>
              <Typography>{dataRow?.note || "-"}</Typography>
            </Item>
          </Box>
        </Box>
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
