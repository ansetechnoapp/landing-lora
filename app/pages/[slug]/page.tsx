import Link from "next/link";
import { getPageBySlug } from "@/lib/api";
import { LeadForm } from "@/app/components/LeadForm";

export default async function LandingPageDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let page: Awaited<ReturnType<typeof getPageBySlug>>["data"] | null = null;
  let error: string | null = null;

  try {
    const res = await getPageBySlug(slug);
    page = res.data;
  } catch (e) {
    error = e instanceof Error ? e.message : "Page introuvable";
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page introuvable</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link href="/pages" className="text-violet-600 hover:underline">
            Retour aux pages
          </Link>
        </div>
      </div>
    );
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
            <Link href="/pages" className="hover:text-violet-600">Pages</Link>
            <Link href="/contact" className="hover:text-violet-600">Contact</Link>
          </nav>
        </div>
      </header>

      <main>
        {page.featuredImage && (
          <div className="h-64 bg-gray-100 overflow-hidden">
            <img
              src={page.featuredImage}
              alt={page.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mx-auto max-w-4xl px-4 py-12">
          {page.sector && (
            <span className="inline-block bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
              {page.sector.name}
            </span>
          )}
          <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
          {page.description && (
            <p className="text-lg text-gray-500 mb-10">{page.description}</p>
          )}

          {page.sections && page.sections.length > 0 && (
            <div className="space-y-12">
              {page.sections
                .filter((s) => s.isVisible)
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((section) => (
                  <section
                    key={section.id}
                    className="border-l-4 border-violet-200 pl-6"
                  >
                    {section.title && (
                      <h2 className="text-xl font-semibold mb-2">
                        {section.title}
                      </h2>
                    )}
                    {section.subtitle && (
                      <p className="text-violet-600 text-sm mb-3">
                        {section.subtitle}
                      </p>
                    )}
                    {section.content && (
                      <div
                        className="prose prose-gray max-w-none"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    )}
                  </section>
                ))}
            </div>
          )}

          {page.sections?.length === 0 && (
            <p className="text-gray-400 text-center py-8">
              Contenu en cours de création...
            </p>
          )}

          <LeadForm slug={slug} />
        </div>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
        Propulsé par{" "}
        <a href="https://zoddev.site" className="text-violet-500 hover:underline">ZodBack</a>
      </footer>
    </div>
  );
}
