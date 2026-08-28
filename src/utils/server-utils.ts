import { getCollection } from "astro:content";
import type { Locale } from "./i18n";

export async function getNavLinks(lang: Locale, navbar: { url: string }[]) {
  const allPages = await getCollection('pages');

  return navbar.map((item) => {
    // Use the requested translation when it exists. English mirrors Astro's
    // configured fallback and gives the navigation a useful label while a new
    // translation is still being prepared.
    const page =
      allPages.find(
        (p) => p.id.startsWith(`${lang}/`) && p.id.endsWith(item.url),
      ) ??
      allPages.find(
        (p) => p.id.startsWith("en/") && p.id.endsWith(item.url),
      );

    return {
      href: item.url,
      label: page?.data.title || item.url, // Fallback to URL if title is missing
    };
  });
}
