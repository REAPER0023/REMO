import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${theme}`}
    >
      <div className="toggle-thumb">
        {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
      </div>
    </button>
  );
}

export default ThemeToggle;