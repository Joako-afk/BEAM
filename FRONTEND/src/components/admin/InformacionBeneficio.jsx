import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "./Modal";

const API = "http://localhost:4000/api/admin";

export default function InformacionBeneficio({ beneficio, onClose }) {
  const [bloques, setBloques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalForm, setModalForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchBloques = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/informacion?id_beneficio=${beneficio.id_beneficio}`);
      setBloques(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBloques(); }, [beneficio.id_beneficio]);

  const handleCreate = () => { setEditing(null); setModalForm(true); };
  const handleEdit = (item) => { setEditing(item); setModalForm(true); };
  const handleCloseForm = () => { setModalForm(false); setEditing(null); };

  const handleSubmit = async (form) => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/informacion/${editing.id_info}` : `${API}/informacion`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id_beneficio: beneficio.id_beneficio }),
    });
    handleCloseForm();
    fetchBloques();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await fetch(`${API}/informacion/${confirmDelete}`, { method: "DELETE" });
    setConfirmDelete(null);
    fetchBloques();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Bloques de información para:</p>
          <p className="font-semibold text-gray-800 text-sm">{beneficio.nombre}</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
        >
          <Plus size={14} />
          Nuevo bloque
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-4 text-center">Cargando...</p>
      ) : bloques.length === 0 ? (
        <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-xl">
          <p className="text-sm">No hay bloques de información</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bloques.map((b) => (
            <div key={b.id_info} className="border border-gray-200 rounded-xl p-3 hover:bg-gray-50">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">BLOQUE {b.bloque}</span>
                    <span className="text-sm font-medium text-gray-800">{b.nombre}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{b.contenido}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleEdit(b)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setConfirmDelete(b.id_info)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cerrar
        </button>
      </div>

      {/* Modal form */}
      <Modal isOpen={modalForm} onClose={handleCloseForm} title={editing ? "Editar bloque" : "Nuevo bloque"}>
        <FormBloque data={editing} onSubmit={handleSubmit} onCancel={handleCloseForm} />
      </Modal>

      {/* Confirm delete */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Eliminar bloque">
        <p className="text-sm text-gray-600 mb-4">¿Eliminar este bloque de información?</p>
        <div className="flex gap-3">
          <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}

function FormBloque({ data, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    bloque: 1,
    nombre: "",
    contenido: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        bloque: data.bloque ?? 1,
        nombre: data.nombre || "",
        contenido: data.contenido || "",
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, bloque: Number(form.bloque) });
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Bloque (orden)</label>
        <input
          type="number"
          min="1"
          value={form.bloque}
          onChange={(e) => setForm({ ...form, bloque: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
        <textarea
          rows={4}
          required
          value={form.contenido}
          onChange={(e) => setForm({ ...form, contenido: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Contenido del bloque..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancelar
        </button>
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          {data ? "Guardar cambios" : "Crear bloque"}
        </button>
      </div>
    </form>
  );
}
