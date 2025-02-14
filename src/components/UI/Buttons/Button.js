import React from "react";
import PropTypes from "prop-types";
import "./Button.css"; // Подключаем стили

const Button = ({ children, onClick, className = "", aosProps = {}, haveBaccol = true }) => {
  return (
    <button
      className={`btn ${haveBaccol ? "btn-with-bg" : "btn-no-bg"} ${className}`} // Условное применение классов
      onClick={onClick}
      // Условное добавление AOS атрибутов
      {...(aosProps && {
        "data-aos": aosProps["data-aos"] || "fade-up",
        "data-aos-delay": aosProps["data-aos-delay"] || "0",
      })}
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