import { useState, useEffect } from "react";

export default function InstitucionForm({ data, categorias, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    pagina_web: "",
    logo_url: "",
    email_contacto: "",
    id_categoria: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        nombre: data.nombre || "",
        descripcion: data.descripcion || "",
        pagina_web: data.pagina_web || "",
        logo_url: data.logo_url || "",
        email_contacto: data.email_contacto || "",
        id_categoria: data.id_categoria || "",
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, id_categoria: form.id_categoria ? Number(form.id_categoria) : null });
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
          placeholder="Nombre de la institución"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <select
          value={form.id_categoria}
          onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Sin categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          rows={3}
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Descripción de la institución..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Página web</label>
        <input
          type="url"
          value={form.pagina_web}
          onChange={(e) => setForm({ ...form, pagina_web: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL del logo</label>
        <input
          type="url"
          value={form.logo_url}
          onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://...logo.png"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email de contacto</label>
        <input
          type="email"
          value={form.email_contacto}
          onChange={(e) => setForm({ ...form, email_contacto: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="correo@ejemplo.com"
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
          {data ? "Guardar cambios" : "Crear institución"}
        </button>
      </div>
    </form>
  );
}
