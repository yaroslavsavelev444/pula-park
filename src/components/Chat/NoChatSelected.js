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

        <h2>Welcome to Chatty!</h2>
        <p>Select a conversation from the sidebar to start chatting</p>
      </div>
    </div>
  );
};

export default NoChatSelected;