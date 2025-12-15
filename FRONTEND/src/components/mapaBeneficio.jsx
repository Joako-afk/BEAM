// src/components/mapaBeneficio.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

// 1. Componente para reportar al padre que el mapa cargó (para PDF)
function MapReady({ onMapReady }) {
  const map = useMap();
  useEffect(() => {
    onMapReady?.(map);
  }, [map, onMapReady]);
  return null;
}

// 2. Componente CRÍTICO: Fuerza al mapa a moverse si cambian las coordenadas
function Recenter({ lat, lng, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    // Si las coordenadas son válidas, movemos la cámara
    if (lat && lng) {
      map.setView([lat, lng], zoom);
    }
  }, [lat, lng, zoom, map]);

  return null;
}

// 3. Componente para recalcular tamaño al expandir (Agrandar/Achicar)
function MapResizer({ isExpanded }) {
  const map = useMap();

  useEffect(() => {
    // Esperamos a que la animación de Tailwind termine (300ms)
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return () => clearTimeout(timer);
  }, [isExpanded, map]);

  return null;
}

export default function MapaBeneficio({
  slug,
  zoom = 15,
  mapExpanded, // Recibimos el estado de expansión
  onLoadOrganismos,
  onMapReady,
}) {
  const [organismos, setOrganismos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    
    fetch(`http://localhost:4000/api/beneficios/${encodeURIComponent(slug)}/organismos`)
      .then((res) => {
        if (!res.ok) throw new Error("Error cargando ubicación");
        return res.json();
      })
      .then((data) => {
        const safe = Array.isArray(data) ? data : [];
        setOrganismos(safe);
        onLoadOrganismos?.(safe);
      })
      .catch((err) => {
        console.error(err);
        setError("Ubicación no disponible");
      })
      .finally(() => setLoading(false));
  }, [slug, onLoadOrganismos]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500 animate-pulse">
        Cargando mapa...
      </div>
    );
  }

  if (error || !organismos || organismos.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-200">
        Sin ubicación disponible
      </div>
    );
  }

  const o = organismos[0];

  return (
    // IMPORTANTE: El z-index 0 evita que tape el menú
    <div className="w-full h-full relative z-0">
      <MapContainer
        // Centro inicial (Latitud, Longitud)
        center={[o.lat, o.lng]} 
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* --- CONTROLADORES DEL MAPA --- */}
        
        {/* 1. Forzar recentrado si cambian las coordenadas o el zoom */}
        <Recenter lat={o.lat} lng={o.lng} zoom={zoom} />

        {/* 2. Recalcular tamaño si se expande el contenedor */}
        <MapResizer isExpanded={mapExpanded} />

        {/* 3. Notificar que está listo (PDF) */}
        <MapReady onMapReady={onMapReady} />

        {/* Marcador */}
        <Marker position={[o.lat, o.lng]}>
          <Popup>
            <div className="text-center">
              <strong className="block text-sm mb-1">{o.nombre_sucursal}</strong>
              <span className="text-xs text-gray-600">{o.direccion}</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}