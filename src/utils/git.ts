
import * as fs from 'fs';
import * as path from 'path';

export function findGitRoot(start: string, maxUp = 10): string | null {
  let cur = path.resolve(start);
  for (let i = 0; i < maxUp; i++) {
    if (fs.existsSync(path.join(cur, '.git'))) return cur;
    const parent = path.dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }
  return null;
}
