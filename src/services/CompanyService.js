import $api, { API_URL } from "../http/axios";

class CompanyService {
    static async fetchCompanyData(userId) {
            return $api.get(`${API_URL}/parks/getCompanyData`, { params: { userId } });
    }

    static async fetchCarsData(id, selectedStatus, selectedType, selectedSortOptions) {
        const ownerId = id;
        try {
            const response = await $api.get(`${API_URL}/cars/allVehicleData`, { params: { ownerId, selectedStatus, selectedType, selectedSortOptions } });
            return response.data;
        } catch (e) {
            console.log(e.response?.data?.message);
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
            console.log(e.response?.data?.message);
            throw e;
        }
    }

    static async addCompany(companyData, userId) {
        try {
            const response = await $api.post(`${API_URL}/parks/addCompanyData`, {
                companyData,  // передаем объект компании
                userId        // передаем userId как часть body
            });
            return response.data;
        } catch (e) {
            console.log(e.response?.data?.message);
            throw e;
        }
    }
    static async archiveCar(carId) {
        try {
            const response = await $api.post(`${API_URL}/cars/archiveCar`, { carId });
            return response.data;
        } catch (e) {
            console.log(e.response?.data?.message);
            throw e;
        }
    }
    static async deleteCar(carId) {
        try {
            const response = await $api.post(`${API_URL}/cars/deleteCar`, { carId });
            return response.data;
        } catch (e) {
            console.log(e.response?.data?.message);
            throw e;
        }
    }
    static async returnCar(carId) {
        try {
            const response = await $api.post(`${API_URL}/cars/returnCar`, { carId });
            return response.data;
        } catch (e) {
            console.log(e.response?.data?.message);
            throw e;
        }
    }
    static async updateCarData (carId, depositAmount, pricePerDay, showToast) {
        try {
            const response = await $api.post(`${API_URL}/cars/updateCarData`, { carId, depositAmount, pricePerDay });
            showToast({
                text1: "Данные успешно изменены",
                type: "success",
            })
            return response.data;
        } catch (e) {
            showToast({
                text1: "Произошла ошибка",
                type: "error",
            })
            console.log(e.response?.data?.message);
            throw e;
        }
    }

    static async fetchRequests(ownerId, filterParam , sortParam) {
        const isAdmin = true;
        try {
            const response = await $api.get(`${API_URL}/rentalRequests/getRentalRequests`, { params: { isAdmin, ownerId, filterParam , sortParam } });
            return response.data;
        } catch (e) {
            console.log(e.response?.data?.message);
            throw e;
        }
    }
    static async updateRequestStatus(requestId, newStatus, startDate, endDate ) {
        try {
            const response = await $api.patch(`${API_URL}/rentalRequests/updateRequestStatus`, { requestId, newStatus, startDate, endDate });
            return response.data;   
        } catch (e) {
            console.log(e.response?.data?.message);
            throw e;
        }
    }
    static async cancelCancelRequestAhead(requestId, message, userId) {
        try {
            const response = await $api.patch(`${API_URL}/rentalRequests/cancelCancelRequestAhead`, { requestId, message, userId });
            return response.data;
        } catch (e) {
            console.log(e.response?.data?.message);
            throw e;
        }
    }

    static async fetchRentals(ownerId, filterParam , sortParam) {
        try {
            const response = await $api.get(`${API_URL}/rentalRequests/getRentals`, { params: { ownerId, filterParam , sortParam } });
            return response.data;
        } catch (e) {
            console.log(e.response?.data?.message);
            throw e;
        }
    }
}


export default CompanyService;