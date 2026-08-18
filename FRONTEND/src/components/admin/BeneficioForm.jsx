import { useState, useEffect } from "react";

export default function BeneficioForm({ data, categorias, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    requisitos: "",
    costo: 0,
    edad_minima: 0,
    icon_name: "",
    id_categoria: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        nombre: data.nombre || "",
        descripcion: data.descripcion || "",
        requisitos: data.requisitos || "",
        costo: data.costo ?? 0,
        edad_minima: data.edad_minima ?? 0,
        icon_name: data.icon_name || "",
        id_categoria: data.id_categoria || "",
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      costo: Number(form.costo),
      edad_minima: Number(form.edad_minima),
      id_categoria: Number(form.id_categoria),
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
          placeholder="Nombre del beneficio"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
        <select
          required
          value={form.id_categoria}
          onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Seleccionar categoría</option>
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
          placeholder="Descripción del beneficio..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Requisitos</label>
        <textarea
          rows={3}
          value={form.requisitos}
          onChange={(e) => setForm({ ...form, requisitos: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Requisitos para acceder..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Costo</label>
          <input
            type="number"
            min="0"
            value={form.costo}
            onChange={(e) => setForm({ ...form, costo: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Edad mínima</label>
          <input
            type="number"
            min="0"
            value={form.edad_minima}
            onChange={(e) => setForm({ ...form, edad_minima: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Icono (nombre del archivo SVG)</label>
        <input
          type="text"
          value={form.icon_name}
          onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ej: examen.svg"
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
          {data ? "Guardar cambios" : "Crear beneficio"}
        </button>
      </div>
    </form>
  );
}
