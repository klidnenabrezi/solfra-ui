import { Container } from "@/components/ui/section";

// PLACEHOLDER figures — replace with real company facts.
export const companyStats = [
  { value: "12+", label: "Years supplying businesses" },
  { value: "1,200+", label: "Organizations equipped" },
  { value: "3,500+", label: "Products sourced" },
  { value: "< 24h", label: "Average quote turnaround" },
];

export function StatsStrip() {
  return (
    <section className="border-y border-line bg-deep/60">
      <Container>
        <dl className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {companyStats.map((s, i) => (
            <div key={s.label} className={`flex flex-col-reverse px-2 py-8 sm:px-6 ${i < 2 ? "border-b border-line lg:border-b-0" : ""}`}>
              <dt className="mt-2 text-sm text-subtle">{s.label}</dt>
              <dd className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                <span className="text-gradient">{s.value}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
