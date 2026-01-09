// src/pages/presentacion.jsx
import { useNavigate } from "react-router-dom";
import { Info, ArrowRight } from "lucide-react";

export default function Presentacion() {
  const navigate = useNavigate();

  return (
    <div
      className="
        min-h-screen w-full
        flex items-center justify-center
        px-6 sm:px-12 py-10
      "
      style={{ backgroundColor: "var(--light, #f4f8e4)" }}
    >
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-lg p-8 sm:p-12 text-center">
        
        {/* TÍTULO */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-slate-900">
          Bienvenido a la plataforma de beneficios
        </h1>

        {/* DESCRIPCIÓN */}
        <p className="text-lg sm:text-xl text-slate-700 leading-relaxed mb-10">
          Este sitio está diseñado para ayudarte a encontrar beneficios,
          apoyos y servicios disponibles para personas mayores de forma
          clara, simple y accesible.
        </p>

        {/* BLOQUES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CÓMO FUNCIONA */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 text-left">
            <div className="flex items-center gap-3 mb-4">
              <Info size={28} className="text-[var(--primary,#3e6a0f)]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                ¿Cómo funciona?
              </h2>
            </div>

            <ul className="list-decimal pl-6 text-slate-700 space-y-3 text-base sm:text-lg">
              <li>Explora las categorías de beneficios disponibles.</li>
              <li>Revisa los requisitos y condiciones de cada beneficio.</li>
              <li>Encuentra dónde acceder y cómo postular.</li>
            </ul>
          </div>

          {/* ENTRAR */}
          <div className="bg-[var(--primary,#3e6a0f)] rounded-2xl p-6 sm:p-8 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">
                Comenzar
              </h2>
              <p className="text-base sm:text-lg opacity-95">
                Accede al buscador y revisa todos los beneficios disponibles.
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="
                mt-8 flex items-center justify-center gap-3
                bg-white text-slate-900 font-bold
                py-4 rounded-xl
                text-lg sm:text-xl
                hover:brightness-105 transition-all
              "
            >
              Entrar a la plataforma
              <ArrowRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
