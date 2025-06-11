import { makeAutoObservable, runInAction } from "mobx";
import UnAuthService from "../services/UnAuthService";
import { error, log } from "../utils/logger";
import { showToast } from "../services/toastService";
export default class Store {
  cars = {};
  isLoading = false;
  settings = {};

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(bool) {
    runInAction(() => {
      this.isLoading = bool;
      log("Loading set to:", this.isLoading);
    });
  }
  setCars(cars) {
    runInAction(() => {
      // Преобразуем в массив, если это объект
      this.cars = Array.isArray(cars) ? cars : Object.values(cars);
      log("cars set to:", this.cars);
    });
  }

  setSettings(settings) {
    runInAction(() => {
      this.settings = {
        notificationRequest: settings.notificationRequest || false,
        notificationTO: settings.notificationTO || false,
        notificationNewRequests: settings.notificationNewRequests || false,
      };
      log("Settings set to:", this.settings);
    });
  }

  async fetchCarsUnAuth() {
    try {
      log("fetchCarsUnAuth");
      const response = await UnAuthService.fetchCarsUnAuth();
      log("response", response);
      this.setCars(response.data);
    } catch (e) {
      error(e.response?.data?.message);
      showToast({ text1: "Произошла ошибка", type: "error" });
    }
  }
}
