// Auth.jsx
import { useState } from "react";
import LoginForm from "../../form/LoginForm";
import RegisterForm from "../../form/RegisterForm";
import ForgotPasswordForm from "../../form/ForgotPasswordForm";
import "../AuthLayout.css"; 

const Auth = () => {
  const [activeForm, setActiveForm] = useState("login"); // login | register | forgot

  const renderForm = () => {
    switch (activeForm) {
      case "login":
        return <LoginForm />;
      case "register":
        return <RegisterForm />;
      case "forgot":
        return <ForgotPasswordForm />;
      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-sidebar">
        <h2>Добро пожаловать!</h2>
        <div className="auth-form-area">{renderForm()}</div>
        <div className="auth-buttons">
          <button onClick={() => setActiveForm("login")}>Вход</button>
          <button onClick={() => setActiveForm("register")}>Регистрация</button>
          <button onClick={() => setActiveForm("forgot")}>Восстановить пароль</button>
        </div>
      </div>
    </div>
  );
};

export default Auth;