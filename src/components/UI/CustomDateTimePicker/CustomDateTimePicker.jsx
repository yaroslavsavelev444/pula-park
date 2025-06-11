import React, { useState, useEffect } from "react";
import { TextField, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ru";

const CustomDateTimePicker = ({ dateTime, onChange, placeholder }) => {
  const now = dayjs();
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    onChange({ date, time });
  }, [date, time]);

  const handleDateChange = (newDate) => {
    if (!newDate || newDate.isBefore(now, "day")) return;
    setDate(newDate);
    if (newDate.isAfter(now, "day")) {
      setTime(null);
    }
  };

  const handleTimeChange = (newTime) => {
    if (!newTime) return;
    if (date?.isSame(now, "day") && newTime.isBefore(now, "minute")) return;
    setTime(newTime);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        alignItems="center"
        sx={{
          width: "100%",
          maxWidth: 320,
          padding: 2,
          backgroundColor: "background.default",
          color: "text.primary",
          borderRadius: 2,
          boxShadow: 3,
          "&[data-theme='dark']": {
            backgroundColor: "#333",
            color: "#fff",
          },
        }}
      >
        <DatePicker
          label={placeholder || "Выберите дату"}
          value={date}
          minDate={now}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
        <TimePicker
          label="Выберите время"
          value={time}
          disabled={!date} // Блокируем выбор времени, если дата не выбрана
          onChange={handleTimeChange}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default CustomDateTimePicker;