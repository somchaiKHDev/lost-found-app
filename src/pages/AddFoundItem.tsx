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

const FormSchema = z.object({
  file_upload: z.instanceof(File, { message: "กรุณาอัปโหลดไฟล์" }),
  item_type: z
    .object(
      {
        label: z.string(),
        value: z.string(),
      },
      { required_error: "กรุณาเลือกประเภทสิ่งของ" }
    )
    .refine((val) => val.label && val.value, {
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
      file_upload: undefined,
      item_type: undefined,
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
          <div className="grow-0 xs:grow">
            <div className="col-span-full">
              <Controller
                control={form.control}
                name="file_upload"
                render={({ field: { onChange }, fieldState }) => (
                  <>
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
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(file); // 👈 ส่งเข้า form
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
                    { label: "The Godfather", value: "The Godfather" },
                    { label: "Pulp Fiction", value: "Pulp Fiction" },
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
