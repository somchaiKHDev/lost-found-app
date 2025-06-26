import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";

import type { ControllerRenderProps } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext, useController } from "react-hook-form";
import moment from "moment";

interface TextFieldProps extends ControllerRenderProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  description?: string;
}
export const MuiDateTimeField: React.FC<TextFieldProps> = ({
  label = "Label",
  placeholder = "",
  rows = 4,
  description,
  ...props
}) => {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ ...props, control });

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimeField
            {...field}
            value={moment(field.value) || null}
            onChange={(newValue) => field.onChange(newValue)}
            format="YYYY-MM-DD HH:mm"
            slotProps={{
              textField: {
                size: "small",
                error: !!error,
                helperText: error?.message,
              },
            }}
            sx={{
              "& .MuiPickersInputBase-root": {
                "& fieldset": {
                  borderRadius: "8px",
                  borderColor: "#e5e5e5",
                },
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};
