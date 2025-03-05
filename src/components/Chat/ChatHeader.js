import { X } from "lucide-react";
import "./ChatContainer.css"; // Подключение CSS-файла
import { Context } from "../..";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

const ChatHeader = () => {
    const {store , chatStore} = useContext(Context);
    const { selectedUser, setSelectedUser, onlineUsers } = chatStore;
  return (
    <div className="chat-header">
      <div className="header-content">
        <div className="user-info-chat">
          {/* Avatar */}
          <div className="avatar">
            <div className="avatar-size">
              <img src={selectedUser.avatarUrl || "/avatar.png"} alt={selectedUser.name} />
            </div>
          </div>

          {/* User info */}
          <div className="user-details">
            <h3 className="user-name">{selectedUser.name}</h3>
            <p className="user-status">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default observer(ChatHeader);