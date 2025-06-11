import { makeAutoObservable, runInAction } from "mobx";
import CompanyService from "../services/CompanyService";
import $api, { API_URL } from "../http/axios";
import { store } from "..";
import { showToast } from "../services/toastService";
import { error, log } from "../utils/logger";

class CompanyStore {
  company = {};
  cars = [];
  isLoading = false;
  hasCompany = false;
  requests = [];
  rentals = [];
  userData = {};
  blockedUsers = [];
  fetchNewCars = false;
  totalCars = 0;
  totalRequests = 0;
  totalRentals = 0;

  get carsList() {
    return Array.isArray(this.cars) ? this.cars : [];
  }

  get requestsList() {
    return Object.values(this.requests || {});
  }

  get rentalsList() {
    return Object.values(this.rentals || {});
  }

  get hasActiveCompany() {
    return !!this.company && Object.keys(this.company).length > 0;
  }

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(bool) {
    runInAction(() => {
      this.isLoading = bool;
      log("Loading set to:", this.isLoading);
    });
  }

  setCompany(company) {
    runInAction(() => {
      this.company = company;
      log("Company set to:", this.company);
    });
  }

  setCars(cars) {
    runInAction(() => {
      this.cars = cars;
      log("Cars set to:", this.cars);
    });
  }
  setHasCompany(bool) {
    runInAction(() => {
      this.hasCompany = bool;
      log("HasCompany set to:", this.hasCompany);
    });
  }

  setRequests(requests) {
    runInAction(() => {
      this.requests = requests;
      log("Requests set to:", this.requests);
    });
  }
  setRentals(rentals) {
    runInAction(() => {
      this.rentals = rentals;
      log("Rentals set to:", this.rentals);
    });
  }

  setUserData(userData) {
    runInAction(() => {
      this.userData = userData;
      log("UserData set to:", this.userData);
    });
  }
  setBlockedUsers(blockedUsers) {
    runInAction(() => {
      this.blockedUsers = blockedUsers;
      log("BlockedUsers set to:", this.blockedUsers);
    });
  }

  setFetchNewCars(bool) {
    runInAction(() => {
      this.fetchNewCars = bool;
      log("fetchNewCars set to:", this.fetchNewCars);
    });
  }

  setTotalCars(totalCars) {
    runInAction(() => {
      this.totalCars = totalCars;
      log("totalCars set to:", this.totalCars);
    });
  }

  setTotalRequests(totalRequests) {
    runInAction(() => {
      this.totalRequests = totalRequests;
      log("totalRequests set to:", this.totalRequests);
    });
  }

  setTotalRentals(totalRentals) {
    runInAction(() => {
      this.totalRentals = totalRentals;
      log("totalRentals set to:", this.totalRentals);
    });
  }

  //КОМПАНИЯ

  async fetchCompanyData() {
    this.setLoading(true);
    try {
      const response = await $api.get(`${API_URL}/parks/getCompanyData`);
      log("response", response.data);
      log(response.data.error);
      if (!response.data.error) {
        log("response", response.data);
        this.setCompany(response.data.result);
        this.setBlockedUsers(response.data.blockedUsers);
        this.setHasCompany(true);
      } else {
        this.setCompany(null);
        this.setHasCompany(false);
      }
    } catch (e) {
      error("Ошибка при получении данных компании:", e);
      this.setCompany(null);
      this.setHasCompany(false);
    } finally {
      this.setLoading(false);
    }
  }

  async addCompany(companyData, userId) {
    this.isLoading = true;
    try {
      const company = await CompanyService.addCompany(companyData, userId);
      this.setCompany(company);
      showToast({ text1: "Компания добавлена", type: "success" });
    } catch (e) {
      error("Ошибка при добавлении компании:", e);
    } finally {
      this.isLoading = false;
    }
  }

  //МАШИНЫ
  async addCar(carData, folderName, ownerData) {
    this.setLoading(true);
    try {
      const car = await CompanyService.addCar(ownerData, carData, folderName);
      this.setCars(car);
    } catch (e) {
      error("Ошибка добавления автомобиля:", e);
      showToast({ text1: "Произошла ошибка", type: "error" });
    } finally {
      this.setLoading(false);
    }
  }

  async archiveCar(carId) {
    this.setLoading(true);
    try {
      await CompanyService.archiveCar(carId);
      this.setCars(this.cars.filter((car) => car.id !== carId));
      this.fetchCarsData(this.company._id, undefined);
    } catch (e) {
      error("Ошибка при архивации автомобиля:", e);
      showToast({ text1: "Произошла ошибка", type: "error" });
    } finally {
      this.setLoading(false);
    }
  }

