import React, { useContext, useState } from "react";
import "./Form.css";
import Input from "../components/UI/Input/Input";
import Button from "../components/UI/Buttons/Button";
import { Context } from "../index";
import { useNavigate } from "react-router-dom";
import { useToast } from "../providers/ToastProvider";
import validatePassword from "../utils/validatePassword";
const Form = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { store } = useContext(Context);
  const { showToast } = useToast();
  const [email, setEmail] = useState("yarik.savelev.00.00@mail.ru");
  const [password, setPassword] = useState("123123qweqwe");
  const navigate = useNavigate(); // Хук для навигации
  const [forgotPassword, setForgotPassword] = useState(false);

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [role, setRole] = useState("Car_park");
  const [type, setType] = useState("business");
  const [key, setKey] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault(); // Предотвращение перезагрузки страницы

    try {
      store.setLoading(true);

      if (forgotPassword) {
        console.log("forgotPassword", email);
        await store.forgotPassword(email, showToast); // Вызываем метод сброса пароля
        showToast({ text1: "Письмо отправлено", type: "success" });
        setForgotPassword(false); // После сброса возвращаемся к логину
      } else if (isLogin) {
        if (!password) {
          showToast({ text1: "Заполните все поля", type: "error" });
          return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
          showToast({ text1: passwordError, type: "error" });
          return;
        }

        await store.login(email, password);
        if (store.isAuth) navigate("/profile");
      } else {
        if (!password) {
          showToast({ text1: "Заполните все поля", type: "error" });
          return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
          showToast({ text1: passwordError, type: "error" });
          return;
        }
        await store.registration(
          email,
          password,
          phone,
          name,
          surname,
          role,
          type,
          key
        );
      }
    } catch (error) {
      console.error("Ошибка:", error);
      showToast({
        text1: error.response?.data?.message || "Неизвестная ошибка",
        type: "error",
      });
    } finally {
      store.setLoading(false);
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
          <Input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {!forgotPassword && (
            <>
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {!isLogin && (
                <>
                  <Input
                    type="text"
                    placeholder="Введите имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Введите фамилию"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Введите ключ доступа"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  />
                </>
              )}
            </>
          )}

          <Button type="submit">
            {forgotPassword
              ? "Восстановить"
              : isLogin
              ? "Войти"
              : "Зарегистрироваться"}
          </Button>
        </form>

        {!forgotPassword && (
          <>
            <p className="toggle" onClick={() => setForgotPassword(true)}>
              Забыл пароль?
            </p>
            <p onClick={() => setIsLogin(!isLogin)} className="toggle">
              {isLogin ? "Нет аккаунта? Регистрация" : "Есть аккаунт? Войти"}
            </p>
          </>
        )}
        {forgotPassword && (
          <p className="toggle" onClick={() => setForgotPassword(false)}>
            Назад
          </p>
        )}
      </div>
    </div>
  );
};

export default Form;
