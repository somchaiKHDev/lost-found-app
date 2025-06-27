import React from "react";
import type { ControllerRenderProps } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { useFormContext, useController } from "react-hook-form";

interface TextAreaProps extends ControllerRenderProps {
  name: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  description?: string;
}
export const TextFieldArea: React.FC<TextAreaProps> = ({
  name,
  label = "Label",
  placeholder = "",
  rows = 4,
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

      <TextField
        {...field}
        id={name}
        size="small"
        placeholder={placeholder}
        multiline
        rows={rows}
        error={!!error}
        fullWidth
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderRadius: "8px",
              borderColor: "#e5e5e5",
            },
          },
        }}
      />

      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
