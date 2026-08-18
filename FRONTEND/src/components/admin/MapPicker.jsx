import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({ onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPicker({ lat, lng, onChange }) {
  const [position, setPosition] = useState([lat || -33.4489, lng || -70.6693]);

  useEffect(() => {
    if (lat && lng) setPosition([lat, lng]);
  }, [lat, lng]);

  const handlePositionChange = (newLat, newLng) => {
    setPosition([newLat, newLng]);
    onChange(newLat, newLng);
  };

  return (
    <div className="space-y-2">
      <div className="rounded-xl overflow-hidden border border-gray-300" style={{ height: "300px" }}>
        <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={markerIcon} />
          <MapClickHandler onPositionChange={handlePositionChange} />
        </MapContainer>
      </div>
      <p className="text-xs text-gray-500">Haz clic en el mapa para colocar las coordenadas</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Latitud</label>
          <input
            type="number"
            step="any"
            value={position[0]}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) handlePositionChange(v, position[1]);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Longitud</label>
          <input
            type="number"
            step="any"
            value={position[1]}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) handlePositionChange(position[0], v);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
