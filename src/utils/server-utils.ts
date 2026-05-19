import { getCollection } from "astro:content";

export async function getNavLinks(lang: 'de' | 'en', navbar: { url: string }[]) {
  const allPages = await getCollection('pages');

  return navbar.map((item) => {
    // Find the page matching the URL and the language
    const page = allPages.find((p: { id: string; }) => {
      // Logic assumes your slugs or IDs follow a pattern like 'en/events' or 'de/events'
      return p.id.startsWith(`${lang}/`) && p.id.endsWith(item.url);
    });

    return {
      href: item.url,
      label: page?.data.title || item.url, // Fallback to URL if title is missing
    };
  });
}