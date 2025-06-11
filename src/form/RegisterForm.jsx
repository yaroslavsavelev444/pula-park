import React, { useContext, useEffect, useState } from "react";
import Input from "../components/UI/Input/Input";
import Button from "../components/UI/Buttons/Button";
import { Context } from "../index";
import useDebouncedValue from "../hooks/useDebouncedValue";
import validatePassword from "../utils/validatePassword";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import "./Form.css";
import { showToast } from "../services/toastService";
import { error, log } from "../utils/logger";
import CodeVerificationModal from "../Modals/CodeVerificationModal/CodeVerificationModal";
import PhoneVerificationModal from "../Modals/PhoneVerificationModal/PhoneVerificationModal";

const RegisterForm = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const [email, setEmail] = useState("yarik.savelev.00.000@mail.ru");
  const [emailExists, setEmailExists] = useState(null);
  const [password, setPassword] = useState("228335Qwerty!");
  const [passwordRepeat, setPasswordRepeat] = useState("228335Qwerty!");
  const [name, setName] = useState("Yaroslav");
  const [surname, setSurname] = useState("Savelev");
  const [phone, setPhone] = useState("");
  const [role] = useState("Car_park");
  const [type] = useState("business");
  const [showPhoneCodeModal, setShowPhoneCodeModal] = useState(false);
  const [showEmailCodeModal, setShowEmailCodeModal] = useState(false);
  const [isCodeSubmitting, setIsCodeSubmitting] = useState(false);

  const debouncedEmail = useDebouncedValue(email, 800);

  // Проверка наличия email
  useEffect(() => {
    if (
      !debouncedEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(debouncedEmail)
    ) {
      setEmailExists(null);
      return;
    }

    const checkEmail = async () => {
      try {
        const exists = await store.checkEmailExists(debouncedEmail);
        setEmailExists(exists);
      } catch (e) {
        error("Ошибка при проверке email:", e);
      }
    };

    checkEmail();
  }, [debouncedEmail, store]);

  const validatePhone = (phone) =>
    /^\+7\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(phone);

  // === Регистрация ===
  const handleRegistration = async () => {
    const trimmed = {
      email: email.trim(),
      password: password.trim(),
      repeat: passwordRepeat.trim(),
      phone: phone.trim(),
      name: name.trim(),
      surname: surname.trim(),
    };

    if (
      !trimmed.email ||
      !trimmed.password ||
      !trimmed.repeat ||
      !trimmed.phone
    ) {
      return showToast({ text1: "Заполните все поля", type: "error" });
    }

    const passwordError = validatePassword(trimmed.password);
    if (passwordError) {
      return showToast({ text1: passwordError, type: "error" });
    }

    if (trimmed.password !== trimmed.repeat) {
      return showToast({ text1: "Пароли не совпадают", type: "error" });
    }

    if (!validatePhone(trimmed.phone)) {
      return showToast({ text1: "Некорректный номер", type: "error" });
    }

    try {
      const res = await store.registration(
        trimmed.email,
        trimmed.password,
        trimmed.phone,
        trimmed.name,
        trimmed.surname,
        role,
        type
      );

      log("Registration response:", res);

      if (res?.data?.phoneSend) {
        showToast({ text1: "Код отправлен на телефон", type: "success" });
        setShowPhoneCodeModal(true);
      } else {
        throw new Error("Ошибка при отправке кода на телефон");
      }
    } catch (e) {
      error("Ошибка регистрации:", e);
      showToast({ text1: "Ошибка регистрации", type: "error" });
    }
  };

  // === Подтверждение телефона ===
  const handlePhoneCodeSubmit = async (code) => {
    setIsCodeSubmitting(true);
    try {
      const res = await store.verifyPhoneCode(code);
      if (res?.data?.success) {
        setShowPhoneCodeModal(false);
        showToast({ text1: "Телефон подтвержден", type: "success" });
        setShowEmailCodeModal(true); // Открываем подтверждение почты
      } else {
        throw new Error("Неверный код телефона");
      }
    } catch (e) {
      error("Ошибка подтверждения телефона:", e);
      showToast({ text1: "Неверный код телефона", type: "error" });
    } finally {
      setIsCodeSubmitting(false);
    }
  };

  // === Подтверждение email ===
  const handleEmailCodeSubmit = async (code) => {
    setIsCodeSubmitting(true);
    try {
      const res = await store.verifyEmailCode(code);
      if (res?.data?.success) {
        setShowEmailCodeModal(false);
        showToast({ text1: "Email подтвержден!", type: "success" });
        setEmail("");
        setPassword("");
        setPasswordRepeat("");
        setPhone("");
        setName("");
        setSurname("");
        navigate("/profile");
      } else {
        throw new Error("Неверный код email");
      }
    } catch (e) {
      error("Ошибка подтверждения email:", e);
      showToast({ text1: "Неверный код email", type: "error" });
    } finally {
      setIsCodeSubmitting(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleRegistration();
  };

  const handlePhoneResend = async () => {
    try {
      const res = await store.resendPhoneCode();
      if (res?.status === 200) {
        showToast({ text1: "Код отправлен на телефон", type: "success" });
      } else {
        throw new Error("Ошибка при отправке кода на телефон");
      }
    } catch (e) {
      error("Ошибка при отправке кода на телефон:", e);
      showToast({ text1: "Ошибка при отправке кода на телефон", type: "error" });
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
        <form onSubmit={onSubmit}>
          <div style={{ position: "relative", width: "100%" }}>
            <Input
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "90%" }}
            />
            {email && emailExists !== null && (
              <div
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: emailExists ? "red" : "green",
                }}
              >
                {emailExists ? <FaTimesCircle /> : <FaCheckCircle />}
              </div>
            )}
          </div>

          <Input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "90%" }}
            disabled={emailExists}
          />

          <Input
            type="password"
            placeholder="Повторите пароль"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            required
            style={{ width: "90%" }}
            disabled={emailExists}
          />

          <Input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "90%" }}
            disabled={emailExists}
          />
          <Input
            type="text"
            placeholder="Фамилия"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            style={{ width: "90%" }}
            disabled={emailExists}
          />
          <Input
            type="text"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            mask={"+7 (999) 999-99-99"}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "90%" }}
            disabled={emailExists}
          />

          <Button type="submit" disabled={isCodeSubmitting}>
            Зарегистрироваться
          </Button>
        </form>
      </div>

      {/* Модальные окна */}
      {showPhoneCodeModal && (
        <PhoneVerificationModal
          onSubmit={handlePhoneCodeSubmit}
          onClose={() => setShowPhoneCodeModal(false)}
          loading={isCodeSubmitting}
          onResend={handlePhoneResend}
        />
      )}
      {showEmailCodeModal && (
        <CodeVerificationModal
          onSubmit={handleEmailCodeSubmit}
          onClose={() => setShowEmailCodeModal(false)}
          loading={isCodeSubmitting}
          onResend={handleEmailResend}
        />
      )}
    </div>
  );
};

export default observer(RegisterForm);
