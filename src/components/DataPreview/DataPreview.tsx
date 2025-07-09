import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { useFullScreenDialogContext } from "../../contexts/FullScreenDialogContext";
import { ItemStatusLabels } from "../../enums/itemStatusEnum";
import { ItemTypeLabels } from "../../enums/itemTypeEnum";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export const DataPreview = () => {
  const { dataRow, setOpen } = useFullScreenDialogContext();
  const dataItem = dataRow as DataItemInfo

  const handleClose = () => {
    document.activeElement instanceof HTMLElement && document.activeElement.blur();
    setOpen(false);
  };

  return (
    <>
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
        <Box py={2}>
          <Divider textAlign="center">ข้อมูลประกาศ</Divider>
          <Item>
            <Typography>{dataItem?.note || "-"}</Typography>
          </Item>
        </Box>
      </Box>{" "}
    </>
  );
};

export const rederDataPreview = () => {
    return <DataPreview />
}