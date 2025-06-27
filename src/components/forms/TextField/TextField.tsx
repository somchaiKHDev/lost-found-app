import MuiTextField from "@mui/material/TextField";
import type { ControllerRenderProps } from "react-hook-form";
import { useFormContext, useController } from "react-hook-form";

interface TextFieldProps extends ControllerRenderProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
}
export const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  placeholder = "",
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

      <MuiTextField
        {...field}
        id="outlined-flexible"
        size="small"
        value={field.value || ""}
        placeholder={placeholder}
        error={!!error}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderRadius: "8px",
              borderColor: "#e5e5e5",
            },
          },
        }}
        autoComplete="off"
      />

      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
