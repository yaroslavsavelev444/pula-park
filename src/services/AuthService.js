import $api from "../http/axios";

export default class AuthService {
    static async login(email, password) {
        console.log('Serice', email, password)
        const isSite = true;
        return $api.post('auth/login', { email, password, isSite});
    }

    static async registration(email, password, phone, name, surname, role, type, key) {
        return $api.post('auth/registration', { email, password, phone, name, surname, role, type, key });
    }

    static async logout() {
        return $api.post('auth/logout');
    }

    static async resendActivation(email) {
        return $api.post('auth/resendActivationLink', {email});
    }
}