import $api from "../http/axios";
import { error, log } from "../utils/logger";

export const ChatService = {
  async getUsers() {
    const res = await $api.get("/chats/getChats");
    return res.data;
  },

  async getMessages(userId) {
    const res = await $api.get(`/chats/${userId}`);
    log(res.data);
    return res.data;
  },

  async sendMessage(userId, messageData) {
    try {
        const res = await $api.post(`/chats/send/${userId}`, messageData);
        return res.data;
    } catch (e) {
        error
        ("Error sending message:", e);
        throw e; // или обработайте ошибку как нужно
    }
}
};