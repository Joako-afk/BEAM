// src/components/busqueda.jsx
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full flex justify-center">
      <div
        className="
          flex items-center
          bg-white shadow-md rounded-full
          px-5 py-3 sm:px-7 sm:py-4
          w-11/12 sm:w-2/3 md:w-1/2
          border border-gray-300
        "
      >
        <Search size={26} className="text-gray-500 mr-3" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Buscar..."
          className="
            w-full outline-none
            text-gray-700 placeholder-gray-400
            text-base sm:text-lg
            bg-transparent
          "
        />
      </div>
    </div>
  );
}
