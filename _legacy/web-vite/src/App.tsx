import { useIsMobile, useReducedMotion, useFinePointer } from "./hooks/useMediaQuery";
import { Nav } from "./components/Nav";
import { ScrollProgress, ContextCursor } from "./components/Chrome";
import { Hero } from "./components/Hero";
import { Manifesto } from "./components/Manifesto";
import { Work } from "./components/Work";
import { DesignCode } from "./components/DesignCode";
import { About } from "./components/About";
import { Contact, Footer } from "./components/Contact";

export default function App() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();

  /** One switch: reduced motion disables every scroll-linked effect, and the
   *  effects unregister from the driver entirely rather than running at zero. */
  const motion = !reduced;

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to selected work
      </a>

      <ScrollProgress enabled={motion} />
      <ContextCursor enabled={motion && finePointer && !isMobile} />
      <Nav isMobile={isMobile} />

      <main>
        <Hero isMobile={isMobile} motion={motion} />
        <Manifesto motion={motion} />
        <Work motion={motion} isMobile={isMobile} />
        <DesignCode motion={motion} />
        <About motion={motion} />
        <Contact magnetic={motion && finePointer} />
      </main>

      <Footer />
    </>
  );
}
