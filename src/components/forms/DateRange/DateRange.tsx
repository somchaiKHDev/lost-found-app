import React, { useState } from "react";
import {
  useController,
  useFormContext,
  type ControllerRenderProps,
} from "react-hook-form";
import MuiTextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { DateRange as LibDateRange } from "react-date-range";
import { th } from "date-fns/locale";

type DateRangeType = {
  startDate: Date | null;
  endDate: Date | null;
  key: string;
};

interface DateRangeProps extends ControllerRenderProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
}
export const DateRange: React.FC<DateRangeProps> = ({
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

  const [dateRange, setDateRange] = useState<DateRangeType[]>([
    {
      startDate: field.value[0],
      endDate: field.value[1],
      key: "selection",
    },
  ]);
  const [visible, setVisible] = useState<boolean>(false);

  const openDialog = () => {
    setVisible(true);
  };

  const closeDialog = () => {
    setVisible(false);
  };

  const reset = () => {
    setDateRange([
      {
        startDate: null,
        endDate: null,
        key: "selection",
      },
    ]);
    field.onChange([]);
    closeDialog();
  };

  const selectedDate = () => {
    const range = [dateRange[0].startDate, dateRange[0].endDate];
    field.onChange(range);
    closeDialog();
  };

  return (
    <>
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
          value={
            field.value?.[0] && field.value?.[1]
              ? `${new Date(field.value[0]).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })} - ${new Date(field.value[1]).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}`
              : ""
          }
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
          slotProps={{
            input: {
              readOnly: true,
              endAdornment: (
                <InputAdornment position="start">
                  <ClearIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      field.onChange([]);
                    }}
                  />
                  <DateRangeIcon
                    sx={{ cursor: "pointer" }}
                    onClick={openDialog}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
        {error && <p className="text-sm text-red-600">{error.message}</p>}
      </div>

      <Dialog open={visible} onClose={closeDialog}>
        <DialogTitle>เลือกช่วงวันที่</DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <DialogContentText>
            กรุณาเลือกช่วงวันที่ที่คุณต้องการ
          </DialogContentText>
          <LibDateRange
            editableDateInputs={true}
            onChange={(item: any) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            locale={th}
          />
          <DialogActions>
            <Button onClick={reset}>ยกเลิก</Button>
            <Button onClick={selectedDate}>ตกลง</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};
