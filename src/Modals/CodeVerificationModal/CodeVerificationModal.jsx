import { useState, useRef, useEffect } from "react";
import "./CodeVerificationModal.css";
import Button from "../../components/UI/Buttons/Button";
import Loader from "../../components/UI/Loader/Loader";

const CodeVerificationModal = ({ onSubmit, onClose, loading, onResend }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const [resendTimer, setResendTimer] = useState(60);

  // Таймер
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // При изменении кода — если все заполнены, сразу отправить
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      onSubmit(code.join(""));
    }
  }, [code]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // Автовставка из буфера (Ctrl+V / Cmd+V)
  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("Text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      inputs.current[5]?.focus();
      e.preventDefault();
    }
  };

  const handleResend = () => {
    if (resendTimer === 0 && onResend) {
      onResend();
      setResendTimer(60);
    }
  };

  // Кнопка для ручной вставки из буфера
  const handleManualPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const clean = text.trim();
      if (/^\d{6}$/.test(clean)) {
        setCode(clean.split(""));
        inputs.current[5]?.focus();
      }
    } catch (e) {
      console.error("Clipboard access denied", e);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Введите код из письма</h3>
        {loading ? (
          <Loader size={30} />
        ) : (
          <form className="code-form">
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
                  onPaste={index === 0 ? handlePaste : undefined}
                />
              ))}
            </div>

            {navigator.clipboard && window.isSecureContext && (
              <Button type="button" onClick={handleManualPaste}>
                Вставить из буфера
              </Button>
            )}

            <div className="resend-section">
              {resendTimer > 0 ? (
                <p className="resend-timer">
                  Повторная отправка через {resendTimer} сек
                </p>
              ) : (
                <button
                  type="button"
                  className="resend-button"
                  onClick={handleResend}
                >
                  Отправить код повторно
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CodeVerificationModal;
