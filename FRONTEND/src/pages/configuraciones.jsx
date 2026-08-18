import { useState, useEffect } from "react";
import {
  FolderOpen, Gift, Building2, MapPin, FileText,
  Plus, Pencil, Trash2, ArrowLeft, Settings,
} from "lucide-react";
import Modal from "../components/admin/Modal";
import CategoriaForm from "../components/admin/CategoriaForm";
import BeneficioForm from "../components/admin/BeneficioForm";
import InstitucionForm from "../components/admin/InstitucionForm";
import OrganismoForm from "../components/admin/OrganismoForm";
import InformacionForm from "../components/admin/InformacionForm";

const API = "http://localhost:4000/api/admin";

const TABS = [
  { id: "categorias", label: "Categorías", icon: FolderOpen },
  { id: "beneficios", label: "Beneficios", icon: Gift },
  { id: "informacion", label: "Información", icon: FileText },
  { id: "instituciones", label: "Instituciones", icon: Building2 },
  { id: "organismos", label: "Organismos", icon: MapPin },
];

export default function Configuraciones() {
  const [activeTab, setActiveTab] = useState("categorias");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categorias, setCategorias] = useState([]);
  const [beneficios, setBeneficios] = useState([]);
  const [informacion, setInformacion] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [organismos, setOrganismos] = useState([]);
  const [territorios, setTerritorios] = useState([]);

  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, benRes, infoRes, instRes, orgRes, terrRes] = await Promise.all([
        fetch(`${API}/categorias`),
        fetch(`${API}/beneficios`),
        fetch(`${API}/informacion`),
        fetch(`${API}/instituciones`),
        fetch(`${API}/organismos`),
        fetch(`${API}/territorios`),
      ]);
      setCategorias(await catRes.json());
      setBeneficios(await benRes.json());
      setInformacion(await infoRes.json());
      setInstituciones(await instRes.json());
      setOrganismos(await orgRes.json());
      setTerritorios(await terrRes.json());
    } catch {
      setError("Error al cargar datos. Verifica que el backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = () => { setEditing(null); setModalOpen(true); };
  const handleEdit = (item) => { setEditing(item); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditing(null); };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { entity, id } = confirmDelete;
    try {
      await fetch(`${API}/${entity}/${id}`, { method: "DELETE" });
      setConfirmDelete(null);
      fetchAll();
    } catch {
      setError("Error al eliminar");
    }
  };

  const handleSubmitCategoria = async (form) => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/categorias/${editing.id_categoria}` : `${API}/categorias`;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    handleClose();
    fetchAll();
  };

  const handleSubmitBeneficio = async (form) => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/beneficios/${editing.id_beneficio}` : `${API}/beneficios`;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    handleClose();
    fetchAll();
  };

  const handleSubmitInstitucion = async (form) => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/instituciones/${editing.id_institucion}` : `${API}/instituciones`;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    handleClose();
    fetchAll();
  };

  const handleSubmitOrganismo = async (form) => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/organismos/${editing.id_organismo}` : `${API}/organismos`;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    handleClose();
    fetchAll();
  };

  const handleSubmitInformacion = async (form) => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/informacion/${editing.id_info}` : `${API}/informacion`;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    handleClose();
    fetchAll();
  };

  const modalTitles = {
    categorias: editing ? "Editar Categoría" : "Nueva Categoría",
    beneficios: editing ? "Editar Beneficio" : "Nuevo Beneficio",
    informacion: editing ? "Editar Información" : "Nueva Información",
    instituciones: editing ? "Editar Institución" : "Nueva Institución",
    organismos: editing ? "Editar Organismo" : "Nuevo Organismo",
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <ArrowLeft size={20} />
            </a>
            <Settings size={24} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Panel de Configuraciones</h1>
          </div>
          <span className="text-sm text-gray-500">BEAM Admin</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
            <button onClick={() => setError(null)} className="ml-2 underline">Cerrar</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Cargando datos...</div>
        ) : (
          <>
            {/* Add button */}
            <div className="mb-4">
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <Plus size={16} />
                {activeTab === "categorias" && "Nueva Categoría"}
                {activeTab === "beneficios" && "Nuevo Beneficio"}
                {activeTab === "informacion" && "Nueva Información"}
                {activeTab === "instituciones" && "Nueva Institución"}
                {activeTab === "organismos" && "Nuevo Organismo"}
              </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {activeTab === "categorias" && (
                <TablaCategorias data={categorias} onEdit={handleEdit} onDelete={(id) => setConfirmDelete({ entity: "categorias", id })} />
              )}
              {activeTab === "beneficios" && (
                <TablaBeneficios data={beneficios} onEdit={handleEdit} onDelete={(id) => setConfirmDelete({ entity: "beneficios", id })} />
              )}
              {activeTab === "informacion" && (
                <TablaInformacion data={informacion} onEdit={handleEdit} onDelete={(id) => setConfirmDelete({ entity: "informacion", id })} />
              )}
              {activeTab === "instituciones" && (
                <TablaInstituciones data={instituciones} onEdit={handleEdit} onDelete={(id) => setConfirmDelete({ entity: "instituciones", id })} />
              )}
              {activeTab === "organismos" && (
                <TablaOrganismos data={organismos} onEdit={handleEdit} onDelete={(id) => setConfirmDelete({ entity: "organismos", id })} />
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal crear/editar */}
      <Modal isOpen={modalOpen} onClose={handleClose} title={modalTitles[activeTab]}>
        {activeTab === "categorias" && (
          <CategoriaForm data={editing} onSubmit={handleSubmitCategoria} onCancel={handleClose} />
        )}
        {activeTab === "beneficios" && (
          <BeneficioForm data={editing} categorias={categorias} onSubmit={handleSubmitBeneficio} onCancel={handleClose} />
        )}
        {activeTab === "informacion" && (
          <InformacionForm data={editing} beneficios={beneficios} onSubmit={handleSubmitInformacion} onCancel={handleClose} />
        )}
        {activeTab === "instituciones" && (
          <InstitucionForm data={editing} categorias={categorias} onSubmit={handleSubmitInstitucion} onCancel={handleClose} />
        )}
        {activeTab === "organismos" && (
          <OrganismoForm data={editing} instituciones={instituciones} territorios={territorios} onSubmit={handleSubmitOrganismo} onCancel={handleClose} />
        )}
      </Modal>

      {/* Confirmar eliminación */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirmar eliminación">
        <p className="text-sm text-gray-600 mb-4">¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.</p>
        <div className="flex gap-3">
          <button
            onClick={() => setConfirmDelete(null)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ======== TABLAS ========

function TablaCategorias({ data, onEdit, onDelete }) {
  if (!data.length) return <EmptyState />;
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Color</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Icono</th>
          <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((cat) => (
          <tr key={cat.id_categoria} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3">
              <span className="inline-block w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: cat.color_primary }} />
            </td>
            <td className="px-4 py-3 font-medium text-gray-800">{cat.nombre}</td>
            <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
            <td className="px-4 py-3 text-gray-500">{cat.icon_name}</td>
            <td className="px-4 py-3 text-right">
              <div className="flex gap-1 justify-end">
                <button onClick={() => onEdit(cat)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
                <button onClick={() => onDelete(cat.id_categoria)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaBeneficios({ data, onEdit, onDelete }) {
  if (!data.length) return <EmptyState />;
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Categoría</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Costo</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Edad mín.</th>
          <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((b) => (
          <tr key={b.id_beneficio} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">{b.nombre}</td>
            <td className="px-4 py-3 text-gray-500">{b.categoria_nombre}</td>
            <td className="px-4 py-3 text-gray-500">${b.costo}</td>
            <td className="px-4 py-3 text-gray-500">{b.edad_minima} años</td>
            <td className="px-4 py-3 text-right">
              <div className="flex gap-1 justify-end">
                <button onClick={() => onEdit(b)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
                <button onClick={() => onDelete(b.id_beneficio)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaInformacion({ data, onEdit, onDelete }) {
  if (!data.length) return <EmptyState />;
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Bloque</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Beneficio</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Contenido</th>
          <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((info) => (
          <tr key={info.id_info} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">{info.nombre}</td>
            <td className="px-4 py-3 text-gray-500">{info.bloque}</td>
            <td className="px-4 py-3 text-gray-500">{info.beneficio_nombre || "—"}</td>
            <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{info.contenido}</td>
            <td className="px-4 py-3 text-right">
              <div className="flex gap-1 justify-end">
                <button onClick={() => onEdit(info)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
                <button onClick={() => onDelete(info.id_info)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaInstituciones({ data, onEdit, onDelete }) {
  if (!data.length) return <EmptyState />;
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Categoría</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Web</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
          <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((inst) => (
          <tr key={inst.id_institucion} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">{inst.nombre}</td>
            <td className="px-4 py-3 text-gray-500">{inst.categoria_nombre || "—"}</td>
            <td className="px-4 py-3 text-gray-500 truncate max-w-[200px]">{inst.pagina_web || "—"}</td>
            <td className="px-4 py-3 text-gray-500">{inst.email_contacto || "—"}</td>
            <td className="px-4 py-3 text-right">
              <div className="flex gap-1 justify-end">
                <button onClick={() => onEdit(inst)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
                <button onClick={() => onDelete(inst.id_institucion)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaOrganismos({ data, onEdit, onDelete }) {
  if (!data.length) return <EmptyState />;
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Sucursal</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Institución</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Dirección</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Coordenadas</th>
          <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((org) => (
          <tr key={org.id_organismo} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">{org.nombre_sucursal}</td>
            <td className="px-4 py-3 text-gray-500">{org.institucion_nombre || "—"}</td>
            <td className="px-4 py-3 text-gray-500">{org.direccion || "—"}</td>
            <td className="px-4 py-3 text-gray-500 text-xs">{org.lat?.toFixed(4)}, {org.lng?.toFixed(4)}</td>
            <td className="px-4 py-3 text-right">
              <div className="flex gap-1 justify-end">
                <button onClick={() => onEdit(org)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
                <button onClick={() => onDelete(org.id_organismo)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-sm">No hay elementos para mostrar</p>
    </div>
  );
}
