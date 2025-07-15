import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import CardMedia from "@mui/material/CardMedia";
import { useFullScreenDialogContext } from "../../contexts/FullScreenDialogContext";
import { ItemStatusLabels } from "../../enums/itemStatusEnum";
import { ItemTypeLabels } from "../../enums/itemTypeEnum";
import { Item } from "../shared/PaperItem";
import { useDialogContext } from "../../contexts/DialogContext";
import { rederCampain } from "../Campain/Campain";
import { rederCampainPreview } from "../CampainPreview/CampainPreview";
import { ItemStatusLookups } from "../../hooks/lookup";
import Stack from "@mui/material/Stack";
import { rederFormConfirm } from "../FormConfirm/FormConfirm";
import { rederConfirmAction } from "../ConfirmAction/ConfirmAction";
import axios from "axios";
import { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export const DataPreview = () => {
  const { dataRow, setDataRow, setOpenDialogFullScreen } =
    useFullScreenDialogContext();
  const { setConfigDialog, setComponentRender } = useDialogContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [isChangeStatus, setIsChangeStatus] = useState(false);

  const dataItem = dataRow as DataItemInfo;
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (isChangeStatus) {
        navigate(0);
      }
    };
  }, [isChangeStatus]);

  const handleCloseDialogFullScreen = () => {
    document.activeElement instanceof HTMLElement &&
      document.activeElement.blur();
    setOpenDialogFullScreen(false);
  };

  const handleOpenDialog = () => {
    document.activeElement instanceof HTMLElement &&
      document.activeElement.blur();
    setConfigDialog({
      visible: true,
      maxWidth: "md",
      fullWidth: true,
    });
    setComponentRender?.(rederCampain({ dataItem, bindDataCampain }));
  };

  const bindDataCampain = (dataCampain: CampainInfo) => {
    if (dataCampain) {
      setDataRow({ ...dataItem, hasCampain: true });
    }
  };

  const handlePreviewCampain = () => {
    document.activeElement instanceof HTMLElement &&
      document.activeElement.blur();
    setConfigDialog({
      visible: true,
      maxWidth: "md",
      scroll: "body",
    });
    setComponentRender?.(rederCampainPreview({ id: dataItem.id }));
  };

  const getColorButton = (key: string) => {
    switch (key) {
      case "returned":
        return "success";
      case "cancelled":
        return "error";
      case "reviewing":
        return "inherit";
      default:
        return;
    }
  };

  const listButtonGroup = () => {
    let list: string[] = [];
    switch (dataItem.status) {
      case "pending":
        list = ["pending", "matched"];
        break;

      case "reviewing":
        list = ["pending", "matched", "reviewing"];
        break;

      default:
        list = ["pending", "matched", "returned", "cancelled", "reviewing"];
        break;
    }
    return [...ItemStatusLookups(list)];
  };

  const actionConfirm = (key: string) => () => {
    let title = "";
    document.activeElement instanceof HTMLElement &&
      document.activeElement.blur();
    setConfigDialog({
      visible: true,
      maxWidth: "sm",
      fullWidth: true,
    });

    switch (key) {
      case "returned":
        title = "ยืนยันสถานะคืนเเล้ว";
        setComponentRender?.(
          rederFormConfirm({ title, submitFormData: submitReturnedFormData })
        );
        break;
      case "cancelled":
        title = "ยืนยันสถานะยกเลิก";
        setComponentRender?.(
          rederFormConfirm({ title, submitFormData: submitCancelledFormData })
        );
        break;
      case "reviewing":
        title = "ยืนยันสถานะกำลังตรวจสอบ";
        setComponentRender?.(
          rederConfirmAction({ title, submit: submitConfirm })
        );
        break;
      default:
        break;
    }
  };

  const submitReturnedFormData = (data: any) => {
    const params = {
      id: dataItem.id,
      type: dataItem.type,
      remark: data.remark,
    };
    setLoading(true);
    setConfigDialog({
      visible: false,
    });
    axios
      .post(`${apiUrl}/change-returned-status`, params, {
        withCredentials: true,
      })
      .then((res) => {
        setDataRow(res.data);
        setIsChangeStatus(true);
      })
      .catch((error) => {
        console.error("Change status failed:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submitCancelledFormData = (data: any) => {
    const params = {
      id: dataItem.id,
      type: dataItem.type,
      remark: data.remark,
    };
    setLoading(true);
    setConfigDialog({
      visible: false,
    });
    axios
      .post(`${apiUrl}/change-cancelled-status`, params, {
        withCredentials: true,
      })
      .then((res) => {
        setDataRow(res.data);
        setIsChangeStatus(true);
      })
      .catch((error) => {
        console.error("Change status failed:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submitConfirm = () => {
    const params = {
      id: dataItem.id,
      type: dataItem.type,
    };
    setLoading(true);
    setConfigDialog({
      visible: false,
    });
    axios
      .post(`${apiUrl}/change-reviewing-status`, params, {
        withCredentials: true,
      })
      .then((res) => {
        setDataRow(res.data);
        setIsChangeStatus(true);
      })
      .catch((error) => {
        console.error("Change status failed:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
        onClick={() => {
          setLoading(false);
        }}
      >
        <CircularProgress color="warning" />
      </Backdrop>

      <AppBar sx={{ position: "relative", bgcolor: "#1e2939" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCloseDialogFullScreen}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            ข้อมูล
          </Typography>
          {dataItem?.hasCampain ? (
            <Button autoFocus color="inherit" onClick={handlePreviewCampain}>
              ดูประกาศ
            </Button>
          ) : (
            <Button autoFocus color="inherit" onClick={handleOpenDialog}>
              สร้างประกาศ
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box component={Typography} variant="h6" p={2}>
        <Grid
          container
          spacing={2}
          justifyContent={{ sm: "center", md: "flex-start" }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CardMedia
              component="img"
              height="194"
              image={dataItem?.imageUrl}
              alt="Paella dish"
              sx={{ borderRadius: "1rem" }}
            />
          </Grid>
          <Grid
            container
            direction="column"
            spacing={2}
            size={{ xs: 12, md: 8 }}
          >
            <Grid
              container
              direction={{ xs: "column", lg: "row" }}
              justifyContent="space-between"
            >
              <Grid>
                <Typography variant="h5">
                  สถานะ :{" "}
                  {ItemStatusLabels[
                    dataItem?.status as keyof typeof ItemStatusLabels
                  ] ?? "-"}
                </Typography>
              </Grid>
            </Grid>
            <Grid>
              <Typography variant="body2">ประเภทสิ่งของ</Typography>
              <Item>
                <Typography>
                  {ItemTypeLabels[
                    dataItem?.type as keyof typeof ItemTypeLabels
                  ] ?? "-"}
                </Typography>
              </Item>
            </Grid>
            <Grid>
              <Typography variant="body2">รายละเอียด</Typography>
              <Item>
                <Typography>{dataItem?.description || "-"}</Typography>
              </Item>
            </Grid>
            <Grid>
              <Typography variant="body2">สถานที่พบเจอ</Typography>
              <Item>
                <Typography>{dataItem?.location || "-"}</Typography>
              </Item>
            </Grid>
            <Grid>
              <Typography variant="body2">วัน/เวลาที่พบ</Typography>
              <Item>
                <Typography>
                  {dataItem?.datetime
                    ? new Date(dataItem.datetime).toLocaleString("th-TH", {
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
            <Grid>
              <Typography variant="body2">ผู้พบ (ถ้ามี)</Typography>
              <Item>
                <Typography>{dataItem?.found_by || "-"}</Typography>
              </Item>
            </Grid>
            <Grid>
              <Typography variant="body2">หมายเหตุเพิ่มเติม</Typography>
              <Item>
                <Typography>{dataItem?.note || "-"}</Typography>
              </Item>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Stack direction={{ xs: "column", sm: "row" }} gap={1} p={2} pt={0}>
        {listButtonGroup().map((item) => (
          <Button
            variant="contained"
            color={getColorButton(item.value)}
            key={item.value}
            sx={{ width: { xs: "100%", sm: "150px" } }}
            onClick={actionConfirm(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </>
  );
};

export const rederDataPreview = () => {
  return <DataPreview />;
};
