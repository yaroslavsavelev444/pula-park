import $api from "../http/axios";
import { log } from "../utils/logger";

export default class AuthService {
  static async checkEmailExists(email) {
    return $api.post("auth/isEmailExists", { email });
  }
  static async login(email, password) {
    const isSite = true;
    return $api.post("auth/login", { email, password, isSite } ,  {
        withCredentials: true,
      });
  }

  static async registration(
    email,
    password,
    phone,
    name,
    surname,
    role,
    type,
    key
  ) {
    log(
      "registration",
      email,
      password,
      phone,
      name,
      surname,
      role,
      type,
      key
    );
    return $api.post("auth/registration", {
      email,
      password,
      phone,
      name,
      surname,
      role,
      type,
      key,
    });
  }

  static async logout() {
    return $api.post("auth/logout");
  }

  static async resendActivation(email) {
    return $api.post("auth/resendActivationLink", { email });
  }

  static async changePassword(oldPassword, newPassword, userId) {
    return $api.post("auth/changePassword", {
      oldPassword,
      newPassword,
      userId,
    });
  }

  static async forgotPassword(email) {
    return $api.post("auth/forgotPassword", { email });
  }

  static async resetForgottenPasswod(token, newPassword) {
    return $api.post("auth/resetForgottenPassword", {
      resetToken: token,
      newPassword,
    });
  }

  static async updateSetting(key, value) {
    return $api.patch("auth/updateSettings", { key, value });
  }

  static async fetchSettings() {
    return $api.get("auth/getSettings");
  }

  static async verifyEmailCode(userId, code) {
    return $api.post("auth/verify2faCode", { userId, code });
  }

  static async verifyPhoneCode(userId, code) {
    return $api.post("auth/verifyPhoneCode", { userId, code });
  }

  static async resendEmailCode(userId) {
    return $api.post("auth/resend2faCode", { userId });
  }

  static async resendPhoneCode(userId) {
    return $api.post("auth/resendVerifyPhoneCode", { userId });
  }

}
