import type { BlockTypes } from "../types/types.ts";
import ButtonBlock from "./ButtonBlock.astro";
import CustomComponentBlock from "./CustomComponentBlock.astro";
import EmbedBlock from "./EmbedBlock.astro";
import FAQBlock from "./FAQBlock.astro";
import FormBlock from "./FormBlock.astro";
import HeroBlock from "./HeroBlock.astro";
import HighlightCardsBlock from "./HighlightCardsBlock.astro";
import ImageBlock from "./ImageBlock.astro";
import LinkTagCloudBlock from "./LinkTagCloudBlock.astro";
import PostsBlock from "./PostsBlock.astro";
import RichTextBlock from "./RichTextBlock.astro";
import SectionBlock from "./SectionBlock.astro";
import SeparatorBlock from "./SeparatorBlock.astro";
import SocialMediasBlock from "./SocialMediasBlock.astro";
import SpacerBlock from "./SpacerBlock.astro";
import TestimonialsBlock from "./TestimonialsBlock.astro";


/***
 * Register blocks here. Field name corresponds to the 'name' in `content.config.ts` and the value corresponds to the Astro file which will be used to render the given block.
 * 
 * Why `Partial<Record<Type, any>>`? This is compile-time only, and makes it so that TypeScript will complain if you misspell the keys or add a key that doesn't exist on `content.config.ts`. If you find this type-checking irritating, you can remove it and the behaviour of the app will not change.
 */
export const BlockComponents: Partial<Record<BlockTypes, any>> = {
  'button': ButtonBlock,
  'custom-block': CustomComponentBlock,
  'embed': EmbedBlock,
  'faq': FAQBlock,
  'form': FormBlock,
  'hero': HeroBlock,
  'highlight-cards': HighlightCardsBlock,
  'image': ImageBlock,
  'posts': PostsBlock,
  'rich-text': RichTextBlock,
  'section': SectionBlock,
  'separator': SeparatorBlock,
  'social-medias': SocialMediasBlock,
  'spacer': SpacerBlock,
  'tag-cloud': LinkTagCloudBlock,
  'testimonials': TestimonialsBlock,
};