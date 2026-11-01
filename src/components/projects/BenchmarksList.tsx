/*
 * Compact benchmarks list for the featured tile, rendered from project.metrics (content.ts).
 * Each string is split at its first ": " into a name (muted) and the numbers (bright),
 * e.g. "Redis caching: 92% hit rate, …". Strings without ": " render whole.
 */

function split(metric: string): [string, string | null] {
  const i = metric.indexOf(": ");
  return i === -1 ? [metric, null] : [metric.slice(0, i), metric.slice(i + 2)];
}

export function BenchmarksList({ metrics, heading }: { metrics: string[]; heading: string }) {
  return (
    <div className="flex flex-col gap-3 border-t border-border pt-5">
      <h4 className="font-mono text-[13px] uppercase tracking-[0.08em] text-text-muted">{heading}</h4>
      <ul className="flex flex-col gap-2.5 font-mono text-[12px] leading-[1.5]">
        {metrics.map((metric) => {
          const [name, values] = split(metric);
          return (
            <li key={metric} className="flex gap-2">
              <span aria-hidden="true" className="text-accent-1">
                ›
              </span>
              <span className="min-w-0">
                <span className="text-text-muted">{values ? `${name}:` : name}</span>
                {values && <span className="text-text"> {values}</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
