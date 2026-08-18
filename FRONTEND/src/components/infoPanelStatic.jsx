// src/components/infoPanelStatic.jsx
export default function InfoPanelStatic({
  infoTitle = "Información",
  infoText = "",
  howToTitle = "¿Cómo se usa esta página?",
  steps = [],
}) {
  return (
    <section className="w-full flex justify-center mb-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bloque info */}
        <div
          className="text-center px-6 py-4 sm:py-5 rounded-2xl shadow-md"
          style={{
            backgroundColor: "var(--primary,#3e6a0f)",
            color: "var(--text,#ffffff)",
          }}
        >
          <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wide mb-2">
            {infoTitle}
          </h3>
          <p className="text-sm sm:text-base font-medium leading-relaxed">
            {infoText}
          </p>
        </div>

        {/* Bloque instrucciones */}
        <div className="bg-white px-6 py-4 sm:py-5 rounded-2xl shadow-md border border-gray-100">
          <h3
            className="text-base sm:text-lg font-extrabold uppercase tracking-wide mb-2"
            style={{ color: "var(--primary,#3e6a0f)" }}
          >
            {howToTitle}
          </h3>

          {Array.isArray(steps) && steps.length > 0 ? (
            <ol className="list-decimal pl-6 text-sm sm:text-base text-slate-800 leading-relaxed space-y-2">
              {steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          ) : (
            <p className="text-sm sm:text-base text-slate-500 italic">
              Sin instrucciones definidas.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
