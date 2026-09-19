import { useState, useEffect, useRef } from "react";
import { Upload, X } from "lucide-react";

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const rgbToHex = (r, g, b) => {
  const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
  const [rgbText, setRgbText] = useState("");

  useEffect(() => {
    if (form.color_primary && form.color_primary.length === 7) {
      const { r, g, b } = hexToRgb(form.color_primary);
      setRgbText(`${r}, ${g}, ${b}`);
    }
  }, [form.color_primary]);

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
        <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
          <input
            type="color"
            value={form.color_primary}
            onChange={(e) => setForm({ ...form, color_primary: e.target.value })}
            className="w-full h-20 rounded-lg border border-gray-300 cursor-pointer p-0 mb-4"
          />
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm font-medium text-gray-500 w-10">HEX</label>
            <input
              type="text"
              value={form.color_primary}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                  setForm({ ...form, color_primary: val });
                }
              }}
              maxLength={7}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="#000000"
            />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm font-medium text-gray-500 w-10">RGB</label>
            <input
              type="text"
              value={rgbText}
              onChange={(e) => {
                const val = e.target.value;
                setRgbText(val);
                const match = val.match(/^\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*$/);
                if (match) {
                  const r = parseInt(match[1]);
                  const g = parseInt(match[2]);
                  const b = parseInt(match[3]);
                  if (r <= 255 && g <= 255 && b <= 255) {
                    setForm({ ...form, color_primary: rgbToHex(r, g, b) });
                  }
                }
              }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0, 0, 0"
            />
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <div
              className="px-4 py-6 text-center"
              style={{ backgroundColor: form.color_primary }}
            >
              <p className="text-white font-bold text-sm uppercase">
                {form.nombre || "Categoría de ejemplo"}
              </p>
            </div>
          </div>
        </div>
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
