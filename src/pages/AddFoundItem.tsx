import { PhotoIcon } from "@heroicons/react/24/solid";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MuiButton from "@mui/material/Button";
import { TextFieldArea } from "../components/forms/TextFieldArea";

const FormSchema = z.object({
  description: z.string().min(1, {
    message: "จำเป็นต้องกรอกข้อมูล",
  }),
});

const AddFoundItem = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("onSubmit", data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="w-full mb-4">
          <span className="text-2xl font-medium">เพิ่มรายการของที่พบ</span>
        </div>
        <div className="flex flex-wrap gap-4 w-full">
          <div className="grow-0 xs:grow">
            <div className="col-span-full">
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
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs/5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grow flex flex-col gap-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => <TextFieldArea label="รายละเอียด" {...field} />}
            />
          </div>
        </div>
        <MuiButton type="submit" variant="contained">
          บันทึก
        </MuiButton>
      </form>
    </Form>
  );
};

export default AddFoundItem;
