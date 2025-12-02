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
    // ESTA ES LA RUTA CORRECTA PARA CATEGORÍA
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
        className="w-full flex flex-col items-center pt-20"
        style={{ backgroundColor: "var(--light)", minHeight: "100vh" }}
      >
        <div className="-mt-19 w-full flex justify-center">
          <InfoPanel text={categoria.descripcion} />
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] items-stretch justify-items-start gap-6 mb-20 px-4 w-full max-w-6xl">
          {beneficios.length === 0 && (
            <p className="col-span-full text-gray-600">
              No hay beneficios disponibles.
            </p>
          )}

          {beneficios.map((benef) => (
            <div key={benef.id_beneficio} className="h-full">{cardBeneficio(benef)}</div>
          ))}
        </div>
      </div>
    </InternalLayout>
  );
}
