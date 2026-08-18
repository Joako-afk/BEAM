import { useState, useEffect } from "react";

const COLORES_PREDEFINIDOS = [
  "#011991", "#669101", "#860707", "#860784",
  "#0077B6", "#2D6A4F", "#9B2226", "#6A0572",
  "#E63946", "#457B9D", "#2A9D8F", "#E9C46A",
];

export default function CategoriaForm({ data, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    color_primary: "#011991",
    icon_name: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        nombre: data.nombre || "",
        descripcion: data.descripcion || "",
        color_primary: data.color_primary || "#011991",
        icon_name: data.icon_name || "",
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
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
          placeholder="Ej: Salud y Bienestar"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          rows={3}
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Descripción de la categoría..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color principal</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {COLORES_PREDEFINIDOS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm({ ...form, color_primary: c })}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${form.color_primary === c ? "border-gray-800 scale-110" : "border-gray-200"}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <input
          type="color"
          value={form.color_primary}
          onChange={(e) => setForm({ ...form, color_primary: e.target.value })}
          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Icono (nombre del archivo SVG)</label>
        <input
          type="text"
          value={form.icon_name}
          onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ej: salud.svg"
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
          {data ? "Guardar cambios" : "Crear categoría"}
        </button>
      </div>
    </form>
  );
}
