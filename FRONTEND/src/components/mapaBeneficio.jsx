// src/components/mapaBeneficio.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapaBeneficio({ slug }) {
  const [organismoPrincipal, setOrganismoPrincipal] = useState(null);
  const [center, setCenter] = useState([-41.6169, -73.5956]); // respaldo
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
        if (!res.ok) throw new Error("No se pudieron cargar las sucursales");
        return res.json();
      })
      .then((data) => {
        if (data.length === 0) {
          setOrganismoPrincipal(null);
          return;
        }

        // 👇 Solo tomamos el primero
        const principal = data[0];
        setOrganismoPrincipal(principal);
        setCenter([principal.lat, principal.lng]);
      })
      .catch((err) => {
        console.error(err);
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

  if (!organismoPrincipal) {
    return (
      <p className="text-sm text-slate-500">
        Este beneficio actualmente no tiene una ubicación asociada.
      </p>
    );
  }

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

        <Marker position={[organismoPrincipal.lat, organismoPrincipal.lng]}>
          <Popup>
            <strong>{organismoPrincipal.nombre_sucursal}</strong>
            <br />
            {organismoPrincipal.direccion}
            <br />
            {organismoPrincipal.telefono && (
              <span>Tel: {organismoPrincipal.telefono}</span>
            )}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
