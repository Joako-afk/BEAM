import { useState, useEffect, useCallback, useRef } from "react";
import {
  FolderOpen, Gift, Building2, MapPin, FileText,
  Plus, Pencil, Trash2, ArrowLeft, Settings,
  Calendar, Mountain, Search, X,
} from "lucide-react";
import Modal from "../components/admin/Modal";
import CategoriaForm from "../components/admin/CategoriaForm";
import BeneficioForm from "../components/admin/BeneficioForm";
import InstitucionForm from "../components/admin/InstitucionForm";
import OrganismoForm from "../components/admin/OrganismoForm";
import InformacionForm from "../components/admin/InformacionForm";
import EventoForm from "../components/admin/EventoForm";
import TerritorioForm from "../components/admin/TerritorioForm";

const API = "http://localhost:4000/api/admin";

const TABS = [
  { id: "categorias", label: "Categorías", icon: FolderOpen },
  { id: "beneficios", label: "Beneficios", icon: Gift },
  { id: "informacion", label: "Información", icon: FileText },
  { id: "instituciones", label: "Instituciones", icon: Building2 },
  { id: "organismos", label: "Organismos", icon: MapPin },
  { id: "territorios", label: "Territorios", icon: Mountain },
  { id: "eventos", label: "Eventos", icon: Calendar },
];

const ENTITY_LABELS = {
  categorias: "categorías",
  beneficios: "beneficios",
  informacion: "información",
  instituciones: "instituciones",
  organismos: "organismos",
  territorios: "territorios",
  eventos: "eventos",
};

const PAGE_SIZE = 20;

