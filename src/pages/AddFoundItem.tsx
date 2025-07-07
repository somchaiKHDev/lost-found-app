import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@mui/material/Button";
import { TextFieldArea } from "../components/forms/TextFieldArea";
import { TextField } from "../components/forms/TextField";
import { Autocomplete } from "../components/forms/Autocomplete";
import { MuiDateTimeField } from "../components/forms/DateTimeField";
import moment from "moment";
import { FileUpload } from "../components/forms/FileUpload";
import axios from "axios";
import imageCompression from "browser-image-compression";

const apiUrl = import.meta.env.VITE_API_URL;

const FormSchema = z.object({
  file_upload: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(1, "กรุณาเลือกรูปภาพประกอบ"),
  item_type: z.string().min(1, {
    message: "กรุณาเลือกประเภทสิ่งของ",
  }),
  description: z.string().min(1, {
    message: "จำเป็นต้องกรอกข้อมูล",
  }),
  location_found: z.string().min(1, {
    message: "จำเป็นต้องกรอกข้อมูล",
  }),
  found_date_time: z
    .any()
    .transform((val) => {
      if (moment.isMoment(val)) return val.toDate();
      const m = moment(val);
      return m.isValid() ? m.toDate() : undefined;
    })
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "กรุณาเลือกวันและเวลาให้ถูกต้อง",
    }),
  found_by: z.any(),
  note: z.any(),
});

const AddFoundItem = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file_upload: [],
      item_type: "",
      description: "",
      location_found: "",
      found_date_time: new Date(),
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    formData.append("item_type", data.item_type);
    formData.append("description", data.description);
    formData.append("location", data.location_found);
    formData.append(
      "datetime",
      data.found_date_time instanceof Date
        ? data.found_date_time.toISOString()
        : ""
    );
    formData.append("found_by", data.found_by);
    formData.append("note", data.note);

    const localStorage = window.localStorage.getItem("isLogined");
    if (localStorage) {
      const jsonData = JSON.parse(localStorage);
      formData.append("create_by", jsonData.uid);
    }

    if (typeof data.file_upload[0] === "object") {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(
        data.file_upload[0],
        options
      );
      formData.append("file", compressedFile);
    }

    axios
      .post(`${apiUrl}/found-items/add`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        form.reset();
      })
      .catch()
      .finally();
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-between mb-4">
          <span className="text-2xl font-medium">เพิ่มรายการของที่พบ</span>
          <Button type="submit" variant="contained">
            บันทึก
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 w-full">
          <div className="grow-0 xs:grow min-w-3xs">
            <div className="col-span-full">
              <Controller
                control={form.control}
                name="file_upload"
                render={({ field }) => <FileUpload {...field} />}
              />
            </div>
          </div>
          <div className="grow flex flex-col gap-2">
            <Controller
              control={form.control}
              name="item_type"
              render={({ field }) => (
                <Autocomplete
                  label="ประเภทสิ่งของ"
                  options={[
                    { label: "กระเป๋า", value: "bag" },
                    { label: "กระเป๋าสตางค์", value: "wallet" },
                    { label: "โทรศัพท์มือถือ", value: "phone" },
                    { label: "กุญแจ", value: "keys" },
                    { label: "บัตรประชาชน/บัตรนักเรียน", value: "id_card" },
                    { label: "แล็ปท็อป/โน้ตบุ๊ก", value: "laptop" },
                    { label: "ร่ม", value: "umbrella" },
                    { label: "เครื่องเขียน", value: "stationery" },
                    { label: "เครื่องแต่งกาย", value: "clothing" },
                    { label: "เครื่องประดับ", value: "accessories" },
                    {
                      label: "หูฟัง/อุปกรณ์อิเล็กทรอนิกส์",
                      value: "electronics",
                    },
                    { label: "หนังสือ/เอกสาร", value: "documents" },
                    { label: "อื่น ๆ", value: "other" },
                  ]}
                  {...field}
                />
              )}
            />
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <TextFieldArea label="รายละเอียด" rows={3} {...field} />
              )}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <Controller
              control={form.control}
              name="location_found"
              render={({ field }) => (
                <TextField label="สถานที่พบเจอ" {...field} />
              )}
            />
          </div>
          <div className="w-1/2">
            <Controller
              control={form.control}
              name="found_date_time"
              render={({ field }) => (
                <MuiDateTimeField label="วัน/เวลาที่พบ" {...field} />
              )}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <Controller
              control={form.control}
              name="found_by"
              render={({ field }) => (
                <TextField label="ผู้พบ (ถ้ามี)" {...field} />
              )}
            />
          </div>
          <div className="w-1/2">
            <Controller
              control={form.control}
              name="note"
              render={({ field }) => (
                <TextField label="หมายเหตุเพิ่มเติม" {...field} />
              )}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddFoundItem;
