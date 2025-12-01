// src/components/card.jsx
import { useNavigate } from "react-router-dom";
import CardDesign from "../components/carddesign";

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

// Componente interno para beneficio
function BeneficioCardComponent({ data }) {
  const navigate = useNavigate();

  return (
    <CardDesign
      title={data.nombre}
      iconName={data.icon_name || data.icon}
      color={data.colors.primary}
      lightColor={data.colors.light}
      barColor={data.colors.secondary}
      iconFolder="beneficios"  // 👈 usa /icons/beneficios/
      // Usa onClick que viene desde Categoria.jsx si existe
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
