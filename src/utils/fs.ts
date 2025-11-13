
import * as path from 'path';

export function sanitizeFileName(name: string): string {
  // Remove invalid characters for file names on common OSes
  return name.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '-');
}

export function isPathIgnored(target: string, prefixes: string[]): boolean {
  const norm = path.resolve(target);
  for (const p of prefixes) {
    const expanded = p === '~' ? process.env.HOME || '' : p;
    if (!expanded) continue;
    const pref = path.resolve(expanded);
    if (norm.startsWith(pref)) return true;
  }
  return false;
}
