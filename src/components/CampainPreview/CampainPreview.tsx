import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Item } from "../shared/PaperItem";
import Typography from "@mui/material/Typography";
import { useFullScreenDialogContext } from "../../contexts/FullScreenDialogContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLoadingContext } from "../../contexts/LoadingContext";
import Grid from "@mui/material/Grid";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const apiUrl = import.meta.env.VITE_API_URL;

export const CampainPreview = () => {
  const { dataRow, setDataRow } = useFullScreenDialogContext();
  const dataCampain = dataRow?.dataCampain as CampainInfo | undefined;

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!dataCampain && dataRow?.id) {
      fetchData(dataRow?.id);
    }
  }, []);

  const fetchData = (id: string) => {
    setLoading(true);
    axios
      .get<CampainInfo>(`${apiUrl}/campains/${id}`, { withCredentials: true })
      .then((res) => {
        setDataRow({ ...dataRow, dataCampain: res.data });
      })
      .catch((error) => {
        console.error("Add Campains failed:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!dataCampain) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
        onClick={() => {
          setLoading(false);
        }}
      >
        <CircularProgress color="warning" />
      </Backdrop>
    );
  }

  return (
    <Box py={2}>
      <Divider textAlign="left" sx={{ pb: 2 }}>
        ข้อมูลประกาศ
      </Divider>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body2">ประกาศเรื่อง</Typography>
          <Item>
            <Typography>{dataCampain?.subject}</Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">รายละเอียด</Typography>
          <Item>
            <Typography>{dataCampain?.description}</Typography>
          </Item>
        </Grid>
        <Grid item xs>
          <Typography variant="body2">ประกาศเมื่อ</Typography>
          <Item>
            <Typography>
              {dataCampain?.datetime
                ? new Date(dataCampain.datetime).toLocaleString("th-TH", {
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
        <Grid item xs>
          <Typography variant="body2">สร้างประกาศโดย</Typography>
          <Item>
            <Typography>{dataCampain?.create_by}</Typography>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};
