import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Search, X, Upload, ChevronDown, Check } from "lucide-react";

export default function BeneficioForm({ data, categorias, comunas, organismos, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    requisitos: "",
    costo: 0,
    edad_minima: 0,
    icon_name: "",
    id_categoria: "",
    comunasSeleccionadas: [],
    organismosSeleccionados: [],
    infoBloques: [],
  });

  const [comunaSearch, setComunaSearch] = useState("");
  const [organismoSearch, setOrganismoSearch] = useState("");
  const [iconPreview, setIconPreview] = useState(null);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const catDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

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
        comunasSeleccionadas: data.comunasSeleccionadas || [],
        organismosSeleccionados: data.organismosSeleccionados || [],
        infoBloques: data.infoBloques || [],
      });
      if (data.icon_name) {
        setIconPreview(`/icons/beneficios/${data.icon_name}`);
      }
    }
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target)) {
        setCatDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    if (iconPreview) URL.revokeObjectURL(iconPreview);
    setIconPreview(URL.createObjectURL(file));
    setForm({ ...form, icon_name: file.name });
  };

  const handleRemoveIcon = () => {
    if (iconPreview) URL.revokeObjectURL(iconPreview);
    setIconPreview(null);
    setForm({ ...form, icon_name: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      nombre: form.nombre,
      descripcion: form.descripcion,
      requisitos: form.requisitos,
      costo: Number(form.costo),
      edad_minima: Number(form.edad_minima),
      icon_name: form.icon_name,
      id_categoria: Number(form.id_categoria),
      comunas: form.comunasSeleccionadas,
      organismos: form.organismosSeleccionados,
      info_bloques: form.infoBloques.filter((b) => b.nombre || b.contenido),
    });
  };

  const toggleComuna = (idDivter) => {
    setForm((prev) => {
      const actual = prev.comunasSeleccionadas.includes(idDivter)
        ? prev.comunasSeleccionadas.filter((id) => id !== idDivter)
        : [...prev.comunasSeleccionadas, idDivter];
      return { ...prev, comunasSeleccionadas: actual };
    });
  };

  const toggleOrganismo = (idOrganismo) => {
    setForm((prev) => {
      const actual = prev.organismosSeleccionados.includes(idOrganismo)
        ? prev.organismosSeleccionados.filter((id) => id !== idOrganismo)
        : [...prev.organismosSeleccionados, idOrganismo];
      return { ...prev, organismosSeleccionados: actual };
    });
  };

  const addInfoBloque = () => {
    setForm((prev) => ({
      ...prev,
      infoBloques: [...prev.infoBloques, { nombre: "", contenido: "" }],
    }));
  };

  const updateInfoBloque = (index, field, value) => {
    setForm((prev) => {
      const bloques = [...prev.infoBloques];
      bloques[index] = { ...bloques[index], [field]: value };
      return { ...prev, infoBloques: bloques };
    });
  };

  const removeInfoBloque = (index) => {
    setForm((prev) => ({
      ...prev,
      infoBloques: prev.infoBloques.filter((_, i) => i !== index),
    }));
  };

  const comunasFiltradas = (comunas || []).filter((c) =>
    c.nombre.toLowerCase().includes(comunaSearch.toLowerCase())
  );

  const selectedCategoria = (categorias || []).find((c) => String(c.id_categoria) === String(form.id_categoria));

  const organismosFiltrados = (organismos || []).filter((o) =>
    o.nombre_sucursal?.toLowerCase().includes(organismoSearch.toLowerCase()) ||
    o.direccion?.toLowerCase().includes(organismoSearch.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input
          type="text"
          required
          maxLength={200}
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nombre del beneficio"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
        <div ref={catDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setCatDropdownOpen(!catDropdownOpen)}
            className="w-full flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {selectedCategoria ? (
              <>
                <span className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: selectedCategoria.color_primary }} />
                <span className="flex-1">{selectedCategoria.nombre}</span>
              </>
            ) : (
              <span className="flex-1 text-gray-400">Seleccionar categoría</span>
            )}
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${catDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {catDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {(categorias || []).map((cat) => (
                <button
                  key={cat.id_categoria}
                  type="button"
                  onClick={() => {
                    setForm({ ...form, id_categoria: cat.id_categoria });
                    setCatDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-left"
                >
                  <span className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: cat.color_primary }} />
                  <span className="flex-1">{cat.nombre}</span>
                  {String(form.id_categoria) === String(cat.id_categoria) && <Check size={14} className="text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea spellCheck={false}
          rows={3}
          maxLength={2000}
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Descripción del beneficio..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Requisitos</label>
        <textarea spellCheck={false}
          rows={3}
          maxLength={2000}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Icono (formato .SVG)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,.png,.jpg"
          onChange={handleFileChange}
          className="hidden"
          id="beneficio-icon-upload"
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
            htmlFor="beneficio-icon-upload"
            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Upload size={18} className="text-gray-400" />
            <span className="text-sm text-gray-500">Seleccionar archivo</span>
          </label>
        )}
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Comunas</h4>
        {comunas.length === 0 ? (
          <p className="text-sm text-amber-600">No hay comunas disponibles</p>
        ) : (
          <>
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={comunaSearch}
                onChange={(e) => setComunaSearch(e.target.value)}
                placeholder="Buscar comuna..."
                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
              {comunasFiltradas.map((c) => (
                <label key={c.id_divter} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded px-2 py-1">
                  <input
                    type="checkbox"
                    checked={form.comunasSeleccionadas.includes(c.id_divter)}
                    onChange={() => toggleComuna(c.id_divter)}
                    className="rounded"
                  />
                  {c.nombre}
                </label>
              ))}
            </div>
            {form.comunasSeleccionadas.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{form.comunasSeleccionadas.length} comuna(s) seleccionada(s)</p>
            )}
          </>
        )}
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Organismos</h4>
        {organismos.length === 0 ? (
          <p className="text-sm text-amber-600">No hay organismos disponibles</p>
        ) : (
          <>
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={organismoSearch}
                onChange={(e) => setOrganismoSearch(e.target.value)}
                placeholder="Buscar organismo..."
                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
              {organismosFiltrados.map((o) => (
                <label key={o.id_organismo} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded px-2 py-1">
                  <input
                    type="checkbox"
                    checked={form.organismosSeleccionados.includes(o.id_organismo)}
                    onChange={() => toggleOrganismo(o.id_organismo)}
                    className="rounded"
                  />
                  <span>{o.nombre_sucursal}</span>
                  {o.institucion_nombre && <span className="text-gray-400 text-xs">({o.institucion_nombre})</span>}
                </label>
              ))}
            </div>
            {form.organismosSeleccionados.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{form.organismosSeleccionados.length} organismo(s) seleccionado(s)</p>
            )}
          </>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700">Información Extra</h4>
          <button
            type="button"
            onClick={addInfoBloque}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
          >
            <Plus size={14} /> Agregar bloque
          </button>
        </div>
        {form.infoBloques.length === 0 ? (
          <p className="text-xs text-gray-400">No hay bloques de información</p>
        ) : (
          <div className="space-y-3">
            {form.infoBloques.map((bloque, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Bloque {i + 1}</span>
                  <button type="button" onClick={() => removeInfoBloque(i)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={bloque.nombre}
                  onChange={(e) => updateInfoBloque(i, "nombre", e.target.value)}
                  placeholder="Nombre del bloque"
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                />
                <textarea spellCheck={false}
                  rows={2}
                  value={bloque.contenido}
                  onChange={(e) => updateInfoBloque(i, "contenido", e.target.value)}
                  placeholder="Contenido..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
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
          {data ? "Guardar cambios" : "Crear beneficio"}
        </button>
      </div>
    </form>
  );
}
