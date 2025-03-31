import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Импорт иконок глаза
import "./Input.css"; // Стилевые классы для кастомизации

const Input = ({
  mask,
  errorMessage,
  isPassword,
  placeholder,
  isPlaceholderAnimated = false, // Флаг для анимации placeholder
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false); // Состояние для управления видимостью пароля
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Анимация placeholder, если включен флаг
  useEffect(() => {
    if (isPlaceholderAnimated && placeholder) {
      const interval = setInterval(() => {
        setAnimatedPlaceholder(placeholder.slice(0, placeholderIndex));
        if (placeholderIndex + 1 > placeholder.length) {
          setPlaceholderIndex(0); // Возвращаемся в начало
        } else {
          setPlaceholderIndex(placeholderIndex + 1);
        }
      }, 150); // Печатаем по одному символу каждые 150 мс

      return () => clearInterval(interval);
    } else {
      // Если анимация не включена, просто показываем полный placeholder
      setAnimatedPlaceholder(placeholder);
    }
  }, [placeholder, placeholderIndex, isPlaceholderAnimated]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Функция для удаления букв
  const handleInputChange = (e) => {
    const { value } = e.target;
    // Удаление всего, что не является цифрой
    const numericValue = value.replace(/[^\d]/g, '');
    if (onChange) {
      onChange(e, numericValue); // Передаем измененное значение в onChange
    }
  };

  const renderInput = () => {
    if (mask) {
      return (
        <InputMask {...props} mask={mask} onChange={handleInputChange}>
          {(inputProps) => (
            <input
              {...inputProps}
              type={isPassword && !showPassword ? "password" : "text"} // Управление типом поля
              placeholder={animatedPlaceholder}
            />
          )}
        </InputMask>
      );
    } else {
      return (
        <input
          {...props}
          type={isPassword && !showPassword ? "password" : "text"} // Управление типом поля
          placeholder={animatedPlaceholder}
          onChange={handleInputChange} // Обработчик для удаления букв
        />
      );
    }
  };

  return (
    <div className="input-wrapper">
      {renderInput()}
      
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