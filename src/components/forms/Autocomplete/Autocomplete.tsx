import React from "react";
import type { ControllerRenderProps } from "react-hook-form";
import MuiAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext, useController } from "react-hook-form";

type Option = { label: string; value: string };

interface TextAreaProps extends ControllerRenderProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  description?: string;
  options: Option[];
}
export const Autocomplete: React.FC<TextAreaProps> = ({
  label = "Label",
  placeholder = "",
  rows = 4,
  description,
  options,
  ...props
}) => {
  const { control } = useFormContext();
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({ ...props, control });

  const currentValue = options.find((opt) => opt.value === value) || null;

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <MuiAutocomplete
          options={options}
          getOptionLabel={(option) => option.label}
          value={currentValue}
          onChange={(_, newValue) => {
            onChange(newValue?.value ?? "");
          }}
          size="small"
          renderInput={(params: any) => (
            <TextField
              {...params}
              inputRef={ref}
              label={label}
              error={!!error}
              helperText={error?.message}
            />
          )}
          isOptionEqualToValue={(option, val) => option.value === val.value}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};
