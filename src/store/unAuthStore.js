import { makeAutoObservable, runInAction } from "mobx";
import UnAuthService from "../services/UnAuthService";
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
      console.log("Loading set to:", this.isLoading);
    });
  }
  setCars(cars) {
    runInAction(() => {
      // Преобразуем в массив, если это объект
      this.cars = Array.isArray(cars) ? cars : Object.values(cars);
      console.log("cars set to:", this.cars);
    });
  }

  setSettings(settings) {
    runInAction(() => {
      this.settings = {
        notificationRequest: settings.notificationRequest || false,
        notificationTO: settings.notificationTO || false,
        notificationNewRequests: settings.notificationNewRequests || false,
      };
      console.log("Settings set to:", this.settings);
    });
  }

  async fetchCarsUnAuth() {
    try {
      console.log("fetchCarsUnAuth");
      const response = await UnAuthService.fetchCarsUnAuth();
      console.log("response", response);
      this.setCars(response.data);
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }


}


