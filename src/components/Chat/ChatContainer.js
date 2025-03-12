import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import "./ChatContainer.css"; 
import { Context } from "../..";
import { formatMessageTime } from "../../utils/formatMessageTime";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { observer } from "mobx-react-lite";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css"

const ChatContainer = () => {
  const { store, chatStore } = useContext(Context);
  const messagesRef = useRef(null); // Реф на контейнер сообщений

  useEffect(() => {
    // Подключаем сокет при монтировании компонента
    chatStore.getMessages(chatStore.selectedUser?._id);
    chatStore.connectSocket();
    chatStore.subscribeToMessages();

    // Отключаем сокет и отписываемся от событий при размонтировании компонента
    return () => {
      chatStore.unsubscribeFromMessages();
      chatStore.disconnectSocket();
    };
  }, [chatStore.selectedUser]); // Следим за выбранным пользователем, если нужно
  // Скролл в самый низ перед первым рендером
  useLayoutEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chatStore.messages]); // Завязываемся на сообщения

  if (chatStore.isMessagesLoading) {
    return (
      <div className="chat-container">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="chat-container">
      <ChatHeader />
      <PhotoProvider>
        <div ref={messagesRef} className="messages-list">
          {chatStore.messages?.map((message) => (
            <div
              key={message._id}
              className={`chat ${
                message.senderId === store.user?.id ? "chat-end" : "chat-start"
              }`}
            >
              <div>
                <time className="message-time">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              {(message.image || message.text) && (
                <div className="chat-bubble">
                  {message.image && (
                    <PhotoView src={message.image}>
                      <img
                        src={message.image}
                        className="message-image"
                        alt="Sent"
                      />
                    </PhotoView>
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </PhotoProvider>
      <MessageInput />
    </div>
  );
};

export default observer(ChatContainer);
