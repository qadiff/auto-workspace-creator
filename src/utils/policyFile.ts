
import * as fs from 'fs';
import * as path from 'path';

export interface PolicyOverrides {
  enabled?: boolean;
  confirmationMode?: 'alwaysAsk'|'askOncePerRepo'|'silentIfSafe'|'never';
  writeToRepoRootIfDetected?: boolean;
  workspaceFileNamePattern?: string;
  sanitizeName?: boolean;
  ignorePaths?: string[];
  keyProjectFiles?: string[];
  searchDepth?: { up?: number, down?: number };
}

/**
 * Looks for a .workspacepolicy.json at or above the starting folder.
 * Returns parsed overrides or null.
 */
export function loadWorkspacePolicy(start: string, maxUp: number = 10): PolicyOverrides | null {
  let cur = path.resolve(start);
  for (let i = 0; i < maxUp; i++) {
    const p = path.join(cur, '.workspacepolicy.json');
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

/** Clamp search depth for safety/perf */
export function clampDepth(v: number | undefined, def: number, min: number, max: number): number {
  if (typeof v !== 'number' || v != v) return def; // NaN check
  return Math.max(min, Math.min(max, v));
}
