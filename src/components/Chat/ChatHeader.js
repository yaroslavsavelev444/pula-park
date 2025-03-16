import { X } from "lucide-react";
import "./ChatContainer.css"; // Подключение CSS-файла
import { Context } from "../..";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import UserProfileLight from "../Profile/UserProfileLight";

const ChatHeader = () => {
  const { chatStore } = useContext(Context);

  const handleSetSelectedUser = () => {
    chatStore.setSelectedUser(null);
  };

  return (
    <div className="chat-header">
      <div className="header-content">
        <div className="user-profile-wrapper">
          <UserProfileLight user={chatStore.selectedUser} />
        </div>
        <button onClick={handleSetSelectedUser}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default observer(ChatHeader);
