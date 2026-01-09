// src/components/card.jsx
import { useNavigate } from "react-router-dom";
import CardDesign from "./carddesign";

// Componente interno para categoría
function CategoriaCardComponent({ data }) {
  const navigate = useNavigate();

  return (
    <CardDesign
      title={data.nombre}
      iconName={data.icon_name || data.icon}
      color={data.colors.primary}
      lightColor={data.colors.light}
      barColor={data.colors.secondary}
      iconFolder="categorias"  // 👈 usa /icons/categorias/
      onClick={() => navigate(`/categoria/${data.slug}`)}
    />
  );
}

// Componente interno para beneficio / institución
function BeneficioCardComponent({ data }) {
  const navigate = useNavigate();

  // Si viene logo_url => es institución (desde categoria.jsx tú lo seteas así)
  const isInstitucion = !!data.logo_url;

  return (
    <CardDesign
      title={data.nombre}
      // si es institución usamos logo_url (o icon_name si ya lo copiaste ahí)
      iconName={isInstitucion ? (data.logo_url) : (data.icon_name)}
      color={data.colors.primary}
      lightColor={data.colors.light}
      barColor={data.colors.secondary}

      // ✅ aquí está la magia:
      iconFolder={isInstitucion ? "instituciones" : "beneficios"}

      onClick={data.onClick || (() => navigate(`/beneficio/${data.slug}`))}
    />
  );
}


// FUNCIONES que devuelven el componente (como ya lo usas en inicio.jsx y categoria.jsx)
export function cardCategoria(data) {
  return <CategoriaCardComponent data={data} />;
}

export function cardBeneficio(data) {
  return <BeneficioCardComponent data={data} />;
}
