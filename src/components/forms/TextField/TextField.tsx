import MuiTextField from "@mui/material/TextField";
import type { ControllerRenderProps } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext, useController } from "react-hook-form";

interface TextFieldProps extends ControllerRenderProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  description?: string;
}
export const TextField: React.FC<TextFieldProps> = ({
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
        <MuiTextField
          {...field}
          id="outlined-flexible"
          size="small"
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