export default function Configuraciones() {
  const [activeTab, setActiveTab] = useState("categorias");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categorias, setCategorias] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [beneficios, setBeneficios] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [informacion, setInformacion] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [instituciones, setInstituciones] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [organismos, setOrganismos] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [territorios, setTerritorios] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [eventos, setEventos] = useState({ data: [], total: 0, page: 1, totalPages: 1 });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounceRef = useRef(null);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const fetchTab = useCallback(async (entity, pageNum, searchTerm) => {
    const params = new URLSearchParams();
    params.set("page", pageNum);
    if (searchTerm) params.set("search", searchTerm);
    const res = await fetch(`${API}/${entity}?${params}`);
    return res.json();
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cat, ben, info, inst, org, terr, ev] = await Promise.all([
        fetchTab("categorias", page, search),
        fetchTab("beneficios", page, search),
        fetchTab("informacion", page, search),
        fetchTab("instituciones", page, search),
        fetchTab("organismos", page, search),
        fetchTab("territorios", page, search),
        fetchTab("eventos", page, search),
      ]);
      setCategorias(cat);
      setBeneficios(ben);
      setInformacion(info);
      setInstituciones(inst);
      setOrganismos(org);
      setTerritorios(terr);
      setEventos(ev);
    } catch {
      setError("Error al cargar datos. Verifica que el backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  }, [page, search, fetchTab]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {}, 300);
  };

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const handleCreate = () => { setEditing(null); setModalOpen(true); };
  const handleEdit = (item) => { setEditing(item); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditing(null); };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { entity, id } = confirmDelete;
    setDeleteError(null);
    try {
      const res = await fetch(`${API}/${entity}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error);
        return;
      }
      setConfirmDelete(null);
      setDeleteError(null);
      fetchAll();
    } catch {
      setDeleteError("Error al eliminar");
    }
  };

  const openDeleteConfirm = (entity, id, name) => {
    setConfirmDelete({ entity, id, name });
    setDeleteError(null);
  };

  const handleSubmit = async (entity, form, idField) => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/${entity}/${editing[idField]}` : `${API}/${entity}`;
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    handleClose();
    fetchAll();
  };

  const handlers = {
    categorias: (form) => handleSubmit("categorias", form, "id_categoria"),
    beneficios: (form) => handleSubmit("beneficios", form, "id_beneficio"),
    informacion: (form) => handleSubmit("informacion", form, "id_info"),
    instituciones: (form) => handleSubmit("instituciones", form, "id_institucion"),
    organismos: (form) => handleSubmit("organismos", form, "id_organismo"),
    territorios: (form) => handleSubmit("territorios", form, "id_divter"),
    eventos: (form) => handleSubmit("eventos", form, "id_evento"),
  };

  const modalTitles = {
    categorias: editing ? "Editar Categoría" : "Nueva Categoría",
    beneficios: editing ? "Editar Beneficio" : "Nuevo Beneficio",
    informacion: editing ? "Editar Información" : "Nueva Información",
    instituciones: editing ? "Editar Institución" : "Nueva Institución",
    organismos: editing ? "Editar Organismo" : "Nuevo Organismo",
    territorios: editing ? "Editar Territorio" : "Nuevo Territorio",
    eventos: editing ? "Editar Evento" : "Nuevo Evento",
  };

  const tabData = {
    categorias,
    beneficios,
    informacion,
    instituciones,
    organismos,
    territorios,
    eventos,
  };

  const currentData = tabData[activeTab] || { data: [], total: 0, page: 1, totalPages: 1 };

  return (
    <div className="min-h-screen bg-gray-100">
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
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearch(""); setPage(1); }}
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
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">Cargando datos...</div>
        ) : (
          <>
            {/* Search + Add */}
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={`Buscar ${ENTITY_LABELS[activeTab]}...`}
                  className="w-full pl-9 pr-8 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {search && (
                  <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                <Plus size={16} />
                {activeTab === "categorias" && "Nueva Categoría"}
                {activeTab === "beneficios" && "Nuevo Beneficio"}
                {activeTab === "informacion" && "Nueva Información"}
                {activeTab === "instituciones" && "Nueva Institución"}
                {activeTab === "organismos" && "Nuevo Organismo"}
                {activeTab === "territorios" && "Nuevo Territorio"}
                {activeTab === "eventos" && "Nuevo Evento"}
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {activeTab === "categorias" && (
                <TablaCategorias data={categorias} onEdit={handleEdit} onDelete={(id, name) => openDeleteConfirm("categorias", id, name)} />
              )}
              {activeTab === "beneficios" && (
                <TablaBeneficios data={beneficios} onEdit={handleEdit} onDelete={(id, name) => openDeleteConfirm("beneficios", id, name)} />
              )}
              {activeTab === "informacion" && (
                <TablaInformacion data={informacion} onEdit={handleEdit} onDelete={(id, name) => openDeleteConfirm("informacion", id, name)} />
              )}
              {activeTab === "instituciones" && (
                <TablaInstituciones data={instituciones} onEdit={handleEdit} onDelete={(id, name) => openDeleteConfirm("instituciones", id, name)} />
              )}
              {activeTab === "organismos" && (
                <TablaOrganismos data={organismos} onEdit={handleEdit} onDelete={(id, name) => openDeleteConfirm("organismos", id, name)} />
              )}
              {activeTab === "territorios" && (
                <TablaTerritorios data={territorios} onEdit={handleEdit} onDelete={(id, name) => openDeleteConfirm("territorios", id, name)} />
              )}
              {activeTab === "eventos" && (
                <TablaEventos data={eventos} onEdit={handleEdit} onDelete={(id, name) => openDeleteConfirm("eventos", id, name)} />
              )}
            </div>

            {/* Pagination */}
            {currentData.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Mostrando {((currentData.page - 1) * PAGE_SIZE) + 1}–{Math.min(currentData.page * PAGE_SIZE, currentData.total)} de {currentData.total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentData.page <= 1}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1.5 text-sm text-gray-600">
                    Página {currentData.page} de {currentData.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(currentData.totalPages, p + 1))}
                    disabled={currentData.page >= currentData.totalPages}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal crear/editar */}
      <Modal isOpen={modalOpen} onClose={handleClose} title={modalTitles[activeTab]}>
        {activeTab === "categorias" && (
          <CategoriaForm data={editing} onSubmit={handlers.categorias} onCancel={handleClose} />
        )}
        {activeTab === "beneficios" && (
          <BeneficioForm data={editing} categorias={categorias.data} comunas={territorios.data.filter((t) => t.tipo === "COMUNA")} organismos={organismos.data} onSubmit={handlers.beneficios} onCancel={handleClose} />
        )}
        {activeTab === "informacion" && (
          <InformacionForm data={editing} beneficios={beneficios.data} onSubmit={handlers.informacion} onCancel={handleClose} />
        )}
        {activeTab === "instituciones" && (
          <InstitucionForm data={editing} categorias={categorias.data} onSubmit={handlers.instituciones} onCancel={handleClose} />
        )}
        {activeTab === "organismos" && (
          <OrganismoForm data={editing} instituciones={instituciones.data} territorios={territorios.data} onSubmit={handlers.organismos} onCancel={handleClose} />
        )}
        {activeTab === "territorios" && (
          <TerritorioForm data={editing} regiones={territorios.data.filter((t) => t.tipo === "REGION")} onSubmit={handlers.territorios} onCancel={handleClose} />
        )}
        {activeTab === "eventos" && (
          <EventoForm data={editing} onSubmit={handlers.eventos} onCancel={handleClose} />
        )}
      </Modal>

      {/* Confirmar eliminación */}
      <Modal isOpen={!!confirmDelete} onClose={() => { setConfirmDelete(null); setDeleteError(null); }} title="Confirmar eliminación">
        {deleteError ? (
          <div>
            <p className="text-sm text-red-600 mb-4">{deleteError}</p>
            <button
              onClick={() => { setConfirmDelete(null); setDeleteError(null); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              ¿Estás seguro de eliminar <strong>{confirmDelete?.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmDelete(null); setDeleteError(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ======== TABLAS ========

function EmptyState({ entity }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-sm">No hay {entity} registradas</p>
    </div>
  );
}

function SearchEmptyState() {
  return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-sm">No se encontraron resultados</p>
    </div>
  );
}

function TablaCategorias({ data, onEdit, onDelete }) {
  if (!data.data.length) return data.total === 0 ? <EmptyState entity="categorías" /> : <SearchEmptyState />;
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
        {data.data.map((cat) => (
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
                <button onClick={() => onDelete(cat.id_categoria, cat.nombre)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaBeneficios({ data, onEdit, onDelete }) {
  if (!data.data.length) return data.total === 0 ? <EmptyState entity="beneficios" /> : <SearchEmptyState entity="beneficios" />;
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
        {data.data.map((b) => (
          <tr key={b.id_beneficio} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">{b.nombre}</td>
            <td className="px-4 py-3 text-gray-500">{b.categoria_nombre}</td>
            <td className="px-4 py-3 text-gray-500">${b.costo}</td>
            <td className="px-4 py-3 text-gray-500">{b.edad_minima} años</td>
            <td className="px-4 py-3 text-right">
              <div className="flex gap-1 justify-end">
                <button onClick={() => onEdit(b)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
                <button onClick={() => onDelete(b.id_beneficio, b.nombre)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaInformacion({ data, onEdit, onDelete }) {
  if (!data.data.length) return data.total === 0 ? <EmptyState entity="información" /> : <SearchEmptyState entity="información" />;
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
        {data.data.map((info) => (
          <tr key={info.id_info} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">{info.nombre}</td>
            <td className="px-4 py-3 text-gray-500">{info.bloque}</td>
            <td className="px-4 py-3 text-gray-500">{info.beneficio_nombre || "—"}</td>
            <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{info.contenido}</td>
            <td className="px-4 py-3 text-right">
              <div className="flex gap-1 justify-end">
                <button onClick={() => onEdit(info)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
                <button onClick={() => onDelete(info.id_info, info.nombre)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaInstituciones({ data, onEdit, onDelete }) {
  if (!data.data.length) return data.total === 0 ? <EmptyState entity="instituciones" /> : <SearchEmptyState entity="instituciones" />;
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
        {data.data.map((inst) => (
          <tr key={inst.id_institucion} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">{inst.nombre}</td>
            <td className="px-4 py-3 text-gray-500">{inst.categoria_nombre || "—"}</td>
            <td className="px-4 py-3 text-gray-500 truncate max-w-[200px]">{inst.pagina_web || "—"}</td>
            <td className="px-4 py-3 text-gray-500">{inst.email_contacto || "—"}</td>
            <td className="px-4 py-3 text-right">
              <div className="flex gap-1 justify-end">
                <button onClick={() => onEdit(inst)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
                <button onClick={() => onDelete(inst.id_institucion, inst.nombre)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaOrganismos({ data, onEdit, onDelete }) {
  if (!data.data.length) return data.total === 0 ? <EmptyState entity="organismos" /> : <SearchEmptyState entity="organismos" />;
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
        {data.data.map((org) => (
          <tr key={org.id_organismo} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">{org.nombre_sucursal}</td>
            <td className="px-4 py-3 text-gray-500">{org.institucion_nombre || "—"}</td>
            <td className="px-4 py-3 text-gray-500">{org.direccion || "—"}</td>
            <td className="px-4 py-3 text-gray-500 text-xs">{org.lat?.toFixed(4)}, {org.lng?.toFixed(4)}</td>
            <td className="px-4 py-3 text-right">
              <div className="flex gap-1 justify-end">
                <button onClick={() => onEdit(org)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
                <button onClick={() => onDelete(org.id_organismo, org.nombre_sucursal)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaTerritorios({ data, onEdit, onDelete }) {
  if (!data.data.length) return data.total === 0 ? <EmptyState entity="territorios" /> : <SearchEmptyState entity="territorios" />;
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">ID Padre</th>
          <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.data.map((t) => (
          <tr key={t.id_divter} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">{t.nombre}</td>
            <td className="px-4 py-3">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${t.tipo === "REGION" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                {t.tipo}
              </span>
            </td>
            <td className="px-4 py-3 text-gray-500">{t.id_padre || "—"}</td>
            <td className="px-4 py-3 text-right">
              <div className="flex gap-1 justify-end">
                <button onClick={() => onEdit(t)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
                <button onClick={() => onDelete(t.id_divter, t.nombre)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaEventos({ data, onEdit, onDelete }) {
  if (!data.data.length) return data.total === 0 ? <EmptyState entity="eventos" /> : <SearchEmptyState entity="eventos" />;
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Descripción</th>
          <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.data.map((ev) => (
          <tr key={ev.id_evento} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-800">{ev.nombre}</td>
            <td className="px-4 py-3 text-gray-500">{ev.fecha ? new Date(ev.fecha).toLocaleString("es-CL") : "—"}</td>
            <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{ev.descripcion || "—"}</td>
            <td className="px-4 py-3 text-right">
              <div className="flex gap-1 justify-end">
                <button onClick={() => onEdit(ev)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
                <button onClick={() => onDelete(ev.id_evento, ev.nombre)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
