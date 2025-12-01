export function formatTextAsList(text) {
  if (!text) return null;

  const partes = text
    .split(".")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  // Si solo hay una frase → texto tal cual
  if (partes.length <= 1) {
    return text;
  }

  // Si hay varias frases → lista con viñetas
  return (
    <ul className="list-disc pl-5 space-y-1">
      {partes.map((item, idx) => (
        <li key={idx}>{item}.</li>
      ))}
    </ul>
  );
}
