import React, { useEffect } from "react";
import MuiAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useFormContext, useController } from "react-hook-form";

type Option = { label: string; value: string };

interface AutocompleteProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  options: Option[];
}
export const Autocomplete: React.FC<AutocompleteProps> = ({
  name,
  label,
  placeholder,
  description,
  options,
}) => {
  const { control, setValue } = useFormContext();
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController({ name, control });

  const currentValue = options.find((opt) => opt.label === value) || null;

  useEffect(() => {
    if (currentValue === null && options.length > 0) {
      setValue(name, "");
    }
  }, [currentValue, options, name, setValue]);

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

      <MuiAutocomplete
        options={options}
        getOptionLabel={(option) => option.label}
        value={currentValue}
        onChange={(_, newValue) => {
          onChange(newValue?.label ?? null);
        }}
        size="small"
        renderInput={(params: any) => (
          <TextField
            {...params}
            inputRef={ref}
            error={!!error}
            placeholder={placeholder}
          />
        )}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        noOptionsText="ไม่พบตัวเลือก"
      />

      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
