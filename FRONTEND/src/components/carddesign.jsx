// src/components/carddesign.jsx

export default function CardDesign({
  title,
  iconName,
  color,
  lightColor,
  barColor,
  onClick,
  iconFolder = "beneficios",
}) {
  return (
    <div
      onClick={onClick}
      className="
        block rounded-3xl overflow-hidden cursor-pointer shadow-lg
        transition-transform hover:scale-[1.03]
        w-full max-w-[15rem] h-full flex flex-col
        justify-self-center
      "
      style={{ backgroundColor: color }}
    >
      {/* Parte superior */}
      <div
        className="
          flex items-center justify-center
          m-4 rounded-2xl
          p-4 sm:p-5
          aspect-square
        "
        style={{
          backgroundColor: lightColor,
          border: `10px solid ${color}`,
        }}
      >
        <img
          src={`/icons/${iconFolder}/${iconName}`}
          alt={title}
          loading="lazy"
          className={`
            object-contain
            w-28 h-28
            sm:w-32 sm:h-32
            md:w-36 md:h-36
            lg:w-40 lg:h-40
          `}
        />


      </div>

      {/* Franja inferior */}
      <div
        className="
          flex items-center justify-center
          rounded-b-3xl px-4 py-3 sm:py-4
          mt-auto h-24
        "
        style={{
          backgroundColor: barColor || color,
        }}
      >
        <h2
          className="
            font-semibold text-white text-center leading-tight
            whitespace-normal break-words
            line-clamp-3
            text-[18px] sm:text-[19px] md:text-[21px]
          "
        >
          {title}
        </h2>
      </div>
    </div>
  );
}
