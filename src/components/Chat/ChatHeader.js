import { X } from "lucide-react";
import "./ChatContainer.css"; // Подключение CSS-файла
import { Context } from "../..";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

const ChatHeader = () => {
  const { chatStore } = useContext(Context);

  const handleSetSelectedUser = () => {
    chatStore.setSelectedUser(null);
  };

  return (
    <div className="chat-header">
      <div className="header-content">
        <div className="user-info-chat">
          <div className="avatar">
            <div className="avatar-size">
              <img src="/img/no-profile-img.png" alt="User Avatar" />
            </div>
          </div>

          <div className="user-details">
            <h3 className="user-name">
              {chatStore.selectedUser
                ? chatStore.selectedUser.name
                : "Выберите пользователя"}
            </h3>
          </div>
        </div>

        <button onClick={handleSetSelectedUser}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default observer(ChatHeader);
