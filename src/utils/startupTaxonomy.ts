const STARTUP_TAXONOMY_TOKEN_MAP: Record<string, string> = {
  ai: "AI",
  api: "API",
  ar: "AR",
  b2b: "B2B",
  b2b2c: "B2B2C",
  b2c: "B2C",
  b2g: "B2G",
  d2c: "D2C",
  hr: "HR",
  iot: "IoT",
  ml: "ML",
  saas: "SaaS",
  sms: "SMS",
  ui: "UI",
  ux: "UX",
  vr: "VR",
};

export function normalizeStartupTaxonomyValue(value?: string): string {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .replaceAll("_", " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function formatStartupTaxonomyLabel(value?: string): string {
  const normalizedValue = normalizeStartupTaxonomyValue(value);

  if (!normalizedValue) {
    return "";
  }

  return normalizedValue
    .split(" ")
    .filter(Boolean)
    .map((token) => STARTUP_TAXONOMY_TOKEN_MAP[token] ?? toTitleCase(token))
    .join(" ");
}

function toTitleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
