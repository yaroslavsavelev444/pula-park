import { useContext } from "react";
import { ThemeContext } from "../../../providers/ThemeProvider";
import Toggle from "../Toggle/Toggle";

const ThemeSwitcher = () => {
  const { theme, isSystemTheme, toggleTheme, toggleSystemTheme } = useContext(ThemeContext);

  return (
    <div style={{display:'flex' , flexDirection:'column', gap:10}}>
      <Toggle
        checked={isSystemTheme}
        onChange={toggleSystemTheme}
        placeholder="Системная тема"
      />
      <Toggle
        checked={theme === "dark"}
        onChange={toggleTheme}
        placeholder="Темная тема"
        disabled={isSystemTheme} // Блокируем если включена системная тема
      />
    </div>
  );
};

export default ThemeSwitcher;