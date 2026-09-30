import { memo } from "react";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type CvDatePickerProps = {
  label: string;
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  minDate?: string | null;
  disabled?: boolean;
  required?: boolean;
};

function CvDatePicker({
  label,
  value,
  onChange,
  minDate,
  disabled = false,
  required = false,
}: CvDatePickerProps) {
  const pickerValue = value ? dayjs(value) : null;

  const pickerMinDate = minDate ? dayjs(minDate) : undefined;

  return (
    <DatePicker
      label={label}
      value={pickerValue?.isValid() ? pickerValue : null}
      minDate={pickerMinDate?.isValid() ? pickerMinDate : undefined}
      disabled={disabled}
      format="DD.MM.YYYY"
      onChange={(date) => {
        if (!date || !date.isValid()) {
          onChange(null);
          return;
        }

        onChange(date.format("YYYY-MM-DD"));
      }}
      slotProps={{
        textField: {
          fullWidth: true,
          required,
        },
      }}
    />
  );
}

export default memo(CvDatePicker);
