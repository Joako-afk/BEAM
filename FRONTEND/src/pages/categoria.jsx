// src/pages/categoria.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InfoPanel from "../components/infopanel";
import { generatePalette } from "../utils/generatePalette";
import { cardBeneficio } from "../components/card";
import InternalLayout from "../layouts/internal";

export default function Categoria() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState(null);
  const [beneficios, setBeneficios] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/api/beneficios/categoria/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const palette = generatePalette(data.categoria.color_primary);

        document.documentElement.style.setProperty("--primary", palette.primary);
        document.documentElement.style.setProperty("--secondary", palette.secondary);
        document.documentElement.style.setProperty("--tertiary", palette.tertiary);
        document.documentElement.style.setProperty("--light", palette.light);
        document.documentElement.style.setProperty("--text", palette.text);

        setCategoria({
          ...data.categoria,
          colors: palette,
        });

        const enhanced = data.beneficios.map((b) => ({
          ...b,
          colors: palette,
          onClick: () =>
            navigate(`/beneficio/${b.slug}`, {
              state: { colors: palette },
            }),
        }));

        setBeneficios(enhanced);
      });
  }, [slug, navigate]);

  if (!categoria) return <p className="pt-32 text-center">Cargando...</p>;

  return (
    <InternalLayout title={categoria.nombre}>
      <div
        className="
          w-full flex flex-col items-center 
          pb-24 px-4 pt-1
        "
        style={{ backgroundColor: "var(--light)", minHeight: "100vh" }}
      >
        
        {/* Panel de información */}
        <div className="w-full flex justify-center mb-8 -mt-15">
          <InfoPanel text={categoria.descripcion} />
        </div>

        {/* GRID DE TARJETAS CORREGIDO */}
        <div className="
          w-full max-w-6xl
          grid 
          /* 1. MÓVIL: grid-cols-1 (Una sola columna) */
          /* 2. PC: Se adapta automáticamente */
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          
          /* 3. CENTRADO: Esto centra las tarjetas en su columna */
          justify-items-center
          
          gap-6
        ">
          
          {beneficios.length === 0 && (
            <p className="col-span-full text-gray-600 text-center py-10">
              No hay beneficios disponibles en esta categoría.
            </p>
          )}

          {beneficios.map((benef) => (
            /* Ajustamos el ancho máximo en móvil para que se vea como una tarjeta centrada y no ocupe toda la pantalla de borde a borde si no quieres */
            <div key={benef.id_beneficio} className="h-full w-full max-w-[320px] sm:max-w-none">
              {cardBeneficio(benef)}
            </div>
          ))}
        </div>
      </div>
    </InternalLayout>
  );
}