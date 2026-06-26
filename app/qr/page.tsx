import { headers } from "next/headers";

export default async function QRPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const beersUrl = `${protocol}://${host}/beers`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(beersUrl)}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-8 p-6">
      <h1 className="text-2xl font-bold">Scan to browse the cellar</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrUrl} alt="QR code" width={300} height={300} className="rounded-xl shadow-lg" />
      <p className="text-sm text-muted-foreground">{beersUrl}</p>
      <a href="/admin" className="text-sm text-amber-600 hover:text-amber-700">← Back to admin</a>
    </div>
  );
}
