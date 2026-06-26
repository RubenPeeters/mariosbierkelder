import { turso } from "@/lib/turso";
import { Beer } from "@/types";
import BeerCard from "@/components/beer-card";
import PageShell from "@/components/page-shell";

export const dynamic = "force-dynamic";

export default async function Beers() {
  const result = await turso.execute("SELECT * FROM beers ORDER BY name");
  const beers = (result.rows as unknown as Beer[]).filter((b) => b.count > 0);

  return (
    <PageShell title="CELLAR" wide>
      <div className="flex flex-wrap gap-6 justify-center w-full">
        {beers.length > 0 ? (
          beers.map((beer) => <BeerCard key={beer.id} beer={beer} showOrder />)
        ) : (
          <div className="grid gap-4 items-center justify-center w-full py-24 border rounded-xl shadow-sm">
            <p>No beers yet.</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
