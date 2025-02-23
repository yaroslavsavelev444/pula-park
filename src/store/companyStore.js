import { makeAutoObservable, runInAction } from "mobx";
import CompanyService from "../services/CompanyService";
import $api , { API_URL } from "../http/axios";
class CompanyStore {
    company = {};
    cars = [];
    isLoading = false;
    hasCompany = false;
    requests = {};

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

        })
    }
    setHasCompany(bool) {
        runInAction(() => {
            this.hasCompany = bool;
            console.log("HasCompany set to:", this.hasCompany);
        })
    }

    setRequests(requests) {
        runInAction(() => {
            this.requests = requests;
            console.log("Requests set to:", this.requests);
        })
    }


    async fetchCompanyData(userId) {
        this.setLoading(true);
        try {
            if (!userId) return;
            const response = await $api.get(`${API_URL}/parks/getCompanyData`, { params: { userId } });
           if (response.data) {
                this.setCompany(response.data);
                this.setHasCompany(true);
            }
            else{
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
            const company = await CompanyService.addCompany(companyData, userId );
            this.setCompany(company);
        } catch (e) {
            console.error("Ошибка добавления компании:", e);
        } finally {
            this.setLoading(false);
        }
    }

    async addCar (carData, folderName, ownerData) {
        this.setLoading(true);
        try {
            const car = await CompanyService.addCar(ownerData ,carData, folderName);
            this.setCars(car);
        } catch (e) {
            console.error("Ошибка добавления автомобиля:", e);
        } finally {
            this.setLoading(false);
        }
    }

    async fetchCarsData(id, selectedStatus, selectedType, selectedSortOptions) {
        this.setLoading(true);
        try {
            console.log("id", id, "selectedStatus", selectedStatus, "selectedType", selectedType, "selectedSortOptions", selectedSortOptions);   
            const cars = await CompanyService.fetchCarsData(id, selectedStatus, selectedType, selectedSortOptions);  
            this.setCars(cars.data);
        } catch (e) {   
            console.error("Ошибка при получении данных автомобилей:", e);
        } finally {
            this.setLoading(false);
        }
    }


    async archiveCar(carId) {
        this.setLoading(true);
        try {
            await CompanyService.archiveCar(carId);
            this.setCars(this.cars.filter(car => car.id !== carId));
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
            this.setCars(this.cars.filter(car => car.id !== carId));
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
    async updateCarData(carId, depositAmount, pricePerDay) {
        this.setLoading(true);
        try {
            await CompanyService.updateCarData(carId, depositAmount, pricePerDay);
        } catch (e) {
            console.error("Ошибка при архивации автомобиля:", e);
        } finally {
            this.setLoading(false);
        }
    }

    async fetchRequests(ownerId, filterParam , sortParam ) {
        console.log("ownerId", ownerId, "filterParam", filterParam, "sortParam", sortParam);
        this.setLoading(true);
        try {
            const requests = await CompanyService.fetchRequests(ownerId, filterParam , sortParam);
            this.setRequests(requests);
            console.log("fetchRequests", requests);    
        } catch (e) {
            console.error("Ошибка при получении заявок:", e);
        } finally {
            this.setLoading(false);
        }
    }

    async updateRequestStatus(requestId, newStatus) {
        const isAdmin = true;
        this.setLoading(true);
        try {
            await CompanyService.updateRequestStatus(requestId, newStatus, isAdmin);
            this.fetchRequests();
        } catch (e) {
            console.error("Ошибка при обновлении статуса заявки:", e);
        } finally {
            this.setLoading(false);
        }
    }
}

export default CompanyStore;