import { content } from "@/data/content";

// Phase 0 placeholder: verifies fonts and color tokens only.
export default function Home() {
  const { name, label } = content.identity;

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
      <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-text-muted">{label}</p>
      <h1 className="font-sans text-[44px] font-semibold tracking-[-0.03em] text-text md:text-[72px]">
        {name}
      </h1>
    </main>
  );
}
