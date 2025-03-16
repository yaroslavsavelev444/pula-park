import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import "./ChatContainer.css";
import { Context } from "../..";
import { formatMessageTime } from "../../utils/formatMessageTime";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { observer } from "mobx-react-lite";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const ChatContainer = () => {
  const { store, chatStore } = useContext(Context);
  const messagesRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [lastMessageDate, setLastMessageDate] = useState(null);

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  useEffect(() => {
    chatStore.getMessages(chatStore.selectedUser?._id);
    chatStore.connectSocket();
    chatStore.subscribeToMessages();

    return () => {
      chatStore.unsubscribeFromMessages();
      chatStore.disconnectSocket();
    };
  }, [chatStore.selectedUser]);

  const handleScroll = () => {
    if (messagesRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
      const threshold = 100;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - threshold);
    }
  };

  useLayoutEffect(() => {
    if (messagesRef.current && isAtBottom) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chatStore.messages, isAtBottom]);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      setIsAtBottom(true);
    }
  };

  // Функция для форматирования даты
  const formatMessageDate = (date) => {
    const messageDate = new Date(date);
    const messageDay = messageDate.getDate();
    const messageMonth = monthNames[messageDate.getMonth()]; // Месяц в словесном формате
    const messageYear = messageDate.getFullYear();

    return `${messageDay} ${messageMonth}`;
  };

  useEffect(() => {
    // Проверяем дату последнего сообщения при каждом обновлении списка сообщений
    if (chatStore.messages.length > 0) {
      const lastMessage = chatStore.messages[chatStore.messages.length - 1];
      const messageDate = formatMessageDate(lastMessage?.createdAt);

      if (messageDate !== lastMessageDate) {
        setLastMessageDate(messageDate);
      }
    }
  }, [chatStore.messages, lastMessageDate]);

  if (chatStore.isMessagesLoading) {
    return (
      <div className="chat-container">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  // Группируем сообщения по дате
  const groupedMessages = chatStore.messages.reduce((acc, message) => {
    const messageDate = formatMessageDate(message.createdAt);
    if (!acc[messageDate]) {
      acc[messageDate] = [];
    }
    acc[messageDate].push(message);
    return acc;
  }, {});

  return (
    <div className="chat-container">
      <ChatHeader />
      <PhotoProvider>
        <div
          ref={messagesRef}
          onScroll={handleScroll}
          className="messages-list"
        >
          {Object.keys(groupedMessages).map((date, index) => (
            <div key={date}>
              {/* Показываем дату только один раз для группы сообщений */}
              <div className="message-date">
                <span>{date}</span>
              </div>
              <div  className="messages-list">
              {groupedMessages[date].map((message) => (
                <div
                  key={message._id}
                  className={`chat ${
                    message.senderId === store.user?.id ? "chat-end" : "chat-start"
                  }`}
                >
                  {message.senderId === store.user?.id && (
                    <div className="message-time-container">
                      <time className="message-time">
                        {formatMessageTime(message.createdAt)}
                      </time>
                    </div>
                  )}

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

                  {message.senderId !== store.user?.id && (
                    <div className="message-time-container">
                      <time className="message-time">
                        {formatMessageTime(message.createdAt)}
                      </time>
                    </div>
                  )}
                </div>
              ))}
              </div>
            </div>
          ))}
        </div>
      </PhotoProvider>

      <MessageInput onClick={scrollToBottom} isAtBottom={isAtBottom} />
    </div>
  );
};

export default observer(ChatContainer);