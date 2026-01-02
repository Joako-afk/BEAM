// src/pages/organizaciones.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InfoPanel from "../components/infopanel";
import { generatePalette } from "../utils/generatePalette";
import { cardBeneficio } from "../components/card";
import InternalLayout from "../layouts/internal";

export default function Organizaciones() {
  const { slug } = useParams(); // Obtener el slug de la URL
  const [categoria, setCategoria] = useState(null);
  const [instituciones, setInstituciones] = useState([]);

  useEffect(() => {
    // Usar el slug de la URL, o un fallback si no existe
    const slugCategoria = slug || "organizaciones-sociales";

    fetch(`http://localhost:4000/api/instituciones/categoria/${slugCategoria}`)
      .then((res) => res.json())
      .then((data) => {
        // 1) Paleta igual que categoria.jsx
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

        // 2) Adaptar instituciones al formato que espera cardBeneficio
        const enhanced = (data.instituciones || []).map((inst) => ({
          id_beneficio: inst.id_institucion, // reutilizamos la card
          nombre: inst.nombre,
          slug: `institucion-${inst.id_institucion}`, // placeholder (aún no navega)
          icon_name: inst.logo_url || "default.svg", // Usa el logo real o el default si no tiene
          colors: palette,
          onClick: () => {}, // después lo cambiamos a navegar a detalle
        }));

        setInstituciones(enhanced);
      })
      .catch((err) => {
        console.error("Error cargando instituciones:", err);
        setCategoria(null);
        setInstituciones([]);
      });
  }, [slug]);

  if (!categoria) return <p className="pt-32 text-center">Cargando...</p>;

  return (
    <InternalLayout title={categoria.nombre}>
      <div
        className="w-full flex flex-col items-center pb-24 px-4 pt-1"
        style={{ backgroundColor: "var(--light)", minHeight: "100vh" }}
      >
        {/* Panel de información */}
        <div className="w-full flex justify-center mb-8 -mt-15">
          <InfoPanel text={categoria.descripcion} />
        </div>

        {/* Grid de tarjetas (igual que categoria.jsx) */}
        <div
          className="
            w-full max-w-6xl
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
            justify-items-center gap-6
          "
        >
          {instituciones.length === 0 && (
            <p className="col-span-full text-gray-600 text-center py-10">
              No hay organizaciones disponibles.
            </p>
          )}

          {instituciones.map((inst) => (
            <div
              key={inst.id_beneficio}
              className="h-full w-full max-w-[320px] sm:max-w-none"
            >
              {cardBeneficio(inst)}
            </div>
          ))}
        </div>
      </div>
    </InternalLayout>
  );
}
