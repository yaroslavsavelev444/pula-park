import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const savedTheme = localStorage.getItem("theme");
  const savedSystemPreference = localStorage.getItem("isSystemTheme") === "true";

  const getSystemTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const [isSystemTheme, setIsSystemTheme] = useState(savedSystemPreference);
  const [theme, setTheme] = useState(() => {
    return savedSystemPreference ? getSystemTheme() : savedTheme || getSystemTheme();
  });

  useEffect(() => {
    if (!isSystemTheme) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setTheme(getSystemTheme());

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isSystemTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Функция переключения системной темы (вкл/выкл)
  const toggleSystemTheme = () => {
    const newSystemThemeState = !isSystemTheme;
    setIsSystemTheme(newSystemThemeState);
    localStorage.setItem("isSystemTheme", newSystemThemeState.toString());

    if (newSystemThemeState) {
      setTheme(getSystemTheme());
    } else {
      setTheme("light"); // При выключении системной темы устанавливаем светлую (можно изменить)
    }
  };

  // Переключение темы вручную
  const toggleTheme = () => {
    setIsSystemTheme(false); // Выключаем авто-режим при ручном выборе
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("isSystemTheme", "false");
  };

  return (
    <ThemeContext.Provider value={{ theme, isSystemTheme, toggleTheme, toggleSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};