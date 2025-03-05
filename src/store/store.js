import { makeAutoObservable, runInAction, set } from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import { API_URL } from "../http/axios";

export default class Store {
  user = {};
  isAuth = false;
  isLoading = false;
  settings = {};

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool) {
    runInAction(() => {
      this.isAuth = bool;
      console.log("Auth set to:", this.isAuth);
    });
  }

  setUser(user) {
    runInAction(() => {
      this.user = user;
      console.log("User set to:", this.user);
    });
  }

  setLoading(bool) {
    runInAction(() => {
      this.isLoading = bool;
      console.log("Loading set to:", this.isLoading);
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
      console.log("Settings set to:", this.settings);
    });
  }

  async login(email, password) {
    try {
      console.log("login", email, password);
      const response = await AuthService.login(email, password);
      console.log("response", response);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async registration(email, password, phone, name, surname, role, type, key) {
    try {
      const response = await AuthService.registration(
        email,
        password,
        phone,
        name,
        surname,
        role,
        type,
        key
      );
      console.log("response", response);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      this.setAuth(false);
      this.setUser({});
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/auth/refresh`, {
        withCredentials: true,
        headers: { "X-Refresh-Flag": "true" },
      });
      console.log("checkAuthRes", response.data.user);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      console.log(e.response?.data?.message);
    } finally {
      this.setLoading(false);
    }
  }

 async resendVerificationEmail(email) {
    try {
        await AuthService.resendActivation(email);
        console.log('Email sent successfully');
        this.checkAuth();
    } catch (e) {
        console.log(e.response?.data?.message);
        throw e;
    }
 }

 async changePassword(oldPassword, newPassword, userId, showToast) {
  try {
    console.log('changePassword', oldPassword, "newPassword",  newPassword, "userId", userId);
    const res = await AuthService.changePassword(oldPassword, newPassword, userId);

    if (res.status === 200) {
      this.logout();
      showToast({
        text1: "Пароль успешно изменен",
        type: "success",
      });
      console.log('Password changed successfully');
    }
  } catch (e) {
    // Обработка ошибок от сервера
    const errorMessage = e.response?.data?.message || "Неизвестная ошибка";
    showToast({
      text1: errorMessage,
      type: "error",
    });
    console.log("Error:", errorMessage);
    throw e;
  }
}
async forgotPassword(email, showToast) {
  try {
    console.log('forgotPassword', email);
    const res = await AuthService.forgotPassword(email);
    console.log(res);
    if (res.status === 200) {
      showToast({
        text1: "Письмо отправлено",
        type: "success",
      });
      console.log('Email sent successfully');
    }
  } catch (e) {
    showToast({
      text1: e.response?.data?.message || "Неизвестная ошибка",
      type: "error",
    })
    const errorMessage = e.response?.data?.message || "Неизвестная ошибка";
    console.log("Error:", errorMessage);
    throw e;
  } 
  
}

async resetForgottenPassword(token, newPassword) {
  try {
    const res = await AuthService.resetForgottenPasswod(token, newPassword);
    console.log(res);
    if (res.status === 200) {
      console.log('Password changed successfully');
    }
  } catch (e) {
    const errorMessage = e.response?.data?.message || "Неизвестная ошибка";
    console.log("Error:", errorMessage);
    throw e;
  }

}

async updateSetting(key, value) {
  try {
    const res = await AuthService.updateSetting(key, value);
    console.log(res);
    if (res.status === 200) {
      console.log('Setting changed successfully');
    }
  } catch (e) {
    const errorMessage = e.response?.data?.message || "Неизвестная ошибка";
    console.log("Error:", errorMessage);
    throw e;
  }
}

async fetchSettings() {
  try {
    const response = await AuthService.fetchSettings();
    console.log('response', response);
    this.setSettings(response.data);
    if (response.status === 200) {
      console.log('Settings fetched successfully');
    }
  } catch (e) {
    const errorMessage = e.response?.data?.message || "Неизвестная ошибка";
    console.log("Error:", errorMessage);
    throw e;
  }

}
}


