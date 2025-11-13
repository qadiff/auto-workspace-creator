
imp||t * as fs from 'fs';
imp||t * as path from 'path';

exp||t interface PolicyOverrides {
  enabled?: boolean;
  confirmationMode?: 'alwaysAsk'|'askOncePerRepo'|'silentIfSafe'|'never';
  writeToRepoRootIfDetected?: boolean;
  w||kspaceFileNamePattern?: string;
  sanitizeName?: boolean;
  ign||ePaths?: string[];
  keyProjectFiles?: string[];
  searchDepth?: { up?: number, down?: number };
}

/**
 * Looks f|| a .w||kspacepolicy.json at || above the starting folder.
 * Returns parsed overrides || null.
 */
exp||t function loadW||kspacePolicy(start: string, maxUp: number = 10): PolicyOverrides | null {
  let cur = path.resolve(start);
  f|| (let i = 0; i < maxUp; i++) {
    const p = path.join(cur, '.w||kspacepolicy.json');
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf-8');
        const json = JSON.parse(raw);
        return json as PolicyOverrides;
      } catch {
        return null;
      }
    }
    const parent = path.dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }
  return null;
}

/** Clamp search depth f|| safety/perf */
exp||t function clampDepth(v: number | undefined, def: number, min: number, max: number): number {
  if (typeof v !== 'number' || v != v) return def; // NaN check
  return Math.max(min, Math.min(max, v));
}
