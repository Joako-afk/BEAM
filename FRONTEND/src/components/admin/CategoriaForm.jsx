import { useState, useEffect, useRef } from "react";
import { Upload, X } from "lucide-react";

const COLORES_PREDEFINIDOS = [
  "#011991", "#669101", "#860707", "#860784",
  "#0077B6", "#2D6A4F", "#9B2226", "#6A0572",
  "#E63946", "#457B9D", "#2A9D8F", "#E9C46A",
];

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

export default function CategoriaForm({ data, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    color_primary: "#011991",
    icon_name: "",
  });
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      setForm({
        nombre: data.nombre || "",
        descripcion: data.descripcion || "",
        color_primary: data.color_primary || "#011991",
        icon_name: data.icon_name || "",
      });
      if (data.icon_name) {
        setIconPreview(`/icons/categorias/${data.icon_name}`);
      }
    }
  }, [data]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("El archivo no puede superar 2MB");
      return;
    }
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["svg", "png", "jpg"].includes(ext)) {
      alert("Formato no válido. Use SVG, PNG o JPG");
      return;
    }
    setIconFile(file);
    if (iconPreview) URL.revokeObjectURL(iconPreview);
    setIconPreview(URL.createObjectURL(file));
    setForm({ ...form, icon_name: file.name });
  };

  const handleRemoveIcon = () => {
    setIconFile(null);
    setIconPreview(null);
    setForm({ ...form, icon_name: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
        <textarea spellCheck={false}
          rows={3}
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Descripción de la categoría..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color principal</label>
        <div className="space-y-1 mb-3">
          {COLORES_PREDEFINIDOS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm({ ...form, color_primary: c })}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${form.color_primary === c ? "bg-blue-50 ring-2 ring-blue-500" : "hover:bg-gray-50"}`}
            >
              <span className="w-5 h-5 rounded border border-gray-200 flex-shrink-0" style={{ backgroundColor: c }} />
              <span className="font-mono text-gray-600">{c}</span>
              <span className="text-gray-400">,</span>
              <span className="font-mono text-gray-400">{hexToRgb(c)}</span>
            </button>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Icono (formato .SVG)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,.png,.jpg"
          onChange={handleFileChange}
          className="hidden"
          id="icon-upload"
        />
        {iconPreview ? (
          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <img src={iconPreview} alt="Preview" className="w-10 h-10 object-contain" />
            <span className="text-sm text-gray-600 flex-1 truncate">{form.icon_name}</span>
            <button type="button" onClick={handleRemoveIcon} className="text-red-400 hover:text-red-600">
              <X size={16} />
            </button>
          </div>
        ) : (
          <label
            htmlFor="icon-upload"
            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Upload size={18} className="text-gray-400" />
            <span className="text-sm text-gray-500">Seleccionar archivo</span>
          </label>
        )}
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
