// src/components/footer.jsx
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; 
import { Phone, Settings, Minus, Plus, Type, RotateCcw } from "lucide-react";
import { ButtonNav } from "./buttons"; 

export default function Footer({ onColorChange }) {
  const location = useLocation(); 
  const [isOpen, setIsOpen] = useState(false);
  const [fontScale, setFontScale] = useState(100); 
  
  const menuRef = useRef(null);

  // 1. Detectar clics fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // 2. Resetear al cambiar de página
  useEffect(() => {
    handleResize("reset"); 
    setIsOpen(false);
  }, [location.pathname]);

  // Manejador del cambio de tamaño
  const handleResize = (action) => {
    let newScale = fontScale;

    // Paso de 5% y límites de 80% a 130%
    if (action === "increase" && fontScale < 130) {
      newScale = fontScale + 5;
    } else if (action === "decrease" && fontScale > 80) {
      newScale = fontScale - 5;
    } else if (action === "reset") {
      newScale = 100;
    }

    setFontScale(newScale);

    // Aplicamos a HTML y BODY
    const sizeString = `${newScale}%`;
    document.documentElement.style.fontSize = sizeString;
    document.body.style.fontSize = sizeString;
  };

  return (
    <footer
      className="
        print:hidden  fixed bottom-0 left-0 w-full
        flex justify-between items-center
        px-4 sm:px-12 py-3 sm:py-4
        shadow-[0_-2px_8px_rgba(0,0,0,0.3)]
        z-50
      "
      style={{
        backgroundColor: "var(--primary, #3e6a0f)",
        color: "var(--text, #ffffff)",
      }}
    >
      {/* Sección Izquierda */}
      <div className="flex items-center gap-2 sm:gap-4 max-w-[75%] sm:max-w-none">
        <Phone size={28} className="shrink-0" />
        <span className="text-sm sm:text-xl font-semibold leading-tight select-none">
          Soporte técnico de la plataforma:
          <span className="block sm:inline sm:ml-2">
             +56 9 1234 5678
          </span>
        </span>
      </div>

      {/* Sección Derecha */}
      <div className="relative" ref={menuRef}>
        <ButtonNav 
          text="Configuración" 
          icon={Settings} 
          onClick={() => setIsOpen(!isOpen)}
          showText={true}
          className="hover:opacity-90 text-sm sm:text-lg py-3 px-4 sm:px-6 sm:py-4"
          style={{ backgroundColor: "var(--secondary, #2f540c)" }} 
        />

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-4 bg-white text-gray-800 rounded-3xl shadow-2xl border border-gray-200 p-5 w-72 animate-fadeIn origin-bottom-right">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
              Accesibilidad
            </h3>
            
            {/* CONTROL DE TAMAÑO */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 text-gray-600 font-medium text-sm">
                <Type size={16} />
                <span>Tamaño de texto</span>
              </div>

              {/* Caja de Botones +/- */}
              <div className="bg-gray-100 rounded-xl p-2 flex items-center justify-between shadow-inner transition-all">
                <button 
                  onClick={() => handleResize("decrease")}
                  disabled={fontScale <= 80}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-700 active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={20} />
                </button>

                <span className="text-lg font-bold text-gray-800 w-12 text-center select-none">
                  {fontScale}%
                </span>

                <button 
                  onClick={() => handleResize("increase")}
                  disabled={fontScale >= 130}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-700 active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* === NUEVO BOTÓN RESTABLECER ESTILOSO === */}
              <div className="mt-3 flex justify-center min-h-[32px]">
                {fontScale !== 100 && (
                  <button 
                    onClick={() => handleResize("reset")}
                    // "group" permite que el hover del botón afecte al icono hijo
                    className="
                      group flex items-center gap-1.5 px-4 py-1.5 rounded-full
                      bg-slate-100 text-slate-700 text-xs font-semibold
                      hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm active:scale-95
                      transition-all duration-200 animate-fadeIn
                    "
                  >
                    {/* El icono gira al pasar el mouse */}
                    <RotateCcw size={13} className="transition-transform group-hover:-rotate-90" />
                    Restablecer tamaño
                  </button>
                )}
              </div>
            </div>

            {/* CONTROL DE TEMA */}
            <div>
              <span className="text-sm font-medium text-gray-600 mb-2 block">Tema de contraste</span>
              <div className="grid grid-cols-1 gap-2">
                <button onClick={() => onColorChange("light")} className="w-full px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-medium text-left flex items-center gap-3 transition-colors hover:bg-gray-50">
                  <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-400"></div>
                  Claro
                </button>
                <button onClick={() => onColorChange("dark")} className="w-full px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-xl text-sm font-medium text-left flex items-center gap-3 transition-colors">
                  <div className="w-4 h-4 rounded-full bg-gray-700 border border-gray-500"></div>
                  Oscuro
                </button>
                <button onClick={() => onColorChange("contrast")} className="w-full px-4 py-2 bg-yellow-300 text-black hover:bg-yellow-400 rounded-xl text-sm font-bold text-left flex items-center gap-3 border-2 border-black transition-colors">
                  <div className="w-4 h-4 rounded-full bg-black"></div>
                  Alto Contraste
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}