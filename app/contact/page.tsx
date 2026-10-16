import Link from "next/link";
import { getCompanyProfile } from "@/lib/api";

export default async function ContactPage() {
  let company: Awaited<ReturnType<typeof getCompanyProfile>>["data"] | null = null;

  try {
    const res = await getCompanyProfile();
    company = res.data;
  } catch {}

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-violet-600">
            {company?.companyName || "Lora Chavez"}
          </Link>
          <nav className="flex gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-violet-600">Accueil</Link>
            <Link href="/pages" className="hover:text-violet-600">Pages</Link>
            <Link href="/contact" className="text-violet-600">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="py-16 px-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">Contact</h1>
          <p className="text-gray-500 mb-10">
            Prenez contact pour discuter de votre projet.
          </p>

          <div className="space-y-4 mb-10">
            {company?.contactEmail && (
              <div className="flex items-center gap-3">
                <span className="text-violet-600 font-medium">Email :</span>
                <a href={`mailto:${company.contactEmail}`} className="text-gray-700 hover:text-violet-600">
                  {company.contactEmail}
                </a>
              </div>
            )}
            {company?.contactPhone && (
              <div className="flex items-center gap-3">
                <span className="text-violet-600 font-medium">Téléphone :</span>
                <a href={`tel:${company.contactPhone}`} className="text-gray-700 hover:text-violet-600">
                  {company.contactPhone}
                </a>
              </div>
            )}
            {company?.websiteUrl && (
              <div className="flex items-center gap-3">
                <span className="text-violet-600 font-medium">Site web :</span>
                <a href={company.websiteUrl} target="_blank" rel="noopener" className="text-gray-700 hover:text-violet-600">
                  {company.websiteUrl}
                </a>
              </div>
            )}
          </div>

          {!company?.contactEmail && !company?.contactPhone && (
            <p className="text-gray-400 text-center py-8">
              Informations de contact en cours de configuration.
            </p>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
        Propulsé par{" "}
        <a href="https://zodev.live" className="text-violet-500 hover:underline">ZodBack</a>
      </footer>
    </div>
  );
}
