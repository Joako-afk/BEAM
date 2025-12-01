// src/pages/beneficio.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { generatePalette } from "../utils/generatePalette";
import { formatTextAsList } from "../utils/textoalista.jsx";
import InternalLayout from "../layouts/internal";
import MapaBeneficio from "../components/mapaBeneficio.jsx";


export default function Beneficio() {
  const { slug } = useParams();
  const location = useLocation();

  const [beneficio, setBeneficio] = useState(null);
  const [colors, setColors] = useState(null);
  const [mapExpanded, setMapExpanded] = useState(false);


  // Colores heredados de la categoría si vienen en state
  useEffect(() => {
    const fromState = location.state?.colors;
    const palette = fromState || generatePalette("#3e6a0f");
    setColors(palette);

    document.documentElement.style.setProperty("--primary", palette.primary);
    document.documentElement.style.setProperty("--secondary", palette.secondary);
    document.documentElement.style.setProperty("--light", palette.light);
    document.documentElement.style.setProperty("--text", palette.text);
  }, [location.state, slug]);

  // Datos del beneficio
  useEffect(() => {
    fetch(`http://localhost:4000/api/beneficios/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setBeneficio(data);
      });
  }, [slug]);

  if (!beneficio || !colors) {
    return <p className="pt-28 text-center">Cargando...</p>;
  }

  const requisitosTexto = beneficio.requisitos || beneficio.requesitos;

  return (
    <InternalLayout title={beneficio.nombre}>
      <div
        className="min-h-screen pt-32 pb-20 px-4 sm:px-8"
        style={{ backgroundColor: "var(--light)" }}
      >
        {/* 🟩 BLOQUE PRINCIPAL SOLO CON ICONO + DESCRIPCIÓN */}
        <div className="max-w-5xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col gap-6">
          
          <div className="flex gap-6 items-start">
            {/* Icono */}
            <div
              className="rounded-2xl p-4 flex items-center justify-center shrink-0"
              style={{
                backgroundColor: colors.light,
                border: `10px solid ${colors.primary}`,
                width: "140px",
                height: "140px",
              }}
            >
              {beneficio.icon_name ? (
                <img
                  src={`/icons/${beneficio.icon_name}`}
                  alt={beneficio.nombre}
                  className="w-24 h-24 object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="text-5xl">📌</div>
              )}
            </div>

            {/* Descripción corta */}
            <div className="flex-1">
              <p className="text-base sm:text-lg leading-relaxed text-slate-900">
                {beneficio.descripcion}
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* REQUISITOS */}
          {requisitosTexto && (
            <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
              <h2
                className="text-xl sm:text-2xl font-bold mb-2"
                style={{ color: colors.primary }}
              >
                Requisitos
              </h2>
              <div className="text-base sm:text-lg leading-relaxed text-slate-900 whitespace-pre-line">
                {formatTextAsList(requisitosTexto)}
              </div>

            </section>
          )}

          {/* EDAD MÍNIMA */}
          {beneficio.edad_minima != null && (
            <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
              <h2
                className="text-xl sm:text-2xl font-bold mb-2"
                style={{ color: colors.primary }}
              >
                Edad mínima
              </h2>
              <p className="text-base sm:text-lg text-slate-900">
                {beneficio.edad_minima} años
              </p>
            </section>
          )}

          {/* COSTO */}
          {beneficio.costo != null && (
            <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
              <h2
                className="text-xl sm:text-2xl font-bold mb-2"
                style={{ color: colors.primary }}
              >
                Costo
              </h2>
              <p className="text-base sm:text-lg text-slate-900">
                {beneficio.costo === 0 ? "Gratuito" : `$${beneficio.costo}`}
              </p>
            </section>
          )}

        </div>

                {beneficio.info_bloques?.length > 0 && (
          <div className="max-w-5xl mx-auto mt-10 space-y-6">
            {beneficio.info_bloques.map((b) => (
              <section
                key={b.id_info ?? `${b.bloque}-${b.nombre}`}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >
                <h2
                  className="text-xl sm:text-2xl font-bold mb-2"
                  style={{ color: colors.primary }}
                >
                  {b.nombre || `Bloque ${b.bloque}`}
                </h2>

                <div className="text-base sm:text-lg leading-relaxed text-slate-900 whitespace-pre-line">
                  {formatTextAsList(b.contenido)}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* 🗺️ Bloque del mapa + acciones */}
        {beneficio && (
          <section className="max-w-5xl mx-auto mt-10 bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2
                className="text-xl sm:text-2xl font-bold"
                style={{ color: colors.primary }}
              >
                ¿Dónde puedo acceder a este beneficio?
              </h2>

              <button
                type="button"
                onClick={() => setMapExpanded((v) => !v)}
                className="text-xs sm:text-sm px-3 py-1 rounded-full border border-slate-300 hover:bg-slate-100"
              >
                {mapExpanded ? "Ver mapa pequeño" : "Ver mapa grande"}
              </button>
            </div>

            <div
              className={
                mapExpanded
                  ? "space-y-4"
                  : "grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 items-stretch"
              }
            >
              {/* Contenedor del mapa */}
              <div className={mapExpanded ? "h-80 md:h-96" : "h-56"}>
                <MapaBeneficio slug={beneficio.slug} zoom={mapExpanded ? 16 : 15} />
              </div>

              {/* Acciones al lado del mapa (cuando está pequeño) */}
              <div className={mapExpanded ? "space-y-3" : "flex flex-col justify-between gap-4"}>
                <p className="text-sm sm:text-base text-slate-700">
                  Aquí puedes ver el lugar donde se entrega este beneficio. Acércate a la
                  sucursal o centro de salud para más información.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className="flex-1 py-3 rounded-2xl text-[16px] font-bold text-white"
                    style={{ backgroundColor: colors.dark }}
                  >
                    Postular
                  </button>

                  <button
                    className="flex-1 py-3 rounded-2xl text-[16px] font-semibold border border-slate-300 text-slate-800 hover:bg-slate-50"
                    type="button"
                  >
                    Saber más
                  </button>

                  <button
                    className="flex-1 py-3 rounded-2xl text-[16px] font-semibold border border-slate-300 text-slate-800 hover:bg-slate-50"
                    type="button"
                  >
                    Descargar ficha
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}


      </div>
    </InternalLayout>
  );
}
