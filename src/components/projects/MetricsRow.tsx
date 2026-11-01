import type { HeadlineMetric } from "@/data/content";
import { NumberTicker } from "@/components/ui/number-ticker";

/* Headline metrics: gradient mono numbers (36px, DESIGN.md) counting up once in view, mono labels below. */
export function MetricsRow({ metrics, ariaLabel }: { metrics: HeadlineMetric[]; ariaLabel: string }) {
  return (
    <dl aria-label={ariaLabel} className="grid grid-cols-3 gap-3 sm:gap-6">
      {metrics.map((m, i) => (
        <div key={m.label} className="flex min-w-0 flex-col-reverse justify-end gap-1">
          <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted sm:text-[13px]">
            {m.label}
          </dt>
          <dd className="font-mono text-[28px] leading-none font-semibold sm:text-[36px]">
            {/* Gradient clipped to the number's own width, so short numbers still show cyan → violet */}
            <span className="inline-block bg-gradient bg-clip-text text-transparent">
              <NumberTicker value={m.value} decimalPlaces={m.decimals} delay={i * 0.1} />
              {m.suffix}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
