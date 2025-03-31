import React, { useContext, useEffect, useState } from "react";
import { companyStore, Context } from "..";
import ChatContainer from "../components/Chat/ChatContainer";
import NoChatSelected from "../components/Chat/NoChatSelected";
import Sidebar from "../components/Chat/Sidebar";
import "../components/Chat/Chat.css";
import { observer } from "mobx-react-lite";
import { useLocation, useParams } from "react-router-dom";
import UserBlocked from "../components/Chat/UserBlocked";

const Chats = () => {
  const { chatStore } = useContext(Context);
  const { selectedUser, users } = chatStore;
  const { userId } = useParams();
  const location = useLocation();
  const userFromUserPage = location.state?.user;

  // Локальное состояние, чтобы избежать повторных запросов
  const [usersLoaded, setUsersLoaded] = useState(false);

  useEffect(() => {
    if (!users.length && !usersLoaded) {
      chatStore.getUsers().then(() => setUsersLoaded(true));
    }
  }, [chatStore, users.length, usersLoaded]);

  useEffect(() => {
    if (userId && !selectedUser) {
      const user = users.find((u) => u._id === userId);
      if (user) {
        chatStore.setSelectedUser(user);
      } else if (userFromUserPage) {
        chatStore.setSelectedUser({
          _id: userId,
          name: userFromUserPage.name,
          rating: userFromUserPage.rating,
          avatar: userFromUserPage.avatar,
        });
      }
    }
  }, [userId, users, selectedUser, userFromUserPage, chatStore]);

  // Проверяем, заблокирован ли пользователь
  const isBlocked =
    Array.isArray(companyStore?.blockedUsers) &&
    selectedUser?._id &&
    companyStore?.blockedUsers.includes(selectedUser._id);

  return (
    <div className="chat-container">
      <div className="chat-wrapper">
        <div className="chat-box">
          <div className="chat-content">
            <Sidebar />
            {!selectedUser ? (
              <NoChatSelected />
            ) : isBlocked ? (
              <UserBlocked userId={selectedUser._id} />
            ) : (
              <ChatContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(Chats);
