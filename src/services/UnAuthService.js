import $api from "../http/axios";

export default class UnAuthService {
  static async fetchCarsUnAuth() {
    return $api.get("carsCompRoutes/fetchCompilation");
  }
}
