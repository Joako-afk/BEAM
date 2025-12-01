// src/components/mapaBeneficio.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapaBeneficio({ slug }) {
  const [organismos, setOrganismos] = useState([]);
  const [center, setCenter] = useState([-41.6169, -73.5956]); // respaldo (Puerto Varas aprox)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    fetch(
      `http://localhost:4000/api/beneficios/${encodeURIComponent(
        slug
      )}/organismos`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudieron cargar las sucursales");
        }
        return res.json();
      })
      .then((data) => {
        console.log("organismos desde backend:", data);
        if (Array.isArray(data) && data.length > 0) {
          setOrganismos(data);

          // 👇 OJO: usamos [lng, lat] como [lat, lng] porque vienen invertidos
          const o0 = data[0];
          setCenter([o0.lng, o0.lat]);
        } else {
          setOrganismos([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando organismos:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <p className="text-sm text-slate-500">Cargando ubicación del beneficio…</p>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!Array.isArray(organismos) || organismos.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Este beneficio actualmente no tiene una ubicación asociada.
      </p>
    );
  }

  const o = organismos[0]; // solo 1 punto

  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* 👇 Igual que center: [lng, lat] como [lat, lng] */}
        <Marker position={[o.lng, o.lat]}>
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
