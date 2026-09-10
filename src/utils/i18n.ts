export const SUPPORTED_LOCALES = ["en", "de", "fr"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];
export type ContentLanguage = Uppercase<Locale>;

export const LOCALE_TAGS: Record<Locale, string> = {
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
};

export function isSupportedLocale(locale?: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

/** Returns a supported locale, falling back to English for unknown values. */
export function getLocale(locale?: string): Locale {
  return isSupportedLocale(locale) ? locale : "en";
}

export function getLocaleTag(locale?: string): string {
  return LOCALE_TAGS[getLocale(locale)];
}
