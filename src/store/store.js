import { makeAutoObservable, runInAction } from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import { API_URL } from "../http/axios";

export default class Store {
  user = {};
  isAuth = false;
  isLoading = false;

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
}
