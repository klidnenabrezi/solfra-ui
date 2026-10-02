import type { Specification } from "@/lib/types";

export function SpecTable({ specs }: { specs: Specification[] }) {
  if (!specs.length) return <p className="text-sm text-subtle">Specifications available on request.</p>;
  return (
    <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
      {specs.map((s, i) => (
        <div key={`${s.name}-${i}`} className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
          <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted sm:pt-0.5">{s.name}</dt>
          <dd className="text-sm text-ink">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
