export default function CardDesign({
  title,
  iconName,
  color,
  lightColor,
  barColor,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="
        block 
        rounded-3xl 
        overflow-hidden 
        cursor-pointer 
        shadow-lg
        transition-transform 
        hover:scale-[1.03]
        w-40 sm:w-52 md:w-56
      "
      style={{ backgroundColor: color }}
    >
      {/* PARTE SUPERIOR */}
      <div
        className="
          flex 
          items-center 
          justify-center 
          m-4 
          rounded-2xl
          p-6
        "
        style={{
          backgroundColor: lightColor,
          border: `12px solid ${color}`,
        }}
      >
        <img
          src={`/icons/${iconName}`}
          alt={title}
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 object-contain"
          loading="lazy"
        />
      </div>

      {/* FRANJA INFERIOR */}
      <div
        className="
          flex 
          items-center 
          justify-center 
          rounded-b-3xl
          px-4 py-4
        "
        style={{
          backgroundColor: barColor || color,
          minHeight: "5rem",
        }}
      >
        <h2
          className="
            font-semibold 
            text-white 
            text-center 
            leading-normal
            whitespace-normal
            break-words
            text-[18px] sm:text-[20px] md:text-[22px]
          "
        >
          {title}
        </h2>
      </div>
    </div>
  );
}
