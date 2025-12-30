// src/pages/beneficio.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { MapPin, Download, ExternalLink, FileCheck } from "lucide-react"; 
import { exportBeneficioPdf } from "../utils/pdf.js";
import { generatePalette } from "../utils/generatePalette";
import { formatTextAsList } from "../utils/textoalista.jsx";
import InternalLayout from "../layouts/internal";
import MapaBeneficio from "../components/mapaBeneficio.jsx";
import { ButtonCard } from "../components/Buttons.jsx"; // Mantenido como estaba

export default function Beneficio() {
  const { slug } = useParams();
  const location = useLocation();

  const [organismos, setOrganismos] = useState(null);
  const [beneficio, setBeneficio] = useState(null);
  const [colors, setColors] = useState(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [leafletMap, setLeafletMap] = useState(null);

  // 1. Carga de colores
  useEffect(() => {
    const fromState = location.state?.colors;
    if (fromState) {
      setColors(fromState);
      updateCssVariables(fromState);
    }
  }, [location.state, slug]);

  // 2. Carga de datos
  useEffect(() => {
    fetch(`http://localhost:4000/api/beneficios/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setBeneficio(data);
        if (!location.state?.colors && data.color_primary) {
          const palette = generatePalette(data.color_primary);
          setColors(palette);
          updateCssVariables(palette);
        }
      });
  }, [slug, location.state]);

  const updateCssVariables = (palette) => {
    document.documentElement.style.setProperty("--primary", palette.primary);
    document.documentElement.style.setProperty("--secondary", palette.secondary);
    document.documentElement.style.setProperty("--tertiary", palette.tertiary);
    document.documentElement.style.setProperty("--light", palette.light);
    document.documentElement.style.setProperty("--text", palette.text);
  };

  const descargarPDF = async () => {
    if (pdfLoading) return;
    setPdfLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      await exportBeneficioPdf({
        filename: `beneficio-${beneficio?.slug || "detalle"}.pdf`,
        leafletMap,
        containerId: "pdf-beneficio",
        mapInteractiveId: "map-interactive",
        mapSnapshotId: "map-snapshot",
      });
    } catch (e) {
      console.error(e);
      alert("No se pudo generar el PDF. Verifica la conexión del mapa.");
    } finally {
      setPdfLoading(false);
    }
  };

  if (!beneficio || !colors) return <p className="pt-28 text-center">Cargando...</p>;

  const requisitosTexto = beneficio.requisitos || beneficio.requesitos;
  const sucursal = organismos && organismos.length > 0 ? organismos[0] : null;

  const textoEdad = beneficio.edad_minima ? `${beneficio.edad_minima} años` : "";
  const textoCosto = beneficio.costo != null 
    ? (beneficio.costo === 0 ? "Gratuito" : `$${beneficio.costo}`) 
    : "";
  
  return (
    <InternalLayout title={beneficio.nombre}>
      
      <div 
        id="pdf-beneficio" 
        className="min-h-screen px-4 sm:px-8 pb-24" // Mantenido sin pt-6 como pediste
        style={{ backgroundColor: "var(--light)" }}
      >
        
        {/* CABECERA */}
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="rounded-2xl p-4 flex items-center justify-center shrink-0 border-[10px]"
            style={{ backgroundColor: colors.light, borderColor: colors.primary, width: "120px", height: "120px" }}>
             {beneficio.icon_name ? (
                <img src={`/icons/beneficios/${beneficio.icon_name}`} alt="Icono" className="w-20 h-20 object-contain" />
              ) : <div className="text-4xl">📌</div>}
          </div>
          <p className="text-lg sm:text-xl text-slate-900 leading-relaxed flex-1">{beneficio.descripcion}</p>
        </div>

        {/* GRID DE BLOQUES */}
        <div className="max-w-5xl mx-auto mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* REQUISITOS */}
          {requisitosTexto && (
            <section className="col-span-2 md:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-2 uppercase" style={{ color: colors.primary }}>Requisitos</h2>
              <div className="text-lg text-slate-900 leading-relaxed">{formatTextAsList(requisitosTexto)}</div>
            </section>
          )}

          {/* === APLICADA MEJORA 3: CONTENEDOR HÍBRIDO (Edad + Costo) === */}
          {(beneficio.edad_minima != null || beneficio.costo != null) && (
            <div className="
              col-span-2 md:col-span-2 
              grid 
              grid-cols-[1.5fr_1fr] md:grid-cols-2 
              gap-4 sm:gap-6 items-start
            ">
              
              {/* EDAD (Se lleva la parte más ancha en móvil para que quepa el título) */}
              {beneficio.edad_minima != null ? (
                <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col justify-start h-full">
                  <h2 className="text-xl font-bold mb-1 uppercase leading-none" style={{ color: colors.primary }}>
                    Edad Mínima
                  </h2>
                  <p className="text-lg text-slate-900 leading-tight mt-1">{textoEdad}</p>
                </section>
              ) : <div className="hidden md:block"></div>}

              {/* COSTO (Se lleva la parte más angosta en móvil) */}
              {beneficio.costo != null ? (
                <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col justify-start h-full">
                  <h2 className="text-xl font-bold mb-1 uppercase leading-none" style={{ color: colors.primary }}>
                    Costo
                  </h2>
                  <p className="text-lg text-slate-900 leading-tight mt-1">{textoCosto}</p>
                </section>
              ) : <div className="hidden md:block"></div>}

            </div>
          )}

          {/* OTROS BLOQUES */}
          {beneficio.info_bloques && beneficio.info_bloques.map((info) => (
            <section key={info.id_info} className="col-span-2 md:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-2 uppercase" style={{ color: colors.primary }}>
                {info.nombre}
              </h2>
              <div className="text-lg text-slate-900 leading-relaxed">{formatTextAsList(info.contenido)}</div>
            </section>
          ))}
        </div>

        {/* MAPA Y BOTONES */}
        <section className="max-w-5xl mx-auto mt-10 bg-white rounded-3xl p-6 sm:p-7 shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold uppercase mb-4" style={{ color: colors.primary }}>
            ¿Dónde puedo acceder a este beneficio?
          </h2>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-4">
              <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 ${mapExpanded ? "h-[410px]" : "h-64"}`}>
                <button onClick={() => setMapExpanded(!mapExpanded)} className="absolute top-2 right-2 z-10 bg-white px-3 py-1 text-xs font-bold rounded-full shadow-md">
                  {mapExpanded ? "Achicar" : "Agrandar"}
                </button>
                <div id="map-interactive" className="w-full h-full">
                  <MapaBeneficio slug={beneficio.slug} zoom={15} mapExpanded={mapExpanded} onLoadOrganismos={setOrganismos} onMapReady={setLeafletMap} />
                </div>
                <img id="map-snapshot" alt="" className="w-full h-full object-cover hidden" />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="mb-6">
                <p className="text-xl text-slate-900 mb-4 leading-relaxed">
                  Aquí puedes ver el lugar donde se entrega este beneficio. 
                  Acércate a la sucursal o centro de salud para más información.
                </p>
                {sucursal ? (
                  <div className="bg-slate-50 p-4 rounded-xl border-l-4" style={{ borderColor: colors.secondary }}>
                    <p className="font-bold text-slate-800 text-lg">{sucursal.nombre_sucursal}</p>
                    <p className="text-slate-600 text-lg">{sucursal.direccion}</p>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Ubicación no disponible.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                <ButtonCard text="Postular" icon={FileCheck} color={colors.secondary} onClick={() => alert("Formulario de postulación...")} />
                <ButtonCard text="Saber más" icon={ExternalLink} color={colors.tertiary} href={sucursal?.url || "https://www.chileatiende.gob.cl"} />
                <ButtonCard text="Cómo llegar" icon={MapPin} color={colors.tertiary} href={sucursal ? `https://www.google.com/maps/dir/?api=1&destination=${sucursal.lat},${sucursal.lng}` : null} disabled={!sucursal} />
                <ButtonCard text="Descargar" icon={Download} color={colors.secondary} onClick={descargarPDF} loading={pdfLoading} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </InternalLayout>
  );
}