import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

function RecenterOnResize({ center, zoom, mapExpanded }) {
  const map = useMap();

  useEffect(() => {
    // Leaflet necesita recalcular el tamaño cuando cambia la altura por CSS
    // (y con transición, conviene darle un pelín de tiempo)
    const t = setTimeout(() => {
      map.invalidateSize();

      // Cuando pasa a pequeño, lo centramos en el punto
      if (!mapExpanded && center) {
        map.setView(center, zoom, { animate: true });
      }
    }, 120);

    return () => clearTimeout(t);
  }, [map, center, zoom, mapExpanded]);

  return null;
}

export default function MapaBeneficio({ slug, zoom = 16, mapExpanded }) {
  const [organismos, setOrganismos] = useState([]);
  const [center, setCenter] = useState([-41.6169, -73.5956]); // Puerto Varas aprox
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    fetch(
      `http://localhost:4000/api/beneficios/${encodeURIComponent(slug)}/organismos`
    )
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las sucursales");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          setOrganismos([]);
          return;
        }

        setOrganismos(data);

        // Mantengo tu truco: el JSON viene “al revés”
        const o0 = data[0];
        setCenter([o0.lng, o0.lat]);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-slate-500 rounded-2xl border border-slate-200">
        Cargando ubicación del beneficio…
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-red-500 rounded-2xl border border-red-200">
        {error}
      </div>
    );
  }

  if (!organismos || organismos.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-slate-500 rounded-2xl border border-dashed border-slate-300">
        Este beneficio aún no tiene una ubicación asociada.
      </div>
    );
  }

  const o = organismos[0];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* ✅ esto hace que al achicar se centre en el punto */}
        <RecenterOnResize center={center} zoom={zoom} mapExpanded={mapExpanded} />

        <Marker position={center}>
          <Popup>
            <strong>{o.nombre_sucursal}</strong>
            <br />
            {o.direccion}
            <br />
            {o.telefono && <span>Tel: {o.telefono}</span>}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
