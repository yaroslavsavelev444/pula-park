import React from "react";
import PropTypes from "prop-types";
import "./Button.css"; // Подключаем стили

const Button = ({ children, onClick, className = "", disabled = false, haveBaccol = true }) => {
  return (
    <button
      className={`btn ${haveBaccol ? "btn-with-bg" : "btn-no-bg"} ${className}`} // Условное применение классов
      onClick={!disabled ? onClick : undefined} // Блокируем onClick, если кнопка отключена
      disabled={disabled} // Добавляем атрибут disabled
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool, // Флаг для блокировки кнопки
  haveBaccol: PropTypes.bool, // Флаг для фона
};

export default Button;