import { useState, useEffect } from "react";

export default function InformacionForm({ data, beneficios, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    bloque: 1,
    nombre: "",
    contenido: "",
    id_beneficio: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        bloque: data.bloque ?? 1,
        nombre: data.nombre || "",
        contenido: data.contenido || "",
        id_beneficio: data.id_beneficio || "",
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      bloque: Number(form.bloque),
      id_beneficio: form.id_beneficio ? Number(form.id_beneficio) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input
          type="text"
          required
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ej: ¿Dónde está presente?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Beneficio asociado</label>
        <select
          value={form.id_beneficio}
          onChange={(e) => setForm({ ...form, id_beneficio: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Sin beneficio asociado</option>
          {beneficios.map((b) => (
            <option key={b.id_beneficio} value={b.id_beneficio}>{b.nombre}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bloque (orden)</label>
          <input
            type="number"
            min="1"
            value={form.bloque}
            onChange={(e) => setForm({ ...form, bloque: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
        <textarea
          rows={4}
          required
          value={form.contenido}
          onChange={(e) => setForm({ ...form, contenido: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Contenido del bloque de información..."
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
          {data ? "Guardar cambios" : "Crear información"}
        </button>
      </div>
    </form>
  );
}
