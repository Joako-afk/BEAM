import { useState, useEffect } from "react";
import MapPicker from "./MapPicker";

export default function OrganismoForm({ data, instituciones, territorios, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nombre_sucursal: "",
    tipo: "",
    direccion: "",
    telefono: "",
    lng: -70.6693,
    lat: -33.4489,
    id_institucion: "",
    id_divter: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        nombre_sucursal: data.nombre_sucursal || "",
        tipo: data.tipo || "",
        direccion: data.direccion || "",
        telefono: data.telefono || "",
        lng: data.lng ?? -70.6693,
        lat: data.lat ?? -33.4489,
        id_institucion: data.id_institucion || "",
        id_divter: data.id_divter || "",
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      lng: Number(form.lng),
      lat: Number(form.lat),
      id_institucion: form.id_institucion ? Number(form.id_institucion) : null,
      id_divter: form.id_divter ? Number(form.id_divter) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la sucursal *</label>
        <input
          type="text"
          required
          value={form.nombre_sucursal}
          onChange={(e) => setForm({ ...form, nombre_sucursal: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ej: ChileAtiende - Sucursal Puerto Varas"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <input
            type="text"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Oficina de Atención"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input
            type="text"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+56229654000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
        <input
          type="text"
          value={form.direccion}
          onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Calle San José 123"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Institución</label>
          <select
            value={form.id_institucion}
            onChange={(e) => setForm({ ...form, id_institucion: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sin institución</option>
            {instituciones.map((inst) => (
              <option key={inst.id_institucion} value={inst.id_institucion}>{inst.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Territorio</label>
          <select
            value={form.id_divter}
            onChange={(e) => setForm({ ...form, id_divter: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sin territorio</option>
            {territorios.map((t) => (
              <option key={t.id_divter} value={t.id_divter}>{t.nombre} ({t.tipo})</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación en el mapa</label>
        <MapPicker
          lat={form.lat}
          lng={form.lng}
          onChange={(newLat, newLng) => setForm({ ...form, lat: newLat, lng: newLng })}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {data ? "Guardar cambios" : "Crear organismo"}
        </button>
      </div>
    </form>
  );
}
