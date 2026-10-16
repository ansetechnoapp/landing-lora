import Link from "next/link";
import { getPages, getSectors } from "@/lib/api";

export default async function PagesListPage() {
  let pages: Awaited<ReturnType<typeof getPages>>["data"] = [];
  let sectors: Awaited<ReturnType<typeof getSectors>>["data"] = [];
  let error: string | null = null;

  try {
    const [pagesRes, sectorsRes] = await Promise.allSettled([
      getPages(),
      getSectors(),
    ]);
    if (pagesRes.status === "fulfilled") pages = pagesRes.value.data || [];
    else error = pagesRes.reason instanceof Error ? pagesRes.reason.message : "Catalogue indisponible";
    if (sectorsRes.status === "fulfilled") sectors = sectorsRes.value.data || [];
    else if (!error) error = sectorsRes.reason instanceof Error ? sectorsRes.reason.message : "Secteurs indisponibles";
  } catch (e) {
    error = e instanceof Error ? e.message : "Erreur inconnue";
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-violet-600">
            Lora Chavez
          </Link>
          <nav className="flex gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-violet-600">Accueil</Link>
            <Link href="/pages" className="text-violet-600">Pages</Link>
            <Link href="/contact" className="hover:text-violet-600">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-2">Toutes les pages</h1>
          <p className="text-gray-500 mb-8">
            {pages.length} page{pages.length !== 1 ? "s" : ""} publiée{pages.length !== 1 ? "s" : ""}
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
          )}

          {sectors.length > 0 && (
            <div className="flex gap-2 mb-8 flex-wrap">
              {sectors.map((s) => (
                <span
                  key={s.id}
                  className="inline-block bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1 rounded-full"
                >
                  {s.icon && <span className="mr-1">{s.icon}</span>}
                  {s.name}
                </span>
              ))}
            </div>
          )}

          {pages.length === 0 && !error && (
            <p className="text-center text-gray-400 py-12">
              Aucune page publiée pour le moment.
            </p>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/pages/${page.slug}`}
                className="block border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-violet-300 transition"
              >
                {page.featuredImage && (
                  <div className="h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={page.featuredImage}
                      alt={page.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h2 className="text-lg font-semibold mb-2">{page.title}</h2>
                {page.description && (
                  <p className="text-gray-500 text-sm line-clamp-3">{page.description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
        Propulsé par{" "}
        <a href="https://zodev.live" className="text-violet-500 hover:underline">ZodBack</a>
      </footer>
    </div>
  );
}
