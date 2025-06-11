import { useState, useRef, useEffect } from "react";
import "../CodeVerificationModal/CodeVerificationModal.css";
import Button from "../../components/UI/Buttons/Button";

const PhoneVerificationModal = ({ onSubmit, onClose, loading, phoneNumber, onResend }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const [resendTimer, setResendTimer] = useState(60);

  // Таймер для повторной отправки
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.join("").length === 6) {
      onSubmit(code.join(""));
    }
  };

  const handleResend = () => {
    if (resendTimer === 0 && onResend) {
      onResend();
      setResendTimer(60);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Подтвердите номер телефона</h3>
        {phoneNumber && <p className="phone-info">Код отправлен на номер: <b>{phoneNumber}</b></p>}

        <form onSubmit={handleSubmit} className="code-form">
          <div className="code-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <Button type="submit" disabled={loading || code.includes("")}>
            {loading ? "Проверка..." : "Подтвердить"}
          </Button>

          <Button onClick={onClose} type="button">Отмена</Button>

          <div className="resend-section">
            {resendTimer > 0 ? (
              <p className="resend-timer">Повторная отправка через {resendTimer} сек</p>
            ) : (
              <button type="button" className="resend-button" onClick={handleResend}>
                Отправить код повторно
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhoneVerificationModal;