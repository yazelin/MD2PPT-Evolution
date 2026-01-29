/**
 * Fork-specific Vite config overrides.
 * This file is NOT present in upstream — it won't cause merge conflicts.
 * Exported function receives the upstream config and returns the modified version.
 */
import type { UserConfig } from 'vite';

export function applyOverrides(config: UserConfig): UserConfig {
  // Vercel 環境用 '/'，GitHub Pages 用 '/MD2PPT-Evolution/'
  const isVercel = process.env.VERCEL === '1';
  if (isVercel) {
    config.base = '/';
  }

  return config;
}
