import Box from "@mui/material/Box";
import { Item } from "../shared/PaperItem";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid2";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CardMedia from "@mui/material/CardMedia";
import CampaignIcon from "@mui/icons-material/Campaign";
import Stack from "@mui/material/Stack";

const apiUrl = import.meta.env.VITE_API_URL;

type CampainPreviewProps = {
  id: string;
};
export const CampainPreview: React.FC<CampainPreviewProps> = ({ id }) => {
  const [dataCampain, setDataCampain] = useState<CampainInfo>();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData(id);
  }, []);

  const fetchData = (id: string) => {
    setLoading(true);
    axios
      .get<CampainInfo>(`${apiUrl}/campains/${id}`, { withCredentials: true })
      .then((res) => {
        setDataCampain(res.data);
      })
      .catch((error) => {
        console.error("Get Campains failed:", error);
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

      {!loading ? (
        <>
          <DialogTitle>
            <Stack
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <CampaignIcon fontSize="large" />
              <Typography variant="h3">ประกาศ</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={1}>
              <Grid size={{ xs: "grow" }}>
                <CardMedia
                  component="img"
                  height="194"
                  image={dataCampain?.imageUrl}
                  alt="Paella dish"
                  sx={{ borderRadius: "1rem" }}
                />
              </Grid>
              <Grid size={{ xs: 7 }}>
                <Box sx={{ height: "100%" }}>
                  <Item sx={{ height: "inherit" }}>
                    <Typography>{dataCampain?.description}</Typography>
                  </Item>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Item>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: "grow" }}>
                      <Typography variant="body2">ประกาศเมื่อ</Typography>
                      <Typography>
                        {dataCampain?.datetime
                          ? new Date(dataCampain.datetime).toLocaleString(
                              "th-TH",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              }
                            ) + " น."
                          : "-"}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 7 }}>
                      <Typography variant="body2">ประกาศโดย</Typography>
                      <Typography>{dataCampain?.create_by}</Typography>
                    </Grid>
                  </Grid>
                </Item>
              </Grid>
            </Grid>
          </DialogContent>
        </>
      ) : null}
    </>
  );
};

type RederCampainPreviewProps = CampainPreviewProps;
export const rederCampainPreview = (props: RederCampainPreviewProps) => {
  return <CampainPreview {...props} />;
};
