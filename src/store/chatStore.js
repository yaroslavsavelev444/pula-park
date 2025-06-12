import { makeAutoObservable, observable, runInAction, toJS } from "mobx";
import { ChatService } from "../services/ChatService";
import $api, { API_URL } from "../http/axios";
import { io } from "socket.io-client";
import { store } from "..";
import { showToast } from "../services/toastService";
import { error, log } from "../utils/logger";

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
      log("isMessagesLoading set to:", this.isMessagesLoading);
    });
  }

  setisUsersLoading(bool) {
    runInAction(() => {
      this.isUsersLoading = bool;
      log("isUsersLoading set to:", this.isUsersLoading);
    });
  }

  setSelectedUser(user) {
    runInAction(() => {
      this.selectedUser = user;
      log("Selected user set to:", this.selectedUser);
    });
  }

  setMessages(messages) {
    runInAction(() => {
      this.messages = messages;
      log("Messages set to:", this.messages);
    });
  }

  async getUsers() {
    this.isUsersLoading = true;
    try {
      const users = await ChatService.getUsers();
      log(users);
      this.users = users.users;
      this.hasBotChat = users.hasBotChat;
      this.botId = users.botId;
    } catch (e) {
      error(e.response?.data?.message || "Ошибка загрузки пользователей");
      showToast({ text1: "Произошла ошибка", type: "error" });
    } finally {
      this.isUsersLoading = false;
    }
  }

  async getMessages(userId) {
    try {
      const res = await $api.get(`/chats/${userId}`);
      log("Полученные сообщения:", res.data);
      if (this.setMessages) {
        this.setMessages(res.data);
      } else {
        error("setMessages не найден в chatStore");
      }
    } catch (e) {
      error("Ошибка при получении сообщений:", e);
      showToast({
        text1: e.response?.data || "Неизвестная ошибка",
        type: "error",
      })
    } 
  }



  async reportToMessage (messageId, reason) {
    try {
      if(!messageId || !reason) {
        log("Ошибка: messageId или reason не определены");
        return;
      }
      const res = await $api.post(`/chats/report` , {messageId , reason});
      if(res.status === 200) {
        showToast({
          text1: "Сообщение отправлено администратору",
          type: "success",
        });
      }
    } catch (e) {
      error("Ошибка при получении сообщений:", e);
      showToast({
        text1: e.response?.data || "Неизвестная ошибка",
        type: "error",
      })
    } 
  }

  async sendMessage(messageData, selectedUser) {
    log("ChatStore context in sendMessage:", this);
    if (!selectedUser) return;
    let newMessage = null;
    try {
        newMessage = await ChatService.sendMessage(selectedUser._id, messageData);
        if (!newMessage || !newMessage._id) {
            throw new Error("Сервер вернул некорректный ответ: " + JSON.stringify(newMessage));
        }
        log("Новое сообщение:", newMessage);
        runInAction(() => {
            log("newServerMessage", JSON.stringify(newMessage));
            if (this.setMessages) {
                this.setMessages([...this.messages, {
                    ...newMessage,
                    senderId: newMessage.senderId.toString(),
                    receiverId: newMessage.receiverId.toString(),
                }]);
            } else {
                error("Ошибка: setMessages не определена в ChatStore");
            }
        });
    } catch (e) {
        error("Ошибка в sendMessage:", e);
        showToast({ text1: "Произошла ошибка", type: "error" });
    }
}

  subscribeToMessages() {
    if (!this.selectedUser) {
      log("Ошибка: selectedUser не определён при подписке");
      return;
    }
  
    if (!this.socket) {
      log("Ошибка: socket не инициализирован при подписке");
      return;
    }
  
    this.socket.on("newMessage", (newMessage) => {
      log("newMessage", newMessage);
      if (newMessage.senderId === this.selectedUser?._id) {
        if (newMessage.senderId === this.selectedUser?._id) {
          log("newSOcketMessage", JSON.stringify(newMessage));
          
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
      log("Ошибка: socket не инициализирован при отписке");
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
    log("Socket connecnet");
    this.socket.on("getOnlineUsers", (userIds) => {
      this.onlineUsers = userIds;
    });
  }
  
  disconnectSocket() {
    log("Socket disconnected");
    if (this.socket?.connected) this.socket.disconnect();
  }

}
