// src/pages/institucion.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { MapPin, ExternalLink } from "lucide-react";
import InternalLayout from "../layouts/internal";
import { generatePalette } from "../utils/generatePalette";
import { ButtonCard } from "../components/buttons.jsx";

export default function Institucion() {
  const { slug } = useParams();
  const location = useLocation();

  const [institucion, setInstitucion] = useState(null);
  const [colors, setColors] = useState(null);

  // 1) Colores desde state (cuando vienes desde Categoria)
  useEffect(() => {
    const fromState = location.state?.colors;
    if (fromState) {
      setColors(fromState);
      updateCssVariables(fromState);
    }
  }, [location.state, slug]);

  // 2) Datos institución
  useEffect(() => {
    fetch(`http://localhost:4000/api/instituciones/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setInstitucion(data);

        // fallback colores si entras directo por URL (sin state)
        if (!location.state?.colors) {
          const base = "#860707"; // color fallback (organizaciones)
          const palette = generatePalette(base);
          setColors(palette);
          updateCssVariables(palette);
        }
      })
      .catch((e) => console.error(e));
  }, [slug, location.state]);

  const updateCssVariables = (palette) => {
    document.documentElement.style.setProperty("--primary", palette.primary);
    document.documentElement.style.setProperty("--secondary", palette.secondary);
    document.documentElement.style.setProperty("--tertiary", palette.tertiary);
    document.documentElement.style.setProperty("--light", palette.light);
    document.documentElement.style.setProperty("--text", palette.text);
  };

  if (!institucion || !colors) return <p className="pt-28 text-center">Cargando...</p>;

  const urlWeb = institucion.pagina_web || null;
  const email = institucion.email_contacto || null;

  return (
    <InternalLayout title={institucion.nombre}>
      <div
        className="min-h-screen px-4 sm:px-8 pb-24"
        style={{ backgroundColor: "var(--light)" }}
      >
        {/* CABECERA tipo Beneficio */}
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div
            className="rounded-2xl p-4 flex items-center justify-center shrink-0 border-[10px]"
            style={{
              backgroundColor: colors.light,
              borderColor: colors.primary,
              width: "120px",
              height: "120px",
            }}
          >
            {institucion.logo_url ? (
              <img
                src={institucion.logo_url.startsWith("http") || institucion.logo_url.startsWith("/") ? institucion.logo_url : `/icons/instituciones/${institucion.logo_url}`}
                onError={(e) =>(e.currentTarget.src = "/icons/default.svg")}
                alt="Logo"
                className=" object-contain w-25 h-25 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 scale-[1.25]"
              />
            ) : (
              <div className="text-4xl">🏛️</div>
            )}
          </div>

          <p className="text-lg sm:text-xl text-slate-900 leading-relaxed flex-1 whitespace-pre-line">
            {institucion.descripcion || "Sin descripción disponible."}
          </p>
        </div>

        {/* BLOQUES tipo Beneficio */}
        <div className="max-w-5xl mx-auto mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <section className="col-span-2 md:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-2 uppercase" style={{ color: colors.primary }}>
              Contacto
            </h2>
            <p className="text-lg text-slate-900 leading-relaxed">
              <span className="font-semibold">Email: </span>
              {email || "No disponible"}
            </p>
          </section>

          <section className="col-span-2 md:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-2 uppercase" style={{ color: colors.primary }}>
              Sitio web
            </h2>

            {urlWeb ? (
              <a className="text-lg underline break-all" href={urlWeb} target="_blank" rel="noreferrer">
                {urlWeb}
              </a>
            ) : (
              <p className="text-lg text-slate-600">No disponible</p>
            )}
          </section>
        </div>

        {/* SECCIÓN “Mapa y botones” vibe Beneficio */}
        <section className="max-w-5xl mx-auto mt-10 bg-white rounded-3xl p-6 sm:p-7 shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold uppercase mb-4" style={{ color: colors.primary }}>
            Información adicional
          </h2>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 h-64 flex items-center justify-center">
                <p className="text-slate-500 italic">
                  (Próximamente) Mapa de sucursales / ubicación.
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="mb-6">
                <p className="text-xl text-slate-900 mb-4 leading-relaxed">
                  Puedes visitar el sitio oficial para más información. Luego conectamos ubicación y “cómo llegar”.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                <ButtonCard
                  text="Saber más"
                  icon={ExternalLink}
                  color={colors.tertiary}
                  href={urlWeb || "https://www.chileatiende.gob.cl"}
                />
                <ButtonCard
                  text="Cómo llegar"
                  icon={MapPin}
                  color={colors.secondary}
                  href={null}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </InternalLayout>
  );
}
