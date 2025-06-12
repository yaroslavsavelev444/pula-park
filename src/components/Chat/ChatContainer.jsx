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
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { observer } from "mobx-react-lite";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import MessageItem from "./MessageItem";
import Modal from "../UI/Modal/Modal";
import Button from "../UI/Buttons/Button";
import SelectMenu from "../UI/SelectMenu/SelectMenu";
import Input from "../UI/Input/Input";
import { chatOptions } from "../constants/options";
import { log } from "../../utils/logger";

const ChatContainer = () => {
  const { store, chatStore } = useContext(Context);
  const messagesRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [lastMessageDate, setLastMessageDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [reportReason, setReportReason] = useState(false);

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

  const handleSendReportToMessage = (messageId, reason) => {
    log(messageId, reason);
    if(!messageId || !reason) {
      log("Ошибка: messageId или reason не определены");
      return;
    }
    
    chatStore.reportToMessage(messageId, reason);
  }

  const openModalReport = (message) => {
    setModalContent({ type: "openModalReport", message });
    setIsModalOpen(true);
  };
  if (chatStore.isMessagesLoading) {
    return (
      <div className="chat-container">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const groupedMessages = chatStore.messages.reduce((acc, message) => {
    const messageDate = formatMessageDate(message.createdAt);
    if (!acc[messageDate]) {
      acc[messageDate] = [];
    }
    acc[messageDate].push(message);
    return acc;
  }, {});

  return (
    <>
    
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
                <MessageItem message={message} store={store} openModalReport={openModalReport} />
              ))}
              </div>
            </div>
          ))}
        </div>
      </PhotoProvider>

      <MessageInput onClick={scrollToBottom} isAtBottom={isAtBottom} isAi={chatStore.selectedUser.isChatBot} />
    </div>
     <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
     {modalContent?.type === "openModalReport" && (
       <>
         <h1>Жалоба</h1>
         <div className="modal-report">
        <div className="report-message-wrapper">
          <MessageItem message={modalContent.message} store={store}  openModalReport={openModalReport}   disableContextMenu={true} />
         </div>
         
         <SelectMenu
           placeholder="Выберите причину"
        options={chatOptions}
          onSelect={(value) => {
            seMenuSelectVisible(false);
            log(value);
          }}
          onClose={() => {
            log("closed");
          }}
          onChange={(value) => {
            setReportReason(value);
            log(value);
          }}
        />

        {reportReason === 'other' && (
          <div>
            <Input
              type="text"
              placeholder="Причина"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
          </div>
        )}

         <Button
          onClick={() => {
            handleSendReportToMessage(modalContent.message._id, reportReason);
            setIsModalOpen(false);
          }}
         >
           Отправить
         </Button>
         </div>
       </>
     )}

   </Modal>

   </>
    
  );
};

export default observer(ChatContainer);