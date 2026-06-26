export default function PageShell({ title, children, wide = false }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="flex flex-col justify-center items-center w-full bg-background min-h-screen">
      <header className="fixed top-0 left-0 z-10 flex justify-evenly items-center w-full py-4 sm:py-10 bg-background">
        <h1 className="text-2xl sm:text-3xl font-semibold decoration-amber-600 underline">{title}</h1>
      </header>
      <main className={`${wide ? "max-w-7xl" : "max-w-3xl"} w-full pt-20 sm:pt-36 px-3 sm:px-4`}>
        {children}
      </main>
      <footer className="flex h-32 sm:h-48 justify-center items-center">
        <div className="text-xs p-6">
          <p>Created by{" "}<a className="text-amber-600 hover:text-amber-700" href="https://peeters.ai">Ruben Peeters</a></p>
        </div>
      </footer>
    </div>
  );
}
