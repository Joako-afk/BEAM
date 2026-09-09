import { useState, useEffect } from "react";

export default function TerritorioForm({ data, regiones, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    tipo: "REGION",
    id_padre: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        nombre: data.nombre || "",
        tipo: data.tipo || "REGION",
        id_padre: data.id_padre || "",
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      nombre: form.nombre,
      tipo: form.tipo,
      id_padre: form.tipo === "COMUNA" ? Number(form.id_padre) : null,
    });
  };

  const esEdicion = !!data;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input
          type="text"
          required
          maxLength={100}
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nombre del territorio"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
        <select
          required
          disabled={esEdicion}
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value, id_padre: "" })}
          className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${esEdicion ? "bg-gray-100 cursor-not-allowed" : ""}`}
        >
          <option value="REGION">Región</option>
          <option value="COMUNA" disabled={!esEdicion && regiones.length === 0}>Comuna</option>
        </select>
        {esEdicion && <p className="text-xs text-gray-500 mt-1">El tipo no se puede cambiar</p>}
      </div>

      {form.tipo === "COMUNA" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Región padre *</label>
          {regiones.length === 0 ? (
            <p className="text-sm text-amber-600">Primero debe crear una región</p>
          ) : (
            <select
              required
              value={form.id_padre}
              onChange={(e) => setForm({ ...form, id_padre: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar región</option>
              {regiones.map((r) => (
                <option key={r.id_divter} value={r.id_divter}>{r.nombre}</option>
              ))}
            </select>
          )}
        </div>
      )}

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
          {data ? "Guardar cambios" : "Crear territorio"}
        </button>
      </div>
    </form>
  );
}
