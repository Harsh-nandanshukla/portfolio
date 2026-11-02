import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { AskAI } from "@/components/sections/AskAI";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";

// Layout (DESIGN.md): max width 1120px, side padding 16px / 24px (md+),
// section spacing 80px / 128px (md+). md = 768px.
// The hero sits outside <main>'s max width so its background can span the full screen;
// its own content is constrained to the same 1120px inside Hero.tsx.
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <main className="mx-auto mt-20 flex w-full max-w-content flex-1 flex-col gap-20 px-4 pb-20 md:mt-32 md:gap-32 md:px-6 md:pb-32">
        <AskAI />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
