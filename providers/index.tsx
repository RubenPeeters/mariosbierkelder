"use client";

import { LanguageProvider } from "./language";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
