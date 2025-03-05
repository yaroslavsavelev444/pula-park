import React, { useContext, useEffect } from 'react';
import { Context } from '..';
import ChatContainer from '../components/Chat/ChatContainer';
import NoChatSelected from '../components/Chat/NoChatSelected';
import Sidebar from '../components/Chat/Sidebar';
import '../components/Chat/Chat.css';
import { observer } from 'mobx-react-lite';

export default observer(function Chats() {
  const { chatStore } = useContext(Context);
    const { selectedUser } = chatStore;

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
})
    