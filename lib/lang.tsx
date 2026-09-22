"use client";

import { createContext, useContext } from "react";
import { copy, type Copy, type Lang } from "../data/copy";

const LangContext = createContext<Copy>(copy.en);

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={copy[lang]}>{children}</LangContext.Provider>;
}

/** The copy for the page's language. */
export const useCopy = () => useContext(LangContext);
