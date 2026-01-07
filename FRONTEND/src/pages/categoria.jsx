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
  const [items, setItems] = useState([]); // beneficios o instituciones
  const [modo, setModo] = useState("beneficios"); // "beneficios" | "instituciones"

  useEffect(() => {
    const esOrganizaciones = slug === "organizaciones-sociales";
    setModo(esOrganizaciones ? "instituciones" : "beneficios");

    const endpoint = esOrganizaciones
      ? `http://localhost:4000/api/instituciones/categoria/${slug}`
      : `http://localhost:4000/api/beneficios/categoria/${slug}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        const palette = generatePalette(data.categoria.color_primary);

        document.documentElement.style.setProperty("--primary", palette.primary);
        document.documentElement.style.setProperty("--secondary", palette.secondary);
        document.documentElement.style.setProperty("--tertiary", palette.tertiary);
        document.documentElement.style.setProperty("--light", palette.light);
        document.documentElement.style.setProperty("--text", palette.text);

        setCategoria({ ...data.categoria, colors: palette });

        const lista = esOrganizaciones
          ? (data.instituciones || [])
          : (data.beneficios || []);

        const enhanced = lista.map((x) => ({
          // la card usa id_beneficio como key
          id_beneficio: esOrganizaciones ? x.id_institucion : x.id_beneficio,
          nombre: x.nombre,

          // iconos: instituciones no traen icon_name → usa el de la categoría
          icon_name: esOrganizaciones
            ? (x.logo_url || data.categoria.icon_name || "default.svg")
            : x.icon_name,

          // Pasamos el logo_url original por si la tarjeta lo requiere
          logo_url: esOrganizaciones ? x.logo_url : undefined,

          colors: palette,

          onClick: esOrganizaciones
            ? () => navigate(`/institucion/${x.slug}`, { state: { colors: palette } })
            : () =>
                navigate(`/beneficio/${x.slug}`, {
                  state: { colors: palette },
                }),

        }));

        setItems(enhanced);
      })
      .catch((err) => {
        console.error("Error cargando categoría:", err);
        setCategoria(null);
        setItems([]);
      });
  }, [slug, navigate]);

  if (!categoria) return <p className="pt-32 text-center">Cargando...</p>;

  return (
    <InternalLayout title={categoria.nombre}>
      <div
        className="w-full flex flex-col items-center pb-24 px-4 pt-1"
        style={{ backgroundColor: "var(--light)", minHeight: "100vh" }}
      >
        <div className="w-full flex justify-center mb-8 -mt-15">
          <InfoPanel text={categoria.descripcion} />
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-6">
          {items.length === 0 && (
            <p className="col-span-full text-gray-600 text-center py-10">
              {modo === "instituciones"
                ? "No hay organizaciones disponibles en esta categoría."
                : "No hay beneficios disponibles en esta categoría."}
            </p>
          )}

          {items.map((item) => (
            <div
              key={item.id_beneficio}
              className="h-full w-full max-w-[320px] sm:max-w-none"
            >
              {cardBeneficio(item)}
            </div>
          ))}
        </div>
      </div>
    </InternalLayout>
  );
}
