import React, { useState } from "react";
import { formatMessageTime } from "../../utils/formatMessageTime";
import { PhotoView } from "react-photo-view";
import { ContextMenuTrigger, ContextMenu, MenuItem } from "react-contextmenu";
import './Chat.css';
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";
import { showToast } from "../../services/toastService";
import { log } from "../../utils/logger";

export default function MessageItem({ message, store, openModalReport, disableContextMenu }) {
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Обработчик для кликов по пунктам контекстного меню
  const handleItemClick = (e, data) => {
    const { action } = data;
    switch (action) {
      case "copy":
        showToast({
          text1: "Сообщение скопировано.",
          type: "success",
        });
        break;
      case "report":
        // Открываем модальное окно только для сообщений собеседника
        openModalReport(selectedMessage);
        break;
      default:
        log("Неизвестная команда:", action);
    }
  };

  return (
    <div>
      {/* Контекстное меню для каждого сообщения, только если не отключено */}
      {!disableContextMenu && (
        <ContextMenuTrigger id={`context-menu-${message._id}`} collect={() => setSelectedMessage(message)}>
          <div
            key={message._id}
            className={`chat ${message.senderId === store.user?.id ? "chat-end" : "chat-start"}`}
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
                    <img src={message.image} className="message-image" alt="Sent" />
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
        </ContextMenuTrigger>
      )}

      {/* Если контекстное меню не отключено, то оно будет показываться */}
      {!disableContextMenu && (
        <ContextMenu id={`context-menu-${message._id}`}>
          <div className="context-menu-header">
            {message.image ? (
              <img src={message.image} alt="Message thumbnail" className="context-menu-thumbnail" />
            ) : (
              <div className="context-menu-thumbnail-placeholder">📄</div>
            )}
            <span className="context-menu-message-text">{message.text ? message.text.slice(0, 20) : "Без текста"}</span>
          </div>
          <MenuItem data={{ action: "copy" }} onClick={handleItemClick}>
          <div className="actions-context-menu">
            <MdContentCopy size={20} style={{ marginRight: "5px" }} />
            <p>Скопировать</p>
          </div>
          </MenuItem>
          {message.senderId !== store.user?.id && (
            <MenuItem data={{ action: "report" }} onClick={handleItemClick}>
              <div className="actions-context-menu">
                <MdOutlineReportGmailerrorred size={20} style={{ marginRight: "5px" }} /> 
                <p>Пожаловаться</p>
              </div>
            </MenuItem>
          )}
        </ContextMenu>
      )}

      {/* Если контекстное меню отключено, просто отображаем сообщение без всех элементов */}
      {disableContextMenu && (
        <div
          key={message._id}
          className={`chat ${message.senderId === store.user?.id ? "chat-end" : "chat-start"}`}
        >
          {(message.image || message.text) && (
            <div className="chat-bubble">
              {message.image && (
                <PhotoView src={message.image}>
                  <img src={message.image} className="message-image" alt="Sent" />
                </PhotoView>
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}