import React from "react";
import InputMask from "react-input-mask";
import "./Input.css"; // Стилевые классы можно добавить для кастомизации

const Input = ({ mask, errorMessage, ...props }) => {
  return (
    <div className="input-wrapper">
      {mask ? (
        <InputMask {...props} mask={mask}>
          {(inputProps) => <input {...inputProps} />}
        </InputMask>
      ) : (
        <input {...props} />
      )}
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};

export default Input;