import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Input from "../components/UI/Input/Input";
import Button from "../components/UI/Buttons/Button";
import { useToast } from "../providers/ToastProvider";
import { Context } from "../index";
import { useContext } from "react";
import validatePassword from "../utils/validatePassword";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  if(!token) {
    navigate("/auth");
  }
  console.log('resetToken',token);
  const { store } = useContext(Context);
  const { showToast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Проверка паролей
    if (!newPassword || !confirmPassword) {
      showToast({ text1: "Заполните все поля", type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast({ text1: "Пароли не совпадают", type: "error" });
      return;
    }

    // Миддлварная проверка пароля
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      showToast({ text1: passwordError, type: "error" });
      return;
    }

    try {
      await store.resetForgottenPassword(token, newPassword);
      showToast({ text1: "Пароль успешно изменён", type: "success" });
      navigate("/auth");
    } catch (error) {
      console.error("Ошибка:", error);
      showToast({ text1: error.response?.data?.message || "Ошибка сброса пароля", type: "error" });
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2>Восстановление пароля</h2>
        <form onSubmit={handleResetPassword}>
          <Input
            placeholder="Введите новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            isPassword={true}
          />
          <Input
        
            placeholder="Повторите новый пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            isPassword={true}
          />
          <Button type="submit">Сохранить</Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;