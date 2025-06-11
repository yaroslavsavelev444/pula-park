import { MessageSquare } from "lucide-react";
import "./Chat.css";

const NoChatSelected = () => {
  return (
    <div className="no-chat">
      <div className="no-chat-content">
        <div className="no-chat-icon">
          <div className="icon-wrapper">
            <MessageSquare className="icon" />
          </div>
        </div>

        <h2>Выбранных чатов нет!</h2>
        <p>Выберите чат, чтобы начать общение</p>
      </div>
    </div>
  );
};

export default NoChatSelected;