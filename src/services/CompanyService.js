import $api, { API_URL } from "../http/axios";

class CompanyService {
    static async fetchCompanyData(userId) {
            return $api.get(`${API_URL}/parks/getCompanyData`, { params: { userId } });
    }

    static async fetchCarsData(userId) {
        try {
            const response = await $api.get(`${API_URL}/cars/allVehicleData`, { params: { userId } });
            return response.data;
        } catch (e) {
            console.log(e.response?.data?.message);
            throw e;
        }
    }

    static async addCar(ownerId, carData) {
        try {
            console.log('sdfsfd', ownerId, carData);
            const response = await $api.post(`${API_URL}/cars/uploadCar`,{
                ownerId,
                carData
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
}

export default CompanyService;