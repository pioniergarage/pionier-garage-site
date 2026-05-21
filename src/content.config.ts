import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from 'astro/zod';
import site_config from './content/site_config.json'

export const SiteSettingsConfigSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  fallbackImage: z.string().optional(),
  socialMedias: z.array(
    z.object({
      name: z.string(),
      link: z.string(),
      icon: z.string(),
    })
  ).default([]),

  sponsors: z.array(
    z.object({
      name: z.string().optional(),
      link: z.string().optional(),
      image: z.string().optional(),
      tier: z.enum([
        'Gold',
        'Silver',
        'Bronze',
        'Supporter',
        'Partner',
        'None'
      ]).default('None'),
    })
  ).default([]),
});

const settings = SiteSettingsConfigSchema.parse(site_config);

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema:
    z.object({
      author: z.string().default(""),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      language: z.enum(["EN", "DE"]).default("EN"),
      ogImage: z.string().default(settings.fallbackImage ?? ""),
      slug: z.string().optional(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default([]),
      description: z.string().optional(),
    }),
});

const buttonSchema = z
  .object({
    text: z.string().optional(),
    link: z.string().optional(),
  }).optional();

const styleSchema = z
  .object({
    alignment: z.enum(["left", "center", "right"]),
    size: z.enum(["full", "half", "third","screen"]),
    className: z.string().optional(),
  }).default({ alignment: "left", size: "full" });

export type Style = z.infer<typeof styleSchema>;

const heroBlockSchema = z.object({
  type: z.literal("hero"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  heroTagline: z.string().optional(),
  image: z.string().default(settings.fallbackImage ?? ""),
  button: buttonSchema,
  style: styleSchema,
});

const linkTagCloudBlockSchema = z.object({
  type: z.literal("tag-cloud"),
  title: z.string().optional(),
  style: styleSchema,
  tags: z
    .array(
      z.object({
        text: z.string().optional(),
        link: z.string().optional(),
        icon: z.string().optional(),
        style: styleSchema,
      })
    )
    .optional(),
});

const sectionWrapperSchema = z.object({
  type: z.literal("section"),
  header: z.string().optional(),
  body: z.string().optional(),
  style: styleSchema,
});

const imageBlockSchema = z.object({
  type: z.literal("image"),
  image: z.string().default(settings.fallbackImage ?? ""),
  size: z.enum(["small", "medium", "large"]).optional(),
  style: styleSchema,
});

const customBlockBlockSchema = z.object({
  type: z.literal("custom-block"),
  component: z.string().optional(),
  style: styleSchema,
});

const richTextBlockSchema = z.object({
  type: z.literal("rich-text"),
  content: z.string().optional(),
  style: styleSchema,
});

const formBlockSchema = z.object({
  type: z.literal("form"),
  url: z.string().optional(),
  style: styleSchema,
});

const actionButtonBlockSchema = z.object({
  type: z.literal("button"),
  style: styleSchema,
  button: buttonSchema
});

const faqBlockSchema = z.object({
  type: z.literal("faq"),
  items: z
    .array(
      z.object({
        question: z.string().optional(),
        answer: z.string().optional(),
      })
    )
    .optional(),
  style: styleSchema,
});

const postsBlockSchema = z.object({
  type: z.literal("posts"),
  sort: z.enum(["latest", "top"]).default("latest"),
  style: styleSchema,
});

const separatorBlockSchema = z.object({
  type: z.literal("separator"),
  size: z.string().optional(),
  direction: z.enum(["horizontal", "vertical"]).default("horizontal"),
  style: styleSchema,
});

const spacerBlockSchema = z.object({
  type: z.literal("spacer"),
  size: z.string().optional(),
  style: styleSchema,
});

const embedBlockSchema = z.object({
  type: z.literal("embed"),
  url: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  style: styleSchema,
});

const socialMediasBlockSchema = z.object({
  type: z.literal("social-medias"),
  style: styleSchema,
});

const pageBlockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  linkTagCloudBlockSchema,
  sectionWrapperSchema,
  imageBlockSchema,
  customBlockBlockSchema,
  richTextBlockSchema,
  formBlockSchema,
  actionButtonBlockSchema,
  faqBlockSchema,
  postsBlockSchema,
  separatorBlockSchema,
  spacerBlockSchema,
  embedBlockSchema,
  socialMediasBlockSchema,
]);

const pages = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/pages",
    generateId: (options) => {
      const lang = (options.data.language as string).toLowerCase();
      const slug = options.data.slug;
      return slug ? `${lang}${slug}` : lang;
    }
  }),
  schema: z.object({
    title: z.string(),
    language: z.enum(["EN", "DE"]).default("EN"),
    slug: z.string(), // Required based on yaml
    description: z.string().optional(),
    layout: z.string().default("../layouts/PageLayout.astro"),
    blocks: z.array(pageBlockSchema).default([]),
  }),
});

export const collections = { blog, pages };



export const SiteHeaderSchema = z.object({
  logo: z.string().optional(),
  navbar: z.array(
    z.object({
      url: z.string(),
    })
  ).default([]),
  styleOverrides: z.string().optional(),
});

export const SiteFooterSchema = z.object({
  centerText: z.string().optional(),
  impressum: z.string().optional(),
  datenschutz: z.string().optional(),
  kontakt: z.string().optional(),
  additionalNavbar: z.array(
    z.object({
      label: z.string(),
      url: z.string(),
    })
  ).default([]),
  styleOverrides: z.string().optional(),
});

export const TeamDirectorySchema = z.array(z.object({
  title: z.string(), //Name
  position: z.string(),
  image: z.string().default(settings.fallbackImage ?? ""),
  email: z.email(),
  startDate: z.coerce.date(),
})
).default([]);