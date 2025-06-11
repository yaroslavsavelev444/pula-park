import { useState, useRef, useEffect } from "react";
import "./CodeVerificationModal.css";
import Button from "../../components/UI/Buttons/Button";

const CodeVerificationModal = ({ onSubmit, onClose, loading, onResend }) => {
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
        <h3>Введите код из письма</h3>
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
           <div className="resend-section">
            {resendTimer > 0 ? (
              <p className="resend-timer">Повторная отправка через {resendTimer} сек</p>
            ) : (
              <button type="button" className="resend-button" onClick={handleResend}>
                Отправить код повторно
              </button>
            )}
          </div>
          <Button type="submit" disabled={loading || code.includes("")}>
            {loading ? "Отправка..." : "Подтвердить"}
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </form>
      </div>
      
    </div>
  );
};

export default CodeVerificationModal;