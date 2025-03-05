const validatePassword = (password) => {
    const passwordValidation = {
      length: password.length >= 8 && password.length <= 16,
      regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,16}$/.test(password),
    };
  
    if (!passwordValidation.length) {
      return "Пароль должен быть от 8 до 16 символов";
    }
  
    if (!passwordValidation.regex) {
      return "Пароль должен содержать обязательные символы (буквы, цифры и хотя бы один специальный символ)";
    }
  
    return null; // Возвращаем null, если пароль валиден
  };
  
  export default validatePassword;