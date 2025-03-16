import $api from "../http/axios";

export const ChatService = {
  async getUsers() {
    const res = await $api.get("/chats/users");
    return res.data;
  },

  async getMessages(userId) {
    const res = await $api.get(`/chats/${userId}`);
    console.log(res.data);
    return res.data;
  },

  async sendMessage(userId, messageData) {
    try {
        const res = await $api.post(`/chats/send/${userId}`, messageData);
        return res.data;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error; // или обработайте ошибку как нужно
    }
}
};