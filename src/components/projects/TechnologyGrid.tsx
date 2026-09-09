export function TechnologyGrid({
  stack,
}: {
  stack: { name: string; note: string }[];
}) {
  return (
    <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
      {stack.map((item) => (
        <div
          key={item.name}
          className="bg-ink p-6 transition-colors duration-300 hover:bg-ink-3 md:p-7"
        >
          <h3 className="font-display text-lg font-medium tracking-tight text-bone md:text-xl">
            {item.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-fog">{item.note}</p>
        </div>
      ))}
    </div>
  );
}