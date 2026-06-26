import { turso } from "@/lib/turso";
import { Beer } from "@/types";
import BeerCellar from "@/components/beer-cellar";
import PageShell from "@/components/page-shell";

export const dynamic = "force-dynamic";

export default async function Beers() {
  const result = await turso.execute("SELECT * FROM beers ORDER BY name");
  const beers = (result.rows as unknown as Beer[]).filter((b) => b.count > 0);

  return (
    <PageShell title="CELLAR" wide>
      <BeerCellar beers={beers} />
    </PageShell>
  );
}
