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