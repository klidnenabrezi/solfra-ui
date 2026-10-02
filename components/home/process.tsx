import { Reveal } from "@/components/ui/reveal";

const steps = [
  { n: "01", title: "Browse", body: "Explore the catalog or tell us the problem you need solved." },
  { n: "02", title: "Inquire", body: "Send an inquiry — no account, no checkout. Just what you need." },
  { n: "03", title: "Quote", body: "A specialist replies with options and a clear quotation, fast." },
  { n: "04", title: "Deploy", body: "We configure, deliver and install — ready on day one." },
];

export function ProcessSteps() {
  return (
    <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
      <div className="absolute left-0 right-0 top-[1.15rem] hidden h-px bg-gradient-to-r from-transparent via-line-strong to-transparent md:block" aria-hidden />
      {steps.map((s, i) => (
        <Reveal as="li" key={s.n} delay={i * 90} className="relative">
          <span className="relative z-10 inline-grid h-9 place-items-center rounded-full border border-line-strong bg-base px-3 font-mono text-xs text-neon">
            {s.n}
          </span>
          <h3 className="mt-5 font-display text-xl font-semibold text-ink">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-subtle">{s.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}
