export default function InstructionsPanel({
  title = "¿Cómo usar esta página?",
  steps = [],
}) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md border border-gray-100 p-5">
      <h3 className="text-lg sm:text-xl font-extrabold mb-3 text-[var(--primary,#3e6a0f)] uppercase tracking-wide">
        {title}
      </h3>

      <ol className="list-decimal pl-6 text-base sm:text-lg text-slate-800 space-y-2 leading-relaxed">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    </div>
  );
}
