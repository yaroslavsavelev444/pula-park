import React, { useContext, useEffect } from 'react';
import { Context } from '..';
import ChatContainer from '../components/Chat/ChatContainer';
import NoChatSelected from '../components/Chat/NoChatSelected';
import Sidebar from '../components/Chat/Sidebar';
import '../components/Chat/Chat.css';
import { observer } from 'mobx-react-lite';
import { useLocation, useParams } from 'react-router-dom';

const Chats = () => {
  const { chatStore } = useContext(Context);
  const { selectedUser, users } = chatStore;
    const {userId} = useParams();
    const location = useLocation();
      const userFromUserPage = location.state?.user; 
      console.log('userFromUserPage', userFromUserPage);

    useEffect(() => {
      // Загружаем пользователей, если их нет
      if (!users.length) {
        chatStore.getUsers();
      }
    }, []);

    useEffect(() => {
      if (userId) {
        const user = users.find((u) => u._id === userId);
        if (user && user._id !== selectedUser?._id) {
          chatStore.setSelectedUser(user);
        }
        else{
          chatStore.setSelectedUser({ _id: userId , name : userFromUserPage.name, rating : userFromUserPage.rating, avatar : userFromUserPage.avatar});
        }
      }
    }, [userId, users]);


    return (
      <div className="chat-container">
        <div className="chat-wrapper">
          <div className="chat-box">
            <div className="chat-content">
              <Sidebar />
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    );
}

export default observer(Chats);
    