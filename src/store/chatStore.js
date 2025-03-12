import { makeAutoObservable, runInAction } from "mobx";
import { ChatService } from "../services/ChatService";
import $api, { API_URL } from "../http/axios";
import { io } from "socket.io-client";
import { store } from "..";
export default class ChatStore {
  messages = [];
  users = [];
  selectedUser = null;
  isUsersLoading = false;
  isMessagesLoading = false;
  onlineUsers = [];
  socket = null;

  constructor() {
    makeAutoObservable(this);
  }

  setisMessagesLoading(bool) {
    runInAction(() => {
      this.isMessagesLoading = bool;
      console.log("isMessagesLoading set to:", this.isMessagesLoading);
    });
  }

  setisUsersLoading(bool) {
    runInAction(() => {
      this.isUsersLoading = bool;
      console.log("isUsersLoading set to:", this.isUsersLoading);
    });
  }

  setSelectedUser(user) {
    runInAction(() => {
      this.selectedUser = user;
      console.log("Selected user set to:", this.selectedUser);
    });
  }

  setMessages(messages) {
    runInAction(() => {
      this.messages = messages;
      console.log("Messages set to:", this.messages);
    });
  }


  async getUsers(showToast) {
    this.isUsersLoading = true;
    try {
      const users = await ChatService.getUsers();
      this.users = users;
      console.log(JSON.stringify(this.users));
    } catch (error) {
      console.log(error.response?.data?.message || "Ошибка загрузки пользователей");
    } finally {
      this.isUsersLoading = false;
    }
  }

  async getMessages(userId) {
    try {
      const res = await $api.get(`/chats/${userId}`);
      console.log("Полученные сообщения:", res.data);
      if (this.setMessages) {
        this.setMessages(res.data);
      } else {
        console.error("setMessages не найден в chatStore");
      }
    } catch (error) {
      console.error("Ошибка при получении сообщений:", error);
    } 
  }

  async sendMessage(messageData , selectedUser) {
    if (!selectedUser) return;
    try {
      const newMessage = await ChatService.sendMessage(selectedUser._id, messageData);
      this.messages.push(newMessage);
    } catch (error) {
        console.log(error.response?.data?.message || "Ошибка отправки сообщения");
    }
  }

  subscribeToMessages() {
    if (!this.selectedUser) {
      console.log("Ошибка: selectedUser не определён при подписке");
      return;
    }
  
    if (!this.socket) {
      console.log("Ошибка: socket не инициализирован при подписке");
      return;
    }
  
    this.socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId === this.selectedUser?._id) {
        runInAction(() => {
          this.messages.push(newMessage);
        });
      }
    });
  }

  unsubscribeFromMessages() {
    if (!this.socket) {
      console.log("Ошибка: socket не инициализирован при отписке");
      return;
    }
    this.socket.off("newMessage");
  }

  connectSocket() {
    const user = store.user;
    if (!user || this.socket?.connected) return;
  
    this.socket = io(API_URL, {
      query: { userId: user.id },
    });
    this.socket.connect();
    console.log("Socket connecnet");
    this.socket.on("getOnlineUsers", (userIds) => {
      this.onlineUsers = userIds;
    });
  }
  
  disconnectSocket() {
    console.log("Socket disconnected");
    if (this.socket?.connected) this.socket.disconnect();
  }

}
