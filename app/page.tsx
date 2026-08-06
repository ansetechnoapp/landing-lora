import Link from "next/link";
import { getPages, getCompanyProfile } from "@/lib/api";

export default async function HomePage() {
  let pages: Awaited<ReturnType<typeof getPages>>["data"] = [];
  let company: Awaited<ReturnType<typeof getCompanyProfile>>["data"] | null = null;
  let error: string | null = null;

  try {
    const [pagesRes, companyRes] = await Promise.allSettled([
      getPages(),
      getCompanyProfile(),
    ]);
    if (pagesRes.status === "fulfilled") pages = pagesRes.value.data || [];
    else error = pagesRes.reason instanceof Error ? pagesRes.reason.message : "Catalogue indisponible";
    if (companyRes.status === "fulfilled") company = companyRes.value.data;
    else if (!error) error = companyRes.reason instanceof Error ? companyRes.reason.message : "Profil indisponible";
  } catch (e) {
    error = e instanceof Error ? e.message : "Erreur inconnue";
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-violet-600">
            {company?.companyName || "Lora Chavez"}
          </h1>
          <nav className="flex gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-violet-600">
              Accueil
            </Link>
            <Link href="/pages" className="hover:text-violet-600">
              Pages
            </Link>
            <Link href="/contact" className="hover:text-violet-600">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-violet-600 to-purple-700 text-white py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">
              {company?.headline || "Landing Pages Professionnelles"}
            </h2>
            <p className="text-lg text-violet-100 mb-8">
              {company?.bio ||
                "Créez des pages d'atterrissage qui convertissent vos visiteurs en clients"}
            </p>
            <Link
              href="/pages"
              className="inline-block bg-white text-violet-600 font-semibold px-8 py-3 rounded-lg hover:bg-violet-50 transition"
            >
              Voir les pages
            </Link>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-2xl font-bold mb-2 text-center">
              Pages publiées
            </h3>
            <p className="text-gray-500 text-center mb-10">
              {pages.length} page{pages.length !== 1 ? "s" : ""} disponible
              {pages.length !== 1 ? "s" : ""}
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {pages.length === 0 && !error && (
              <p className="text-center text-gray-400">
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
                  <h4 className="text-lg font-semibold mb-2">{page.title}</h4>
                  {page.description && (
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {page.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
        Propulsé par{" "}
        <a
          href="https://zoddev.site"
          className="text-violet-500 hover:underline"
        >
          ZodBack
        </a>
      </footer>
    </div>
  );
}
