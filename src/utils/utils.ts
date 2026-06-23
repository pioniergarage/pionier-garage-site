export function renderHeadline(text: string): string {
  return text
    // "||" marks an optional break point WITHOUT a hyphen: it becomes a
    // zero-width space (U+200B), so e.g. "Pionier||garage" may break as
    // "Pionier" / "garage" with no visible "-". Handled before single "|".
    .replace(/\|\|/g, "​")
    // A single "|" marks an optional break point WITH a hyphen: it becomes a
    // soft hyphen (U+00AD), so e.g. "Pionier|garage" only breaks as
    // "Pionier-garage" when the word doesn't fit on one line.
    .replace(/\|/g, "­")
    .replace(/\[([^\]]+)\]/g, (_, word) =>
      `<span class="outlined">${word}</span>`
    );
}

/**
 * Localizes the given link with the given locale, checked against the list of available locales. Can this be optimized? for sure. Does it work? for sure.
 * @param link The link to parse.
 * @param locale The current locale.
 * @param locales The available locales, skip if you trust the input link.
 * @returns The localized link
 */
export function localized(link_raw: string | undefined, locale: string | undefined, locales: string[] = []): string {
  if (link_raw?.startsWith('http://') || link_raw?.startsWith('https://') || link_raw?.startsWith('mailto:')) {
    return link_raw ?? "";
  }

  if (link_raw == undefined || locale == undefined)
    return "";
  const link = link_raw.toLowerCase();
  if (link.startsWith('/')) {
    for (const raw_loc of locales) {
      const loc = raw_loc.toLowerCase();
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