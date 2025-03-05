import React, { useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import "./TimePicker.css"; // Подключаем кастомные стили

const CustomTimePicker = ({ value, onChange }) => {
  return (
    <div className="custom-time-picker">
      <TimePicker
        onChange={onChange}
        value={value}
        disableClock={true} // Отключаем аналоговые часы
        format="HH:mm"
        clearIcon={null} // Убираем иконку очистки
      />
    </div>
  );
};

export default CustomTimePicker;