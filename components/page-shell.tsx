export default function PageShell({ title, children, wide = false }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="flex flex-col justify-center items-center w-full bg-gray-100 min-h-screen">
      <header className="fixed top-0 left-0 z-10 flex justify-evenly items-center w-full py-10 bg-gray-100">
        <h1 className="text-3xl font-semibold decoration-red-600 underline">{title}</h1>
      </header>
      <main className={`${wide ? "max-w-7xl" : "max-w-3xl"} w-full bg-gray-100 pt-36 px-4`}>
        {children}
      </main>
      <footer className="flex h-48 justify-center items-center">
        <div className="text-xs p-6">
          <p>Created by{" "}<a className="text-red-500" href="https://pragmix.io">PragmiX</a></p>
        </div>
      </footer>
    </div>
  );
}
