import { makeAutoObservable, runInAction, set } from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import { API_URL } from "../http/axios";
import { showToast } from "../services/toastService";
import { error, log } from "../utils/logger";

export default class Store {
  user = {};
  isAuth = false;
  isLoading = false;
  settings = {};
  pendingUserId = null;
  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool) {
    runInAction(() => {
      this.isAuth = bool;
      log("Auth set to:", this.isAuth);
    });
  }

  setUser(user) {
    runInAction(() => {
      this.user = user;
      log("User set to:", this.user);
    });
  }
  setPendingUserId(userId) {
    runInAction(() => {
      this.pendingUserId = userId;
      log("PendingUserId set to:", this.pendingUserId);
    });
  }

  setLoading(bool) {
    runInAction(() => {
      this.isLoading = bool;
      log("Loading set to:", this.isLoading);
    });
  }
  setSettings(settings) {
    runInAction(() => {
      // Устанавливаем настройки с фиксированными полями
      this.settings = {
        notificationRequest: settings.notificationRequest || false,
        notificationTO: settings.notificationTO || false,
        notificationNewRequests: settings.notificationNewRequests || false,
      };
      log("Settings set to:", this.settings);
    });
  }

  async checkEmailExists(email) {
    try {
      const res = await AuthService.checkEmailExists(email);
      log("checkEmailExists", res.data);
      return res.data.exists; // true / false
    } catch (e) {
      error("Ошибка проверки email:", e);
      showToast({ text1: e?.message, type: "error" });
      return false;
    }
  }

  async login(email, password) {
    try {
      const response = await AuthService.login(email, password);

      if (response?.data?.userData.userId) {
        this.setPendingUserId(response?.data?.userData.userId);
      }
      
      return response;
    } catch (e) {
      error(e);
      showToast({ text1: e?.message, type: "error" });
      throw new Error(e);
    }
  }

  async registration(email, password, phone, name, surname, role, type) {
  try {
    const response = await AuthService.registration(email, password, phone, name, surname, role, type);
    const userId = response?.data?.userId;
    if (userId) {
      this.setPendingUserId(userId);
    } else {
      throw new Error("ID пользователя не получен");
    }
    return response;
  } catch (e) {
    error(e.response?.data?.message || e.message);
    showToast({ text1: e.response?.data?.message || "Ошибка регистрации", type: "error" });
    throw e;
  }
}

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      this.setAuth(false);
      this.setUser({});
      showToast({ text1: "Вы вышли из аккаунта", type: "success" });
    } catch (e) {
      error(e.response?.data?.message);
      showToast({ text1: e?.message, type: "error" });
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/auth/refresh`, {
        withCredentials: true,
        headers: { "X-Refresh-Flag": "true" },
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.accessToken);
        this.setAuth(true);
        this.setUser(response.data.user);
        return;
      }
      if (response.status === 401) {
        this.logout();
        return;
      }
    } catch (e) {
      error(e.response?.data?.message);
    } finally {
      this.setLoading(false);
    }
  }

  async changePassword(oldPassword, newPassword, userId) {
    try {
      const res = await AuthService.changePassword(
        oldPassword,
        newPassword,
        userId
      );

      if (res.status === 200) {
        this.logout();
        showToast({
          text1: "Пароль успешно изменен",
          type: "success",
        });
      }
    } catch (e) {
      showToast({
        text1: e.response?.data?.message,
        type: "error",
      });
      error("Error:", errorMessage);
      throw e;
    }
  }
  async forgotPassword(email) {
    try {
      const res = await AuthService.forgotPassword(email);

      if (res.status === 200) {
        showToast({
          text1: "Письмо отправлено",
          type: "success",
        });
      }
    } catch (e) {
      showToast({
        text1: e.response?.data?.message || "Неизвестная ошибка",
        type: "error",
      });
      error("Error:", e.response?.data?.message);
      throw e;
    }
  }

  async verifyEmailCode(code) {
  try {
    this.setLoading(true);
    if(!this.pendingUserId){
      throw new Error("Пользователь не найден");
    }
    const res = await AuthService.verifyEmailCode(this.pendingUserId, code);
    log("verifyEmailCode", res);
    if(res.status === 200){
      localStorage.setItem("token", res.data.userData.accessToken);
      this.setAuth(true);
      this.setUser(res.data.userData.user);
    }
    return res;
  } catch (e) {
    showToast({
      text1: e.message || "Неизвестная ошибка",
      type: "error",
    })
    error("Error:", e?.message);
    throw e;
  }
  finally{
    this.setLoading(false);
  }
}

async verifyPhoneCode(code) {
  try {
    this.setLoading(true);
    if(!this.pendingUserId){
      throw new Error("Пользователь не найден");
    }
    return await AuthService.verifyPhoneCode(this.pendingUserId, code);
  } catch (e) {
    showToast({
      text1: e?.message || "Неизвестная ошибка",
      type: "error",
    })
    error(e?.message)
    throw e;
  }
  finally{
    this.setLoading(false);
  }
}

 async resendEmailCode() {
    try {
      if(!this.pendingUserId){
        throw new Error("Пользователь не найден");
      }
      const userId = this.pendingUserId;
      const response = await AuthService.resendEmailCode(this.pendingUserId);
      if (response.status === 200) {
        showToast({
          text1: "Код успешно отправлен",
          type: "success",
        });
      }
    } catch (e) {
      showToast({
        text1: e.response?.data?.message || "Неизвестная ошибка",
        type: "error",
      })
      error(e);
      throw e;
    }
  }

    async resendPhoneCode() {
    try {
      if(!this.pendingUserId){
        throw new Error("Пользователь не найден");
      }
      const response = await AuthService.resendPhoneCode(this.pendingUserId);
      return response;
    } catch (e) {
      showToast({
        text1: error.response?.data?.message || "Неизвестная ошибка",
        type: "error",
      })
      error(e);
      throw e;
    }
  }

  async resetForgottenPassword(token, newPassword) {
    try {
      const res = await AuthService.resetForgottenPasswod(token, newPassword);

      if (res.status === 200) {
        showToast({
          text1: "Пароль успешно изменен",
          type: "success",
        });
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || "Неизвестная ошибка";
      showToast({
        text1: errorMessage,
        type: "error",
      });
      error("Error:", errorMessage);
      throw e;
    }
  }

  async updateSetting(key, value) {
    try {
      const res = await AuthService.updateSetting(key, value);
      if (res.status === 200) {
        showToast({
          text1: "Настройки успешно обновлены",
          type: "success",
        });
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || "Неизвестная ошибка";
      error("Error:", errorMessage);
      showToast({
        text1: errorMessage,
        type: "error",
      });
      throw e;
    }
  }

  async fetchSettings() {
    try {
      const response = await AuthService.fetchSettings();

      this.setSettings(response.data);
      if (response.status === 200) {
        showToast({
          text1: "Настройки успешно загружены",
          type: "success",
        });
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || "Неизвестная ошибка";
      error("Error:", errorMessage);
      showToast({
        text1: errorMessage,
        type: "error",
      });
      throw e;
    }
  }
}
