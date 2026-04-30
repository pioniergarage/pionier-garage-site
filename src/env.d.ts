/// <reference types="astro/client" />
import type PocketBase from 'pocketbase';

declare global {
  namespace App {
    interface Locals {
      pb: PocketBase;
      user: Record<string, unknown> | null;
    }
  }
}

export {};
