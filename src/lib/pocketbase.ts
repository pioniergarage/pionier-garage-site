import PocketBase from 'pocketbase';
/**
 * Pocketbase instance
 */
export const pb = new PocketBase(import.meta.env.PUBLIC_POCKETBASE_URL);

pb.autoCancellation(false);