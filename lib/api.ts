const DEFAULT_API_URL = "https://integrations-api.zodev.live";
const LEGACY_API_HOSTS = new Set(["api.zoddev.site", "api.zodev.live"]);
const API_URL = normalizeApiBaseUrl(process.env.ZODBACK_API_URL || DEFAULT_API_URL);
const API_TOKEN = process.env.ZODBACK_API_TOKEN?.trim() || "";

function normalizeApiBaseUrl(value: string): string {
  try {
    const url = new URL(value.trim());
    if (LEGACY_API_HOSTS.has(url.hostname)) {
      throw new Error(`Legacy ZodBack API host is not allowed: ${url.hostname}`);
    }
    return url.origin;
  } catch {
    throw new Error("ZODBACK_API_URL must be an absolute URL on the canonical API host");
  }
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_TOKEN) throw new Error("Landing indisponible : ZODBACK_API_TOKEN manquant");

  const method = options?.method || "GET";
  const res = await fetch(`${API_URL}/api/landing-pages/v1/public/${path}`, {
    ...options,
    headers: {
      "x-api-key": API_TOKEN,
      "x-project-id": "6",
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...(method === "GET" ? { next: { revalidate: 60 } } : { cache: "no-store" }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getAll() {
  return fetchApi<{ company: unknown; pages: unknown[]; sectors: unknown[] }>("all");
}

export async function getPages() {
  return fetchApi<{ success: boolean; data: LandingPage[] }>("pages");
}

export async function getPageBySlug(slug: string) {
  return fetchApi<{ success: boolean; data: LandingPageFull }>(
    `pages/${slug}`
  );
}

export async function getSectors() {
  return fetchApi<{ success: boolean; data: Sector[] }>("sectors");
}

export async function getCompanyProfile() {
  return fetchApi<{ success: boolean; data: CompanyProfile }>(
    "company-profile"
  );
}

export async function submitLead(
  slug: string,
  formData: Record<string, string>
) {
  return fetchApi<{ success: boolean; data: unknown }>(`pages/${slug}/leads`, {
    method: "POST",
    body: JSON.stringify({ formData, source: "website" }),
  });
}

export interface CompanyProfile {
  id: number;
  companyName: string;
  logo: string | null;
  websiteUrl: string | null;
  industry: string | null;
  headline: string | null;
  bio: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  socialLinks: Record<string, string> | null;
  brand: Record<string, string> | null;
  isPublished: boolean;
}

export interface LandingPage {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  status: string;
  featuredImage: string | null;
  publishedAt: string | null;
  seo: Record<string, string> | null;
  branding: Record<string, string> | null;
}

export interface Section {
  id: number;
  type: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  settings: Record<string, unknown> | null;
  sortOrder: number;
  isVisible: boolean;
}

export interface LandingPageFull extends LandingPage {
  sections: Section[];
  companyProfile: CompanyProfile | null;
  sector: Sector | null;
}

export interface Sector {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}
