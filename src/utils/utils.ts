import { getCollection } from "astro:content";

export function renderHeadline(text: string): string {
  return text.replace(/\[([^\]]+)\]/g, (_, word) =>
    `<span class="outlined">${word}</span>`
  );
}

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

/**
 * Localizes the given link with the given locale, checked against the list of available locales. Can this be optimized? for sure. Does it work? for sure.
 * @param link The link to parse.
 * @param locale The current locale.
 * @param locales The available locales, skip if you trust the input link.
 * @returns The localized link
 */
export function localized(link: string | undefined, locale: string | undefined, locales: string[] = []): string {
  if (link == undefined || locale == undefined)
    return "";
  if (link.startsWith('/')) {
    for (const loc of locales) {
      if (link.startsWith(loc, 1)) {
        if (link.endsWith(loc)) {
          return `${link}/`
        }
        return link;
      }
      return `/${locale}${link}`
    }
  }
  else {
    for (const loc of locales) {
      if (link.startsWith(loc)) {
        if (link.endsWith(loc)) {
          return `/${link}/`
        }
        return `/${link}`;
      }
    }
  }

  return `/${locale}/${link}`
}