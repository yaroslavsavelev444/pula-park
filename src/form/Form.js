import React, { useContext, useState } from "react";
import "./Form.css";
import Input from "../components/UI/Input/Input";
import Button from "../components/UI/Buttons/Button";
import { Context } from "../index";
import { useNavigate } from "react-router-dom";
import { useToast } from "../providers/ToastProvider";
// import showNotification from "../utils/showNotification";


const Form = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { store } = useContext(Context);
  const { showToast } = useToast();
  const [email, setEmail] = useState('yarik.savelev.00.00@mail.ru');
  const [password, setPassword] = useState('123123qweqwe');
  const navigate = useNavigate(); // Хук для навигации

  const [phone, setPhone] = useState('');
  const [name , setName] = useState('');
  const [surname, setSurname] = useState('');
  const [role, setRole] = useState('Car_park');
  const [type, setType] = useState('business');
  const [key , setKey] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault(); // Предотвращение перезагрузки страницы
    try {
      // Начать индикатор загрузки
      store.setLoading(true);
      
      if (isLogin) {
        await store.login(email, password);
      } else {
        await store.registration(email, password, phone, name, surname, role, type, key);
      }

      if (store.isAuth) {
        navigate("/profile");
      }

      // Показать успех
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      // Показать ошибку
      showToast('Произошла ошибка, попробуйте снова.', 'error');
    } finally {
      // Завершить индикатор загрузки
      store.setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
        <form onSubmit={onSubmit}>
          {!isLogin && (
            <>
              <Input
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} // Обновление состояния
                mask="+7 (999) 999-99-99"
              />
              <Input
                placeholder="Введите имя"
                value={name}
                onChange={(e) => setName(e.target.value)} // Обновление состояния
              />
              <Input
                placeholder="Введите фамилию"
                value={surname}
                onChange={(e) => setSurname(e.target.value)} // Обновление состояния
              />
              <Input
            placeholder="Введите ключ доступа"
            value={key}
            onChange={(e) => setKey(e.target.value)} // Обновление состояния
            secureTextEntry={true}
          />
            </>
          )}
          <Input
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Обновление состояния
            keyboardType="email-address"
          />
          <Input
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Обновление состояния
            secureTextEntry={true}
          />
         
          <Button type="submit">{isLogin ? "Войти" : "Зарегистрироваться"}</Button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)} className="toggle">
          {isLogin ? "Нет аккаунта? Регистрация" : "Есть аккаунт? Войти"}
        </p>
      </div>
    </div>
  );
};

export default Form;