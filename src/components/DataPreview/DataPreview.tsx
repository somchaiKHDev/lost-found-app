import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import { useFullScreenDialogContext } from "../../contexts/FullScreenDialogContext";
import { ItemStatusLabels } from "../../enums/itemStatusEnum";
import { ItemTypeLabels } from "../../enums/itemTypeEnum";
import { Item } from "../shared/PaperItem";
import { useDialogContext } from "../../contexts/DialogContext";
import { rederCampain } from "../Campain/Campain";
import { rederCampainPreview } from "../CampainPreview/CampainPreview";

export const DataPreview = () => {
  const { dataRow, setDataRow, setOpenDialogFullScreen } =
    useFullScreenDialogContext();
  const { setConfigDialog, setComponentRender } = useDialogContext();
  const dataItem = dataRow as DataItemInfo;

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

  return (
    <>
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
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <CardMedia
              component="img"
              height="194"
              image={dataItem?.imageUrl}
              alt="Paella dish"
              sx={{ borderRadius: "1rem" }}
            />
          </Grid>
          <Grid container spacing={2} item xs>
            <Grid item xs={12}>
              <Typography variant="h5">
                สถานะ :{" "}
                {ItemStatusLabels[
                  dataItem?.status as keyof typeof ItemStatusLabels
                ] ?? "-"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">ประเภทสิ่งของ</Typography>
              <Item>
                <Typography>
                  {ItemTypeLabels[
                    dataItem?.type as keyof typeof ItemTypeLabels
                  ] ?? "-"}
                </Typography>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">รายละเอียด</Typography>
              <Item>
                <Typography>{dataItem?.description || "-"}</Typography>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">สถานที่พบเจอ</Typography>
              <Item>
                <Typography>{dataItem?.location || "-"}</Typography>
              </Item>
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <Typography variant="body2">ผู้พบ (ถ้ามี)</Typography>
              <Item>
                <Typography>{dataItem?.found_by || "-"}</Typography>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">หมายเหตุเพิ่มเติม</Typography>
              <Item>
                <Typography>{dataItem?.note || "-"}</Typography>
              </Item>
            </Grid>
          </Grid>
        </Grid>
        {/* <CampainPreview /> */}
      </Box>
    </>
  );
};

export const rederDataPreview = () => {
  return <DataPreview />;
};
