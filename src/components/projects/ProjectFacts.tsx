import type { ProjectFact } from "@/types";

export function ProjectFacts({ facts }: { facts: ProjectFact[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      {facts.map((fact) => (
        <div key={fact.label} className="border-t border-line pt-4">
          <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist">
            {fact.label}
          </dt>
          <dd className="mt-2 text-sm leading-relaxed text-bone md:text-[15px]">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}