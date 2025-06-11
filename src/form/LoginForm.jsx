import React, { useContext, useState } from "react";
import Input from "../components/UI/Input/Input";
import Button from "../components/UI/Buttons/Button";
import { Context } from "../index";
import { useNavigate } from "react-router-dom";
import validatePassword from "../utils/validatePassword";
import "../form/Form.css";
import { showToast } from "../services/toastService";
import CodeVerificationModal from "../Modals/CodeVerificationModal/CodeVerificationModal";
import { error, log } from "../utils/logger";

const LoginForm = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = useState("yarik.savelev.00.000@mail.ru");
  const [password, setPassword] = useState("228335Qwerty!");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [isCodeSubmitting, setIsCodeSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return showToast({ text1: "Заполните все поля", type: "error" });
    }

    const passwordError = validatePassword(trimmedPassword);
    if (passwordError) {
      return showToast({ text1: passwordError, type: "error" });
    }

    const res = await store.login(trimmedEmail, trimmedPassword);
    if (res?.data?.faCode) {
      showToast({ text1: "Отправили код вам на почту", type: "success" });
      setShowCodeModal(true); // показываем окно
    }
  };

  const handleCodeSubmit = async (code) => {
    setIsCodeSubmitting(true);
    try {
      const res = await store.verifyEmailCode(code);
      if (res.status === 200) {
        showToast({ text1: "Успешно подтверждено!", type: "success" });
        setShowCodeModal(false);
        navigate("/dashboard"); // или куда надо
      }
    } catch (e) {
      error("Error verifying code:", e);
      showToast({ text1: e, type: "error" });
    } finally {
      setIsCodeSubmitting(false);
    }
  };

  const handleEmailResend = async () => {
    try {
      const res = await store.resendEmailCode();
      if (res?.status === 200) {
        showToast({ text1: "Код отправлен на почту", type: "success" });
      } else {
        throw new Error("Ошибка при отправке кода на почту");
      }
    } catch (e) {
      error("Ошибка при отправке кода на почту:", e);
      showToast({ text1: "Ошибка при отправке кода на почту", type: "error" });
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <form onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "90%" }}
          />
          <Input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "90%" }}
          />
          <Button type="submit" disabled={!email.trim() || !password.trim()}>
            Войти
          </Button>
        </form>
      </div>
      {showCodeModal && (
        <CodeVerificationModal
          onSubmit={handleCodeSubmit}
          onClose={() => setShowCodeModal(false)}
          loading={isCodeSubmitting}
          onResend={handleEmailResend}
        />
      )}
    </div>
  );
};

export default LoginForm;
