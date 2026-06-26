"use client";
import { useTranslation } from "@/providers/language";

export default function LanguageToggle() {
  const { locale, setLocale } = useTranslation();
  return (
    <button
      onClick={() => setLocale(locale === "en" ? "nl" : "en")}
      className="text-xs font-medium text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded border border-border"
    >
      {locale === "en" ? "NL" : "EN"}
    </button>
  );
}
