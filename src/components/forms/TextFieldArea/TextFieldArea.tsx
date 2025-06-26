import React from "react";
import type { ControllerRenderProps } from "react-hook-form";
import TextField from "@mui/material/TextField";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext, useController } from "react-hook-form";

interface TextAreaProps extends ControllerRenderProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  description?: string;
}
export const TextFieldArea: React.FC<TextAreaProps> = ({
  label = "Label",
  placeholder = "",
  rows = 4,
  description,
  ...field
}) => {
  const { control } = useFormContext();
  const {
    fieldState: { error },
  } = useController({ ...field, control });

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <TextField
          {...field}
          id="outlined-multiline-flexible"
          size="small"
          multiline
          rows={7}
          error={!!error}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderRadius: "8px",
                borderColor: "#e5e5e5",
              },
            },
          }}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};
