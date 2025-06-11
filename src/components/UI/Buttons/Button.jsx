import React from "react";
import PropTypes from "prop-types";
import "./Button.css"; // Подключаем стили

const Button = ({
  children,
  onClick,
  type = "button", // ✅ Дефолтное значение
  className = "",
  disabled = false,
  haveBaccol = true,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn ${haveBaccol ? "btn-with-bg" : "btn-no-bg"} ${className}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;