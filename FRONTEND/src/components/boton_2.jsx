// src/components/boton_2.jsx
export default function ButtonSecondary({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100 rounded-xl transition duration-200"
    >
      {text}
    </button>
  );
}
