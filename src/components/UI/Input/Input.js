import React, { useState } from "react";
import InputMask from "react-input-mask";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Импорт иконок глаза
import "./Input.css"; // Стилевые классы для кастомизации

const Input = ({ mask, errorMessage, isPassword, placeholder, ...props }) => {
  const [showPassword, setShowPassword] = useState(false); // Состояние для управления видимостью пароля

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="input-wrapper">
      {mask ? (
        <InputMask {...props} mask={mask}>
          {(inputProps) => (
            <input
              {...inputProps}
              type={isPassword && !showPassword ? "password" : "text"} // Управление типом поля
            />
          )}
        </InputMask>
      ) : (
        <input
          {...props}
          type={isPassword && !showPassword ? "password" : "text"} // Управление типом поля
          placeholder={placeholder || "Введите число"}
        />
      )}
      
      {/* Иконка глаза для переключения видимости пароля */}
      {isPassword && (
        <span className="eye-icon" onClick={togglePasswordVisibility}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}

      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};

export default Input;