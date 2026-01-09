// src/pages/beneficio.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { MapPin, Download, ExternalLink, FileCheck, Maximize2, Minimize2 } from "lucide-react"; 

import { generatePalette } from "../utils/generatePalette";
import { formatTextAsList } from "../utils/textoalista.jsx";
import InternalLayout from "../layouts/internal";
import MapaBeneficio from "../components/mapaBeneficio.jsx";
import { ButtonCard } from "../components/buttons.jsx"; // Mantenido como estaba

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

  const urlSaberMas = beneficio?.url_beneficio?.trim() || "";

  
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
  
        {/* REQUISITOS
            - Móvil: ocupa 2 columnas (igual que ahora)
            - PC: ocupa 2 columnas (queda grande a la izquierda) */}
        {requisitosTexto && (
          <section className="col-span-2 md:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 break-inside-avoid">
            <h2 className="text-xl font-bold mb-2 uppercase" style={{ color: colors.primary }}>
              Requisitos
            </h2>
            <div className="text-lg text-slate-900 leading-relaxed">
              {formatTextAsList(requisitosTexto)}
            </div>
          </section>
        )}

        {/* CONDICIONES (Edad + Costo combinados)
            - Móvil: mantiene tu lógica actual (dos cards en una fila 1.5fr/1fr)
            - PC: se convierte en columna derecha apilada (Edad arriba, Costo abajo) */}
        {(beneficio.edad_minima != null || beneficio.costo != null) && (
          <div
            className="
              col-span-2 md:col-span-1
              grid grid-cols-[1.5fr_1fr] gap-4 sm:gap-6 
              md:flex md:flex-col
            "
          >
            {/* EDAD */}
            {beneficio.edad_minima != null ? (
              <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col justify-start h-full break-inside-avoid">
                <h2 className="text-xl font-bold mb-1 uppercase leading-none" style={{ color: colors.primary }}>
                  Edad Mínima
                </h2>
                <p className="text-lg text-slate-900 leading-tight mt-1">{textoEdad}</p>
              </section>
            ) : (
              <div className="hidden md:block" />
            )}

            {/* COSTO */}
            {beneficio.costo != null ? (
              <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col justify-start h-full break-inside-avoid">
                <h2 className="text-xl font-bold mb-1 uppercase leading-none" style={{ color: colors.primary }}>
                  Costo
                </h2>
                <p className="text-lg text-slate-900 leading-tight mt-1">{textoCosto}</p>
              </section>
            ) : (
              <div className="hidden md:block" />
            )}
          </div>
        )}

        {/* OTROS BLOQUES
            - Móvil: siguen ocupando 2 columnas (igual que tú)
            - PC: quedan en 1 columna cada uno (3 columnas totales) */}
        {beneficio.info_bloques && beneficio.info_bloques.map((info) => (
          <section key={info.id_info} className="col-span-2 md:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 break-inside-avoid">
            <h2 className="text-xl font-bold mb-2 uppercase" style={{ color: colors.primary }}>
              {info.nombre}
            </h2>
            <div className="text-lg text-slate-900 leading-relaxed">
              {formatTextAsList(info.contenido)}
            </div>
          </section>
        ))}
      </div>



        {/* MAPA Y BOTONES */}
        <section className="max-w-5xl mx-auto mt-10 bg-white rounded-3xl p-6 sm:p-7 shadow-md border border-gray-100 break-inside-avoid">
          <h2 className="text-2xl font-bold uppercase mb-4" style={{ color: colors.primary }}>
            ¿Dónde puedo acceder a este beneficio?
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[1fr_auto] gap-8">
            <div className="flex flex-col gap-4 order-1 lg:row-span-2">
              <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 ${mapExpanded ? "h-[410px]" : "h-64"}`}>
                <button 
                  onClick={() => setMapExpanded(!mapExpanded)} 
                  className="absolute top-3 right-3 z-10 px-4 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition-all hover:opacity-90 active:scale-95 flex items-center gap-2 print:hidden"
                  style={{ backgroundColor: colors.secondary }}
                >
                  {mapExpanded ? (
                    <><Minimize2 size={16} /> Achicar</>
                  ) : (
                    <><Maximize2 size={16} /> Agrandar</>
                  )}
                </button>
                <div id="map-interactive" className="w-full h-full">
                  <MapaBeneficio slug={beneficio.slug} zoom={15} mapExpanded={mapExpanded} onLoadOrganismos={setOrganismos} onMapReady={setLeafletMap} />
                </div>
                <img id="map-snapshot" alt="" className="w-full h-full object-cover hidden" />
              </div>
            </div>

            <div className="mb-6 order-3 lg:order-2 print:order-none">
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

            <div className="grid grid-cols-2 gap-4 mt-auto order-2 lg:order-3 print:hidden">
                <ButtonCard text="Postular" icon={FileCheck} color={colors.secondary} disabled={true} />
                <ButtonCard text="Saber más" icon={ExternalLink} color={colors.tertiary} href={urlSaberMas} disabled={!urlSaberMas} />
                <ButtonCard text="Cómo llegar" icon={MapPin} color={colors.tertiary} href={sucursal ? `https://www.google.com/maps/dir/?api=1&destination=${sucursal.lat},${sucursal.lng}` : null} disabled={!sucursal} />
                <ButtonCard text="Descargar" icon={Download} color={colors.secondary} 
                  onClick={() => {
                    const titleNode = document.querySelector("[data-pdf-title]");
                    const pageTitle = titleNode?.textContent || "beneficio";
                    const originalTitle =document.title;
                    document.title = pageTitle;
                    window.print();
                    setTimeout(() => {
                      document.title = originalTitle;
                    }, 500);
                  }
                  
                  } />
            </div>
          </div>
        </section>
      </div>
    </InternalLayout>
  );
}