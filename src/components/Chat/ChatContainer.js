import { useContext, useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

import "./ChatContainer.css"; // Подключение CSS-файла
import { Context } from "../..";
import { formatMessageTime } from "../../utils/fornatMessageTime";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { observer } from "mobx-react-lite";
const ChatContainer = () => {
  const { store, chatStore } = useContext(Context);
  const messageEndRef = useRef(null);

  useEffect(() => {
    chatStore.getMessages(chatStore.selectedUser._id);
    // subscribeToMessages();

    // return () => unsubscribeFromMessages();
  }, [chatStore.selectedUser._id, chatStore.getMessages, chatStore.subscribeToMessages, chatStore.unsubscribeFromMessages]);

  // useEffect(() => {
  //   if (messageEndRef.current && chatStore.messages) {
  //     messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [chatStore.messages]);

  if (!chatStore.messages || chatStore.messages.length === 0) {
    return (
      <div className="chat-container">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  console.log(store.user.id);
  return (
    <div className="chat-container">
      <ChatHeader />

      <div className="messages-list">
        {chatStore.messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === store.user.id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="avatar-wrapper">
                <img
                  src={
                    message.senderId === store.user.id
                      ? store.user.avatarUrl || "/avatar.png"
                      : chatStore.selectedUser.avatarUrl || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header">
              <time className="message-time">{formatMessageTime(message.createdAt)}</time>
            </div>
            <div className="chat-bubble">
              {message.image && <img src={message.image} alt="Attachment" className="message-image" />}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default observer(ChatContainer);