"use client";
import { useTranslation } from "@/providers/language";

export default function QRPage() {
  const { t } = useTranslation();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const beersUrl = `${origin}/beers`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(beersUrl)}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-8 p-6">
      <h1 className="text-2xl font-bold">{t("scanToBrowse")}</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrUrl} alt="QR code" width={300} height={300} className="rounded-xl shadow-lg" />
      <p className="text-sm text-muted-foreground">{beersUrl}</p>
      <a href="/admin" className="text-sm text-amber-600 hover:text-amber-700">{t("backToAdmin")}</a>
    </div>
  );
}
