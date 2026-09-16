import { useState, useEffect, useRef } from "react";
import { Upload, X } from "lucide-react";

export default function InstitucionForm({ data, categorias, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    pagina_web: "",
    logo_url: "",
    email_contacto: "",
    id_categoria: "",
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

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
      if (data.logo_url) {
        if (data.logo_url.startsWith("http") || data.logo_url.startsWith("/")) {
          setLogoPreview(data.logo_url);
        } else {
          setLogoPreview(`/icons/instituciones/${data.logo_url}`);
        }
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
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(URL.createObjectURL(file));
    setForm({ ...form, logo_url: file.name });
  };

  const handleRemoveLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
    setForm({ ...form, logo_url: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, id_categoria: form.id_categoria ? Number(form.id_categoria) : null });
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
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
        <textarea spellCheck={false}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Logo (formato .SVG)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,.png,.jpg"
          onChange={handleFileChange}
          className="hidden"
          id="logo-upload"
        />
        {logoPreview ? (
          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <img src={logoPreview} alt="Preview" className="w-10 h-10 object-contain" />
            <span className="text-sm text-gray-600 flex-1 truncate">{form.logo_url}</span>
            <button type="button" onClick={handleRemoveLogo} className="text-red-400 hover:text-red-600">
              <X size={16} />
            </button>
          </div>
        ) : (
          <label
            htmlFor="logo-upload"
            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Upload size={18} className="text-gray-400" />
            <span className="text-sm text-gray-500">Seleccionar archivo</span>
          </label>
        )}
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
