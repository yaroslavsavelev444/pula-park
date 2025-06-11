import React, { useContext, useEffect, useState } from "react";
import "./Form.css";
import Input from "../components/UI/Input/Input";
import Button from "../components/UI/Buttons/Button";
import { Context } from "../index";
import { useNavigate } from "react-router-dom";
import validatePassword from "../utils/validatePassword";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { observer } from "mobx-react-lite";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { showToast } from "../services/toastService";
import CodeVerificationModal from "../Modals/CodeVerificationModal/CodeVerificationModal";
import { error, log } from "../utils/logger";

const Form = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState(null);
  const debouncedEmail = useDebouncedValue(email, 800);
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [role, setRole] = useState("Car_park");
  const [type, setType] = useState("business");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [isCodeSubmitting, setIsCodeSubmitting] = useState(false);

  useEffect(() => {

    const validate = async () => {
      if (!debouncedEmail || !/\S+@\S+\.\S+/.test(debouncedEmail)) {
        setEmailExists(null);
        return;
      }

      // Проверяем email только при регистрации
      if (!isLogin && !forgotPassword) {
        const exists = await store.checkEmailExists(debouncedEmail);
        setEmailExists(exists);
      }
    };

    validate();
  }, [debouncedEmail, isLogin, forgotPassword, store]);

  const resetFields = () => {
    setPassword("");
    setPasswordRepeat("");
    setName("");
    setSurname("");
    setPhone("");
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) =>
    /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/.test(phone);

  const handleForgotPassword = async () => {
    if (!validateEmail(email.trim())) {
      return showToast({ text1: "Введите корректный email", type: "error" });
    }
    const res = await store.forgotPassword(email.trim());

    if (res.status === 200) {
      showToast({ text1: "Отправили код вам на почту", type: "success" });
      setShowCodeModal(true); // показываем окно
    }
  };

  const handleLogin = async () => {
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

    if (res.status === 200) {
      showToast({ text1: "Отправили код вам на почту", type: "success" });
      setShowCodeModal(true); // показываем окно
    }
  };

  const handleRegistration = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedRepeat = passwordRepeat.trim();
    const trimmedPhone = phone.trim();
    const trimmedName = name.trim();
    const trimmedSurname = surname.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedRepeat || !trimmedPhone) {
      return showToast({ text1: "Заполните все поля", type: "error" });
    }

    const passwordError = validatePassword(trimmedPassword);
    if (passwordError) {
      return showToast({ text1: passwordError, type: "error" });
    }

    if (trimmedPassword !== trimmedRepeat) {
      return showToast({ text1: "Пароли не совпадают", type: "error" });
    }

    if (!validatePhone(trimmedPhone)) {
      return showToast({ text1: "Некорректный номер", type: "error" });
    }

    const res = await store.registration(
      trimmedEmail,
      trimmedPassword,
      trimmedPhone,
      trimmedName,
      trimmedSurname,
      role,
      type
    );

    if (res.status === 200) {
      showToast({ text1: "Отправили код вам на почту", type: "success" });
      setShowCodeModal(true); // показываем окно
    }
  };

  const onSubmit = async (e) => {
    log("onSubmit");
    e.preventDefault();
    try {
      if (forgotPassword) return await handleForgotPassword();
      if (isLogin) return await handleLogin();
      else return await handleRegistration();
    } catch (e) {
      error("Ошибка:", e);
      showToast({ text1: "Произошла ошибка", type: "error" });
    }
  };

  const handleCodeSubmit = async (code) => {
    setIsCodeSubmitting(true);
    try {
      const res = await store.verifyCode(email.trim(), code);
      if (res.status === 200) {
        showToast({ text1: "Успешно подтверждено!", type: "success" });
        setShowCodeModal(false);
        navigate("/dashboard"); // или куда надо
      }
    } catch (e) {
      error("Error verifying code:", e);
      showToast({ text1: "Неверный код", type: "error" });
    } finally {
      setIsCodeSubmitting(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2>
          {forgotPassword
            ? "Восстановление пароля"
            : isLogin
            ? "Вход"
            : "Регистрация"}
        </h2>

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

          {!forgotPassword && (
            <>
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "90%" }}
                disabled={emailExists}
              />

              {!isLogin && (
                <>
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
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: "90%" }}
                    disabled={emailExists}
                  />
                </>
              )}
            </>
          )}

          <Button
  type="submit"
  disabled={!email.trim() || (!password.trim())}
>
            {forgotPassword
              ? "Восстановить"
              : isLogin
              ? "Войтsdfsfи"
              : "Зарегистрироваться"}
          </Button>
        </form>

        {!forgotPassword ? (
          <>
            <p className="toggle" onClick={() => setForgotPassword(true)}>
              Забыли пароль?
            </p>
            <p
              className="toggle"
              onClick={() => {
                setIsLogin((prev) => !prev);
                resetFields();
              }}
            >
              {isLogin ? "Нет аккаунта? Регистрация" : "Есть аккаунт? Войти"}
            </p>
          </>
        ) : (
          <p className="toggle" onClick={() => setForgotPassword(false)}>
            Назад
          </p>
        )}
      </div>
      {showCodeModal && (
        <CodeVerificationModal
          onSubmit={handleCodeSubmit}
          onClose={() => setShowCodeModal(false)}
          loading={isCodeSubmitting}
        />
      )}
    </div>
  );
};

export default observer(Form);
