import { getLocale, SUPPORTED_LOCALES } from "./i18n";

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
export function localized(
  linkRaw: string | undefined,
  localeRaw: string | undefined,
  locales: readonly string[] = SUPPORTED_LOCALES,
): string {
  if (!linkRaw || !localeRaw) return "";

  // Preserve absolute and non-HTTP URI schemes such as mailto: and tel:.
  if (/^[a-z][a-z\d+.-]*:/i.test(linkRaw) || linkRaw.startsWith("//")) {
    return linkRaw;
  }

  const locale = getLocale(localeRaw);
  const knownLocales = locales.map((item) => item.toLowerCase());
  const path = linkRaw.startsWith("/") ? linkRaw : `/${linkRaw}`;
  const firstSegment = path.split("/", 3)[1]?.toLowerCase();

  // An explicitly localized link is intentional and should not be rewritten.
  if (firstSegment && knownLocales.includes(firstSegment)) {
    return path;
  }

  return `/${locale}${path}`;
}
