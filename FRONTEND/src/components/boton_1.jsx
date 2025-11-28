// src/components/boton_1.jsx
export default function ButtonPrimary({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition duration-200"
    >
      {text}
    </button>
  );
}
