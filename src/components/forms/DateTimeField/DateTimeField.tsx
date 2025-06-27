import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import type { ControllerRenderProps } from "react-hook-form";
import { useFormContext, useController } from "react-hook-form";
import moment from "moment";

interface TextFieldProps extends ControllerRenderProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
}
export const MuiDateTimeField: React.FC<TextFieldProps> = ({
  name,
  label,
  placeholder,
  description,
}) => {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={name}
          className={`block mb-1 font-medium ${
            error ? "text-red-600" : "text-gray-700"
          }`}
        >
          {label}
        </label>
      )}

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
              placeholder,
            },
          }}
          sx={{
            width: "100%",
            "& .MuiPickersInputBase-root": {
              "& fieldset": {
                borderRadius: "8px",
                borderColor: "#e5e5e5",
              },
            },
          }}
        />
      </LocalizationProvider>

      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
