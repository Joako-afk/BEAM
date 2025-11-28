
export function formatTextAsList(text) {
  if (!text) return null;

  const partes = text
    .split(".")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  // Si solo hay una frase → párrafo normal
  if (partes.length <= 1) {
    return (
      <p className="text-base sm:text-lg leading-relaxed text-slate-900">
        {text}
      </p>
    );
  }

  // Si hay varias frases → lista con viñetas
  return (
    <ul className="list-disc pl-5 space-y-1 text-base sm:text-lg leading-relaxed text-slate-900">
      {partes.map((item, idx) => (
        <li key={idx}>{item}.</li>
      ))}
    </ul>
  );
}
