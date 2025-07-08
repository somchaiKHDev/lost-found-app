import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@mui/material/Button";
import { TextFieldArea } from "../components/forms/TextFieldArea";
import { TextField } from "../components/forms/TextField";
import { Autocomplete } from "../components/forms/Autocomplete";
import { MuiDateTimeField } from "../components/forms/DateTimeField";
import moment from "moment";
import axios from "axios";
import { useSummaryItemContext } from "../contexts/SummaryItemContext";

const apiUrl = import.meta.env.VITE_API_URL;

const FormSchema = z.object({
  fullname: z.string().min(1, {
    message: "จำเป็นต้องกรอกข้อมูล",
  }),
  contact_phone: z.string().min(1, {
    message: "จำเป็นต้องกรอกข้อมูล",
  }),
  item_type: z
    .object({
      label: z.string().min(1, { message: "กรุณาเลือกประเภทสิ่งของ" }),
      value: z.string().min(1, { message: "กรุณาเลือกประเภทสิ่งของ" }),
    })
    .nullable(),
  description: z.string().min(1, {
    message: "จำเป็นต้องกรอกข้อมูล",
  }),
  location: z.string().min(1, {
    message: "จำเป็นต้องกรอกข้อมูล",
  }),
  date_lost: z
    .any()
    .transform((val) => {
      if (moment.isMoment(val)) return val.toDate();
      const m = moment(val);
      return m.isValid() ? m.toDate() : undefined;
    })
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "กรุณาเลือกวันและเวลาให้ถูกต้อง",
    }),
  note: z.any(),
});

const AddLostItem = () => {
  const { fetchSummaryItem } = useSummaryItemContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullname: "",
      contact_phone: "",
      item_type: null,
      description: "",
      location: "",
      date_lost: new Date(),
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    let params = {
      fullname: data.fullname,
      contact_phone: data.contact_phone,
      item_type:
        typeof data.item_type === "object" ? data.item_type?.value : "",
      description: data.description,
      location: data.location,
      datetime: data.date_lost,
      note: data.note,
      create_by: "",
    };

    const localStorage = window.localStorage.getItem("isLogined");
    if (localStorage) {
      const jsonData = JSON.parse(localStorage);
      params.create_by = jsonData.uid;
    }

    axios
      .post(`${apiUrl}/lost-items/add`, params, {
        withCredentials: true,
      })
      .then(() => {
        fetchSummaryItem()
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
        <div className="flex gap-4">
          <div className="w-1/2">
            <Controller
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <TextField label="ชื่อผู้แจ้ง" {...field} />
              )}
            />
          </div>
          <div className="w-1/2">
            <Controller
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <TextField label="เบอร์ติดต่อ" {...field} />
              )}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-full">
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <TextFieldArea label="รายละเอียดสิ่งของ" rows={4} {...field} />
              )}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <Controller
              control={form.control}
              name="location"
              render={({ field }) => (
                <TextField label="สถานที่ที่หาย" {...field} />
              )}
            />
          </div>
          <div className="w-1/2">
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
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <Controller
              control={form.control}
              name="date_lost"
              render={({ field }) => (
                <MuiDateTimeField label="วัน/เวลาที่หาย" {...field} />
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

export default AddLostItem;
