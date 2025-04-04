import { makeAutoObservable, observable, runInAction, toJS } from "mobx";
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
  hasBotChat = null;
  botId = null;

  constructor() {
    makeAutoObservable(this, { messages: observable });
    this.sendMessage = this.sendMessage.bind(this);
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
    console.log("getUsers");
    this.isUsersLoading = true;
    try {
      const users = await ChatService.getUsers();
      console.log(users);
      this.users = users.users;
      this.hasBotChat = users.hasBotChat;
      this.botId = users.botId;
      console.log('this.users', JSON.stringify(this.users));
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



  async reportToMessage (messageId, reason , showToast) {
    try {
      if(!messageId || !reason) {
        console.log("Ошибка: messageId или reason не определены");
        return;
      }
      const res = await $api.post(`/chats/report` , {messageId , reason});
      if(res.status === 200) {
        showToast({
          text1: "Сообщение отправлено администратору",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Ошибка при получении сообщений:", error);
      showToast({
        text1: error.response?.data || "Неизвестная ошибка",
        type: "error",
      })
    } 
  }

  async sendMessage(messageData, selectedUser) {
    console.log("ChatStore context in sendMessage:", this);
    if (!selectedUser) return;
    let newMessage = null;
    try {
        newMessage = await ChatService.sendMessage(selectedUser._id, messageData);
        if (!newMessage || !newMessage._id) {
            throw new Error("Сервер вернул некорректный ответ: " + JSON.stringify(newMessage));
        }
        console.log("Новое сообщение:", newMessage);
        runInAction(() => {
            console.log("newServerMessage", JSON.stringify(newMessage));
            if (this.setMessages) {
                this.setMessages([...this.messages, {
                    ...newMessage,
                    senderId: newMessage.senderId.toString(),
                    receiverId: newMessage.receiverId.toString(),
                }]);
            } else {
                console.error("Ошибка: setMessages не определена в ChatStore");
            }
        });
    } catch (error) {
        console.error("Ошибка в sendMessage:", error);
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
      console.log("newMessage", newMessage);
      if (newMessage.senderId === this.selectedUser?._id) {
        if (newMessage.senderId === this.selectedUser?._id) {
          console.log("newSOcketMessage", JSON.stringify(newMessage));
          
          runInAction(() => {
            this.messages.push({
              ...newMessage,
              senderId: newMessage.senderId.toString(),
              receiverId: newMessage.receiverId.toString(),
            });
          });
        }
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
