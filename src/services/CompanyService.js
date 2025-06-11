import $api, { API_URL } from "../http/axios";
import { error, log } from "../utils/logger";
import { showToast } from "./toastService";

class CompanyService {
    static async fetchCompanyData() {
            return $api.get(`${API_URL}/parks/getCompanyData`);
    }

    static async fetchCarsData(id, selectedStatus, selectedType, selectedSortOptions, currentPage , limit) {
        const ownerId = id;
        const page = currentPage;
        try {
            const response = await $api.get(`${API_URL}/cars/allVehicleData`, { params: { ownerId, selectedStatus, selectedType, selectedSortOptions, page, limit } });
            return response.data;
        } catch (e) {
            error(e.response?.data?.message);
            throw e;
        }
    }

    static async addCar(ownerData, carData, folderName) {
        try {
            const response = await $api.post(`${API_URL}/cars/uploadCar`,{
                ownerData,
                carData,
                folderName
            });
            return response.data;
        } catch (e) {
            error(e.response?.data?.message);
            throw e;
        }
    }

    static async addCompany(companyData, userId) {
        try {
            const response = await $api.post(`${API_URL}/parks/addCompanyData`, {
                companyData,  
                userId        
            });
            return response.data;
        } catch (e) {
            error(e.response?.data?.message);
            throw e;
        }
    }
    static async archiveCar(carId) {
        try {
            const response = await $api.post(`${API_URL}/cars/archiveCar`, { carId });
            return response.data;
        } catch (e) {
            error(e.response?.data?.message);
            throw e;
        }
    }
    static async deleteCar(carId) {
        try {
            const response = await $api.post(`${API_URL}/cars/deleteCar`, { carId });
            return response.data;
        } catch (e) {
            error(e.response?.data?.message);
            throw e;
        }
    }
    static async returnCar(carId) {
        try {
            const response = await $api.post(`${API_URL}/cars/returnCar`, { carId });
            return response.data;
        } catch (e) {
            error(e.response?.data?.message);
            throw e;
        }
    }
    static async updateCarData (carId, depositAmount, pricePerDay) {
        try {
            const response = await $api.post(`${API_URL}/cars/updateCarData`, { carId, depositAmount, pricePerDay });
            return response.data;
        } catch (e) {
            error(e.response?.data?.message);
            throw e;
        }
    }

    //ЗАЯВКИ  
    static async getRequests( ownerId , filterParam , sortParam, limit , page) {
        try {
            const response = await $api.get(`${API_URL}/request/getRequests`, { params: { ownerId, filterParam , sortParam , limit , page} });
            return response.data;
        } catch (e) {
            error(e.response?.data?.message);
            throw e;
        }
    }
    static async updateRequestStatus(requestId, newStatus, startDate, endDate ) {
        try {
            const response = await $api.patch(`${API_URL}/request/updateRequestStatus`, { requestId, newStatus, startDate, endDate });
            return response.data;   
        } catch (e) {
            error(e.response?.data?.message);
            throw e;
        }
    }
    static async cancelRequest(requestId, message) {
        try {
            const response = await $api.patch(`${API_URL}/request/cancelRequest`, { requestId, message });
            return response.data;
        } catch (e) {
            error(e.response?.data?.message);
            throw e;
        }
    }

    //Аренда

    static async fetchRentals(ownerId, filterParam , sortParam, limit, page) {
        try {
            const response = await $api.get(`${API_URL}/rental/getRentals`, { params: { ownerId, filterParam , sortParam, limit, page } });
            return response.data;
        } catch (e) {
            error(e.response?.data?.message);
            throw e;
        }
    }

    static async cancelRental(rentalId, cancelReason, showToast) {
     try { 
        const response = await $api.patch(`${API_URL}/rental/cancelRental`, { rentalId, cancelInputValue: cancelReason });
        return response.data;
        
     } catch (e) {
        error(e.response?.data?.message);
        throw e;
     }
    }
    static async fetchUserData(userId, fields) {
        try {
            const response = await $api.get(`${API_URL}/users/getUserInfo`, {
                params: { userId, fields } 
            });
            log("responsefetchUserData", response); 
            return response.data;
        } catch (e) {
            error(e.response?.data?.message);
            throw e;
        }
    }

    static async rateUser(userId) {
        try {
            const response = await $api.patch(`${API_URL}/users/rateUser`, {
                ratedId : userId
            });
            log("response", response);
            return response.data;
        } catch (e) {
            error(e.response?.data?.message);
            throw e;
        }
    }

static async blockUser(id ) {
    try {
        const response = await $api.patch(`${API_URL}/users/blockUser`, {
            blockedUserId : id 
        });
        
        log("response", response);
        return response.data;
    } catch (e) {
        error(e.response?.data?.message);
        throw e;
    }
}

}

export default CompanyService;