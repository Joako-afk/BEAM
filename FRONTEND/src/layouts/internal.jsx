// src/layouts/internal.jsx
import { useState } from "react";
import Navbar from "../components/navbar_secondary";
import Footer from "../components/footer";

export default function InternalLayout({ children, title, back = true }) {
  const [fontSize, setFontSize] = useState("medium");

  const fontClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-all ${fontClasses[fontSize]}`}
      style={{
        backgroundColor: "var(--light, #f4f8e4)",
        color: "var(--body-text, #0f172a)",
      }}
    >
      <Navbar back={back} title={title} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 pt-24 pb-20">
        {children}
      </main>

      <Footer
        onFontChange={setFontSize}
        onColorChange={() => {}}
      />
    </div>
  );
}
