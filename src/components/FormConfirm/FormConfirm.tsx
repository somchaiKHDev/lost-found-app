import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextFieldArea } from "../forms/TextFieldArea";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const FormSchema = z.object({
  remark: z.string().min(1, {
    message: "จำเป็นต้องกรอกข้อมูล",
  }),
});

type FormConfirmProps = {
  title: string;
  submitFormData: (data: z.infer<typeof FormSchema>) => void;
};
export const FormConfirm: React.FC<FormConfirmProps> = ({
  title,
  submitFormData,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      remark: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    submitFormData(data);
  };

  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="w-full">
              <Controller
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <TextFieldArea label="หมายเหตุ" rows={4} {...field} />
                )}
              />
            </div>
            <DialogActions>
              <Button type="submit" variant="contained" color="success">
                ยืนยัน
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </DialogContent>
    </>
  );
};

type RederFormConfirmProps = FormConfirmProps;
export const rederFormConfirm = (props: RederFormConfirmProps) => {
  return <FormConfirm {...props} />;
};
