import { makeAutoObservable, runInAction } from "mobx";
import CompanyService from "../services/CompanyService";
import $api, { API_URL } from "../http/axios";

class CompanyStore {
  company = {};
  cars = [];
  isLoading = false;
  hasCompany = false;
  requests = [];
  rentals = [];
  userData = {};

  get carsList() {
    return Array.isArray(this.cars) ? this.cars : [];
  }

  get requestsList() {
    return Object.values(this.requests || {});
  }

  get carsCount() {
    return this.carsList.length;
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
      console.log("Loading set to:", this.isLoading);
    });
  }

  setCompany(company) {
    runInAction(() => {
      this.company = company;
      console.log("Company set to:", this.company);
    });
  }

  setCars(cars) {
    runInAction(() => {
      this.cars = cars;
      console.log("Cars set to:", this.cars);
    });
  }
  setHasCompany(bool) {
    runInAction(() => {
      this.hasCompany = bool;
      console.log("HasCompany set to:", this.hasCompany);
    });
  }

  setRequests(requests) {
    runInAction(() => {
      this.requests = requests;
      console.log("Requests set to:", this.requests);
    });
  }
  setRentals(rentals) {
    runInAction(() => {
      this.rentals = rentals;
      console.log("Rentals set to:", this.rentals);
    });
  }

  setUserData(userData) {
    runInAction(() => {
      this.userData = userData;
      console.log("UserData set to:", this.userData);
    });
  }

  //КОМПАНИЯ

  async fetchCompanyData(userId) {
    this.setLoading(true);
    try {
      if (!userId) return;
      const response = await $api.get(`${API_URL}/parks/getCompanyData`, {
        params: { userId },
      });
      if (response.data) {
        this.setCompany(response.data);
        this.setHasCompany(true);
      } else {
        this.setCompany(null);
        this.setHasCompany(false);
      }
      console.log("response", response);
    } catch (e) {
      console.error("Ошибка при получении данных компании:", e);
      this.setCompany(null);
      this.setHasCompany(false);
    } finally {
      this.setLoading(false);
    }
  }

  async addCompany(companyData, userId) {
    this.setLoading(true);
    try {
      const company = await CompanyService.addCompany(companyData, userId);
      this.setCompany(company);
    } catch (e) {
      console.error("Ошибка добавления компании:", e);
    } finally {
      this.setLoading(false);
    }
  }

  //МАШИНЫ
  async addCar(carData, folderName, ownerData) {
    this.setLoading(true);
    try {
      const car = await CompanyService.addCar(ownerData, carData, folderName);
      this.setCars(car);
    } catch (e) {
      console.error("Ошибка добавления автомобиля:", e);
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
      console.error("Ошибка при архивации автомобиля:", e);
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
      console.error("Ошибка при архивации автомобиля:", e);
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
      console.error("Ошибка при архивации автомобиля:", e);
    } finally {
      this.setLoading(false);
    }
  }
  async updateCarData(carId, depositAmount, pricePerDay, showToast) {
    this.setLoading(true);
    try {
      await CompanyService.updateCarData(
        carId,
        depositAmount,
        pricePerDay,
        showToast
      );
    } catch (e) {
      console.error("Ошибка при архивации автомобиля:", e);
    } finally {
      this.setLoading(false);
    }
  }
  async fetchCarsData(id, selectedStatus, selectedType, selectedSortOptions) {
    console.log(
      "fetchCarsData",
      "id",
      id,
      "selectedStatus",
      selectedStatus,
      "selectedType",
      selectedType,
      "selectedSortOptions",
      selectedSortOptions
    );
    this.setLoading(true);
    try {
      console.log(
        "id",
        id,
        "selectedStatus",
        selectedStatus,
        "selectedType",
        selectedType,
        "selectedSortOptions",
        selectedSortOptions
      );
      const cars = await CompanyService.fetchCarsData(
        id,
        selectedStatus,
        selectedType,
        selectedSortOptions
      );
      this.setCars(cars.data);
    } catch (e) {
      console.error("Ошибка при получении данных автомобилей:", e);
    } finally {
      this.setLoading(false);
    }
  }

  // ЗАЯВКИ
  async getRequests(ownerId, filterParam, sortParam) {
    console.log(
      "getRequests",
      "filterParam",
      filterParam,
      "sortParam",
      sortParam
    );
    this.setLoading(true);
    try {
      const requests = await CompanyService.getRequests(
        ownerId,
        filterParam,
        sortParam
      );
      this.setRequests(requests);
      console.log("getRequests", requests);
    } catch (e) {
      console.error("Ошибка при получении заявок:", e);
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
      console.error("Ошибка при обновлении статуса заявки:", e);
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
      console.error("Ошибка при обновлении статуса заявки:", e);
    } finally {
      this.setLoading(false);
    }
  }

  // АРЕНДЫ

  async fetchRentals(ownerId, filterParam, sortParam) {

    console.log('fetchRentals', ownerId, filterParam, sortParam);
    this.setLoading(true);
    try {
      const rentals = await CompanyService.fetchRentals(
        ownerId,
        filterParam,
        sortParam
      );
      this.setRentals(rentals);
      console.log("fetchRentals", rentals);
    } catch (e) {
      console.error("Ошибка при получении рентал:", e);
    } finally {
      this.setLoading(false);
    }
  }

  async cancelRental(rentalId, cancelReason, showToast) {
    this.setLoading(true);
    if (!rentalId || !cancelReason) {
      return;
    }
    try {
      await CompanyService.cancelRental(rentalId, cancelReason, showToast);
      this.fetchRentals();
    } catch (e) {
      console.error("Ошибка при обновлении статуса заявки:", e);
    } finally {
      this.setLoading(false);
    }
  }

  //Для пользовтельской страницы

  async fetchUserData(userId, fields) {
    this.setLoading(true);
    try {
      const userData = await CompanyService.fetchUserData(userId, fields);
      console.log("StoreGetteduserData", userData);
      this.setUserData(userData);
    } catch (e) {
      console.error("Ошибка при получении данных автомобилей:", e);
    } finally {
      this.setLoading(false);
    }
  }

  async rateUser(userId) {
    this.setLoading(true);
    try {
      await CompanyService.rateUser(userId);
    } catch (e) {
      console.error("Ошибка при получении данных автомобилей:", e);
    } finally {
      this.setLoading(false);
    }
  }
}

export default CompanyStore;