  async deleteCar(carId) {
    this.setLoading(true);
    try {
      await CompanyService.deleteCar(carId);
      this.setCars(this.cars.filter((car) => car.id !== carId));
      this.fetchCarsData(this.company._id, undefined);
    } catch (e) {
      error("Ошибка при архивации автомобиля:", e);
      showToast({ text1: "Произошла ошибка", type: "error" });
    } finally {
      this.setLoading(false);
    }
  }
  async returnCar(carId) {
    this.setLoading(true);
    try {
      await CompanyService.returnCar(carId);
      this.fetchCarsData(this.company._id, undefined);
    } catch (e) {
      error("Ошибка при архивации автомобиля:", e);
            showToast({ text1: "Произошла ошибка", type: "error" });
      
    } finally {
      this.setLoading(false);
    }
  }
  async updateCarData(carId, depositAmount, pricePerDay) {
    this.setLoading(true);
    try {
      await CompanyService.updateCarData(
        carId,
        depositAmount,
        pricePerDay,
      );
    } catch (e) {
      error("Ошибка при архивации автомобиля:", e);
            showToast({ text1: "Произошла ошибка", type: "error" });
      
    } finally {
      this.setLoading(false);
    }
  }
  async fetchCarsData(
    id,
    selectedStatus,
    selectedType,
    selectedSortOptions,
    limit,
    page 
  ) {
    this.setLoading(true);
    this.setFetchNewCars(true);
    try {
      const response = await CompanyService.fetchCarsData(
        id,
        selectedStatus,
        selectedType,
        selectedSortOptions,
        page,
        limit
      );

      log("responsecars", response.data);

      runInAction(() => {
        if (page === 1) {
          this.cars = response.data.vehicles; // Обновляем массив, если это первый запрос
          log("thisnew.cars", this.cars);
        } else {
          this.cars = [...this.cars, ...response.data.vehicles]; // Добавляем к существующему
          log("thisadd.cars", this.cars);
        }
        this.setTotalCars(response.data.total);
      });
    } catch (e) {
      error("Ошибка при получении данных автомобилей:", e);
            showToast({ text1: "Произошла ошибка", type: "error" });
      
    } finally {
      this.setLoading(false);
    }
  }

  // ЗАЯВКИ
  async getRequests(ownerId, filterParam, sortParam, limit, page) {
    log("getRequests", ownerId, filterParam, sortParam, limit, page);
    this.setLoading(true);
    try {
      const response = await CompanyService.getRequests(ownerId, filterParam, sortParam, limit, page);
      
      runInAction(() => {
        if (page === 1) {
          this.requests = response.requests; // Обновляем массив, если это первый запрос
          log("thisnew.requests", this.requests);
        } else {
          this.requests = [...this.requests, ...response.requests]; // Добавляем к существующему
          log("thisadd.requests", this.requests);
        }
        this.setTotalRequests(response.totalRequests);
      });
    } catch (e) {
      error("Ошибка при получении заявок:", e);
            showToast({ text1: "Произошла ошибка", type: "error" });
      
    } finally {
      this.setLoading(false);
    }
  }

  async updateRequestStatus(requestId, newStatus, startDate, endDate) {
    this.setLoading(true);
    try {
      await CompanyService.updateRequestStatus(
        requestId,
        newStatus,
        startDate,
        endDate
      );
    } catch (e) {
      error("Ошибка при обновлении статуса заявки:", e);
            showToast({ text1: "Произошла ошибка", type: "error" });
      
    } finally {
      this.setLoading(false);
    }
  }
  async cancelRequest(requestId, message) {
    this.setLoading(true);
    if (!requestId || !message) {
      return;
    }
    try {
      await CompanyService.cancelRequest(requestId, message);
      this.getRequests();
    } catch (e) {
      error("Ошибка при обновлении статуса заявки:", e);
            showToast({ text1: "Произошла ошибка", type: "error" });
      
    } finally {
      this.setLoading(false);
    }
  }

  // АРЕНДЫ
  async fetchRentals(ownerId, filterParam, sortParam, limit, page) {
    this.setLoading(true);
    try {
      const response = await CompanyService.fetchRentals(
        ownerId,
        filterParam,
        sortParam,
        limit, page
      );

      runInAction(() => {
        if (page === 1) {
          this.rentals = response.rentals; // Обновляем массив, если это первый запрос
          log("thisnew.requests", this.rentals);
        } else {
          this.rentals = [...this.rentals, ...response.rentals]; // Добавляем к существующему
          log("thisadd.rentals", this.requests);
        }
        this.setTotalRentals(response.totalRentals);
      });

    } catch (e) {
      error("Ошибка при получении рентал:", e);
            showToast({ text1: "Произошла ошибка", type: "error" });
      
    } finally {
      this.setLoading(false);
    }
  }

  async cancelRental(rentalId, cancelReason) {
    this.setLoading(true);
    if (!rentalId || !cancelReason) {
      return;
    }
    try {
      await CompanyService.cancelRental(rentalId, cancelReason);
      this.fetchRentals();
    } catch (e) {
      error("Ошибка при обновлении статуса заявки:", e);
            showToast({ text1: "Произошла ошибка", type: "error" });
      
    } finally {
      this.setLoading(false);
    }
  }

  //Для пользовтельской страницы

  async fetchUserData(userId, fields) {
    this.setLoading(true);
    try {
      const userData = await CompanyService.fetchUserData(userId, fields);
      log("StorefetchUserData", userData);
      this.setUserData(userData);
    } catch (e) {
      error("Ошибка при получении данных автомобилей:", e);
            showToast({ text1: "Произошла ошибка", type: "error" });
      
    } finally {
      this.setLoading(false);
    }
  }

  async rateUser(userId) {
    this.setLoading(true);
    try {
      await CompanyService.rateUser(userId);
    } catch (e) {
      error("Ошибка при получении данных автомобилей:", e);
            showToast({ text1: "Произошла ошибка", type: "error" });
      
    } finally {
      this.setLoading(false);
    }
  }

  async blockUser(id) {
    this.setLoading(true);
    try {
      await CompanyService.blockUser(id);
      // Обновляем блокированных пользователей
      await this.fetchCompanyData(store.user.id);
      runInAction(() => {
        this.blockedUsers = this.blockedUsers.filter((user) => user.id !== id);
      });
    } catch (e) {
      error("Ошибка при блокировке пользователя:", e);
            showToast({ text1: "Произошла ошибка", type: "error" });
      
    } finally {
      this.setLoading(false);
    }
  }
}

export default CompanyStore;
