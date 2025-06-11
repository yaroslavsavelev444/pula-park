import React, { useContext, useState } from "react";
import Input from "../components/UI/Input/Input";
import Button from "../components/UI/Buttons/Button";
import { Context } from "../index";
import "../form/Form.css";
import { showToast } from "../services/toastService";

const ForgotPasswordForm = () => {
  const { store } = useContext(Context);

  const [email, setEmail] = useState("");

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!validateEmail(email.trim())) {
      return showToast({ text1: "Введите корректный email", type: "error" });
    }
      await store.forgotPassword(email.trim());
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <form onSubmit={handleForgotPassword}>
          <Input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "90%" }}
          />
          <Button type="submit" disabled={!email.trim()}>
            Восстановить
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;