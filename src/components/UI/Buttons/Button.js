import React from "react";
import PropTypes from "prop-types";
import "./Button.css"; // Подключаем стили

const Button = ({ children, onClick, className = "", aosProps = {}, haveBaccol = true }) => {
  // Условное добавление атрибутов AOS, если они есть

  return (
    <button
      className={`btn ${haveBaccol ? "btn-with-bg" : "btn-no-bg"} ${className}`} // Условное применение классов
      onClick={onClick}

    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  aosProps: PropTypes.object, // Пропсы для AOS
  haveBaccol: PropTypes.bool, // Флаг для фона
};

export default Button;