import React from 'react'
import './Chat.css';  // Стили для улучшения вида
import { FaRegCheckCircle } from "react-icons/fa";
import MessageInput from './MessageInput';
import { chatStore } from '../..';

export default function ChatBotWindow() {
  return (
    <div className="chatbot-window">
      <div className="chatbot-content">
        <img 
          src="/img/ai-assist.png" 
          alt="AI Assistant" 
          className="chatbot-image"
        />
        <div className="chatbot-text">
          <h2>Знакомьтесь с нашим нейро - ассистентом</h2>
          <p>
            Наш чат-бот — это не просто поддержка. Это интеллектуальный помощник, который делает взаимодействие проще и эффективнее.
          </p>
          <ul>
            <li style={{display:'flex' , alignItems:'center' , gap:10}}><FaRegCheckCircle size={25} color='blue' />  Быстрая и точная помощь 24/7</li>
            <li style={{display:'flex' , alignItems:'center' , gap:10}}><FaRegCheckCircle size={25} color='blue' />  Гибкость в общении и решении проблем</li>
             <li style={{display:'flex' , alignItems:'center' , gap:10}}><FaRegCheckCircle size={25} color='blue' /> Защита данных и безопасность общения</li>
            <li style={{display:'flex' , alignItems:'center' , gap:10}}><FaRegCheckCircle size={25} color='blue' />  Повышение удобства и качества обслуживания</li>
          </ul>
                <MessageInput isAtBottom={false} isAi={chatStore.selectedUser.isChatBot} />
          
        </div>
      </div>
    </div>
  );
}