import { PhotoIcon } from "@heroicons/react/24/solid";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MuiButton from "@mui/material/Button";
import { TextFieldArea } from "../components/forms/TextFieldArea";
import { TextField } from "../components/forms/TextField";
import { Autocomplete } from "../components/forms/Autocomplete";
import { MuiDateTimeField } from "../components/forms/DateTimeField";
import moment from "moment";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file_upload: [],
      item_type: "The Godfather",
      description: "",
      location_found: "",
      found_date_time: new Date(),
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("onSubmit", data);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="w-full mb-4">
          <span className="text-2xl font-medium">เพิ่มรายการของที่พบ</span>
        </div>
        <div className="flex flex-wrap gap-4 w-full">
          <div className="grow-0 xs:grow min-w-3xs">
            <div className="col-span-full">
              <Controller
                control={form.control}
                name="file_upload"
                render={({ field: { onChange }, fieldState }) => (
                  <>
                    {previewUrl ? (
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 p-4 relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="mx-auto h-40 object-contain rounded border"
                        />
                        <div className="absolute top-1 right-1">
                          <IconButton
                            aria-label="delete"
                            onClick={() => {
                              setPreviewUrl(null);
                              form.setValue("file_upload", []);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          <PhotoIcon
                            aria-hidden="true"
                            className="mx-auto size-12 text-gray-300"
                          />
                          <div className="mt-4 flex text-sm/6 text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={(e) => {
                                  const files = e.target.files;
                                  if (files && files.length > 0) {
                                    const file = files[0];
                                    onChange(Array.from(files));
                                    const url = URL.createObjectURL(file);
                                    setPreviewUrl(url);
                                  }
                                }}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs/5 text-gray-600">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    )}

                    {fieldState.error && (
                      <p className="text-sm text-red-600">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
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

        <MuiButton type="submit" variant="contained">
          บันทึก
        </MuiButton>
      </form>
    </FormProvider>
  );
};

export default AddFoundItem;
