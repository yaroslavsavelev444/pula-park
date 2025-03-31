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

    static async changePassword(oldPassword, newPassword, userId) {
        return $api.post('auth/changePassword', {oldPassword, newPassword, userId});
    }

    static async forgotPassword(email) {
        return $api.post('auth/forgotPassword', {email});
    }

    static async resetForgottenPasswod(token, newPassword) {
        return $api.post('auth/resetForgottenPassword', {resetToken: token, newPassword});
    }

    static async updateSetting(key, value) {
        return $api.patch('auth/updateSettings', {key, value});
    }

    static async fetchSettings() {
        return $api.get('auth/getSettings');
    }
}