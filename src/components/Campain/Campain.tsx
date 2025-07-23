import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "../forms/TextField";
import { TextFieldArea } from "../forms/TextFieldArea";
import axios from "axios";
import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useDialogContext } from "../../contextProviders/DialogProvider";

const apiUrl = import.meta.env.VITE_API_URL;

const FormSchema = z.object({
  subject: z.string().min(1, {
    message: "จำเป็นต้องกรอกข้อมูล",
  }),
  description: z.string().min(1, {
    message: "จำเป็นต้องกรอกข้อมูล",
  }),
});

type CampainProps = {
  dataItem: DataItemInfo;
  bindDataCampain?: (dataCampain: CampainInfo) => void;
};
export const Campain: React.FC<CampainProps> = ({
  dataItem,
  bindDataCampain,
}) => {
  const { setConfigDialog } = useDialogContext();
  const [loading, setLoading] = useState<boolean>(false);

  const handleCloseDialog = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setConfigDialog({
      visible: false,
    });
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subject: "",
      description: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const localStorage = window.localStorage.getItem("isLogined");
    const jsonData = localStorage ? JSON.parse(localStorage) : {};

    const params: AddCampainsParam = {
      caseId: dataItem.id,
      subject: data.subject,
      description: data.description,
      datetime: new Date().toISOString(),
      create_by: jsonData.uid || "",
      imageUrl: dataItem.imageUrl,
      type: dataItem.type,
    };

    setLoading(true);
    axios
      .post<CampainInfo>(`${apiUrl}/campains/create`, params, {
        withCredentials: true,
      })
      .then((res) => {
        bindDataCampain?.(res.data);
        handleCloseDialog();
      })
      .catch((error) => {
        console.error("Add Campains failed:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogTitle>แบบฟอร์มประกาศ</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <TextField label="เรื่องประกาศ" {...field} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={form.control}
                name="description"
                render={({ field }) => (
                  <TextFieldArea label="รายละเอียด" rows={8} {...field} />
                )}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleCloseDialog}
            >
              ยกเลิก
            </Button>
            <Button type="submit" variant="contained" color="warning">
              สร้าง
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
        onClick={() => {
          setLoading(false);
        }}
      >
        <CircularProgress color="warning" />
      </Backdrop>
    </FormProvider>
  );
};

type RederCampainProps = CampainProps;
export const rederCampain = (props: RederCampainProps) => {
  return <Campain {...props} />;
};
