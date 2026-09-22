"use client";

import { useIsMobile, useReducedMotion, useFinePointer } from "../hooks/useMediaQuery";
import { Nav } from "./Nav";
import { ScrollProgress, ContextCursor } from "./Chrome";
import { Hero } from "./Hero";
import { Manifesto } from "./Manifesto";
import { Work } from "./Work";
import { DesignCode } from "./DesignCode";
import { About } from "./About";
import { Contact, Footer } from "./Contact";
import { LangProvider } from "../lib/lang";
import { copy, type Lang } from "../data/copy";

export default function Portfolio({ lang = "en" }: { lang?: Lang }) {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();

  /** One switch: reduced motion disables every scroll-linked effect, and the
   *  effects unregister from the driver entirely rather than running at zero. */
  const motion = !reduced;

  return (
    <LangProvider lang={lang}>
      <div lang={lang} className="contents">
      <a className="skip-link" href="#work">
        {copy[lang].skip}
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
      </div>
    </LangProvider>
  );
}
