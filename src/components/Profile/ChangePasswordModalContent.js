
import React from "react";
import Button from "../UI/Buttons/Button";
import "./Profile.css";
import Input from "../UI/Input/Input";

export default function ChangePasswordModalContent({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  repeatPassword,
  setRepeatPassword,
  handleChangePassword,
}) {
  return (
    <div style={{justifyContent:"center" , alignItems:"center" , flexDirection:"column"}}>
      <h2>Смена пароля</h2>
      <Input
        placeholder="Старый пароль"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        isPassword
      />
      <Input
        placeholder="Новый пароль"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        isPassword
      />
      <Input
        placeholder="Повторите новый пароль"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        isPassword
      />
      <Button onClick={handleChangePassword}>Сохранить</Button>
    </div>
  );
}
