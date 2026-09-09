export function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="space-y-2.5">
      {features.map((feature) => (
        <li
          key={feature}
          className="flex gap-3 text-[15px] leading-relaxed text-fog md:text-base"
        >
          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-sage/70" />
          {feature}
        </li>
      ))}
    </ul>
  );
}