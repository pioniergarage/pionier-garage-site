export interface StartupItem {
  collectionId: string;
  collectionName: string;
  externalId: string;
  headerImageUrl: string;
  id: string;
  industry: string;
  lastModified: Date;
  logoUrl: string;
  marketModel: string;
  name: string;
  shortDescription: string,
  stage: string;
}

export interface StartupDetailData {
  id?: string;
  name?: string;
  longDescription?: string;
  shortDescription?: string;
  headerImageUrl?: string;
  logoUrl?: string;
  location?: string;
  headquarters?: string;
  region?: string;
  industry?: string;
  marketModel?: string;
  stage?: string;
  productType?: string;
  website?: string;
  web?: string;
  foundingYear?: string | number;
  foundedYear?: string | number;
  founders?: string | number;
  employees?: string | number;
  ourProduct?: Record<string, unknown>;
  ourCompany?: Record<string, unknown>;
}

export interface PostData {
  id: string;
  author: string;
  pubDatetime: Date;
  title: string;
  language: "EN" | "DE";
  tags: string[];
  modDatetime?: Date | null | undefined;
  ogImage?: string | {
    src: string;
    width: number;
    height: number;
    format: "svg" | "avif" | "png" | "webp" | "jpeg" | "jpg" | "tiff" | "gif";
  } | undefined;
  slug?: string | undefined;
  featured?: boolean | undefined;
  draft?: boolean | undefined;
  description?: string | undefined;
}