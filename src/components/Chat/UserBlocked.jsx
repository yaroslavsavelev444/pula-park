import React from "react";
import Button from "../UI/Buttons/Button";
import { useNavigate } from "react-router-dom";
import "./Chat.css";
export default function UserBlocked({ userId }) {
  const navigate = useNavigate();
  const handleNavigateToUserPage = (event, userId) => {
    event.stopPropagation(); // Остановка всплытия
    if (!userId) return;
    navigate(`/user/${userId}`);
  };
  return (
      <div className="blocked-message">
        <h3>
          Пользовтель заблокирован
        </h3>
        <Button onClick={(event) => handleNavigateToUserPage(event, userId)}>
          На страницу
        </Button>
      </div>
  );
}
