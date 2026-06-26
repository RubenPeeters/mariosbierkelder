"use client";
import Link from "next/link";
import DarkModeToggle from "./dark-mode-toggle";
import LanguageToggle from "./language-toggle";
import { useTranslation } from "@/providers/language";
import { TranslationKey } from "@/lib/translations";

export default function PageShell({ title, titleKey, children, wide = false }: { title?: string; titleKey?: TranslationKey; children: React.ReactNode; wide?: boolean }) {
  const { t } = useTranslation();
  const displayTitle = titleKey ? t(titleKey) : title || "";

  return (
    <div className="flex flex-col justify-center items-center w-full bg-background min-h-screen">
      <header className="fixed top-0 left-0 z-10 flex justify-between items-center w-full py-4 sm:py-10 px-4 sm:px-8 bg-background">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">{t("home")}</Link>
          <DarkModeToggle />
          <LanguageToggle />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold decoration-amber-600 underline">{displayTitle}</h1>
        <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground">{t("admin")}</Link>
      </header>
      <main className={`${wide ? "max-w-7xl" : "max-w-3xl"} w-full pt-20 sm:pt-36 px-3 sm:px-4`}>
        {children}
      </main>
      <footer className="flex h-32 sm:h-48 justify-center items-center">
        <div className="text-xs p-6">
          <p>{t("createdBy")}{" "}<a className="text-amber-600 hover:text-amber-700" href="https://peeters.ai">Ruben Peeters</a></p>
        </div>
      </footer>
    </div>
  );
}
