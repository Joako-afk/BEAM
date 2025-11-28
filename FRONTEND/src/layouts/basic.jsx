// src/layouts/basic.jsx
import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function BasicLayout({ children }) {
  const [fontSize, setFontSize] = useState("medium");
  const [theme, setTheme] = useState("light");

  const fontClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  // 🎨 Tema ahora controla TODO el fondo
  const themeClasses = {
    light: "bg-[#f4f8e4] text-gray-900", // verde claro
    dark: "bg-gray-900 text-gray-100",  // dark mode real
    contrast: "bg-yellow-50 text-black",
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-all ${themeClasses[theme]} ${fontClasses[fontSize]}`}
    >
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 pt-0 pb-20">
        {children}
      </main>

      <Footer
        onFontChange={setFontSize}
        onColorChange={setTheme}
      />
    </div>
  );
}
