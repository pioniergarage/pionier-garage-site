import type { CollectionEntry } from "astro:content";

// The union type encompassing all defined blocks. Uses a utility function from Astro (CollectionEntry)
export type Blocks = CollectionEntry<"pages">["data"]["blocks"][number];

// The union of all possible block types. Indexes field 'type' from Block.
export type BlockTypes = Blocks['type']

/**
 * Utilitiy for extracting the prop type for the given block.
 */
export type BlockProps<T extends Blocks['type']> = Omit<Extract<CollectionEntry<"pages">["data"]["blocks"][number], { type: T }>, 'type'>;