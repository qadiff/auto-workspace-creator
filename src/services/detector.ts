
import * as fs from 'fs';
import * as path from 'path';

export interface DetectionOptions {
  upDepth: number;
  downDepth: number;
  keyFiles: string[];
}


export interface DetectionResult {
  ancestorWorkspace: string | null;
  childWorkspaces: string[];
  projectSignal: boolean;
}

function hasWorkspaceFile(dir: string): string | null {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    if (f.isFile() && f.name.endsWith('.code-workspace')) {
      return path.join(dir, f.name);
    }
  }
  return null;
}

export function detect(start: string, opts: DetectionOptions): DetectionResult {
  // 1) scan ancestors
  let cur = path.resolve(start);
  for (let i = 0; i < opts.upDepth; i++) {
    const found = hasWorkspaceFile(cur);
    if (found) return { ancestorWorkspace: found, childWorkspaces: [], projectSignal: hasProjectSignal(start, opts.keyFiles) };
    const parent = path.dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }

  
// 2) scan down up to downDepth
const foundChildren: string[] = [];
function scanDown(dir: string, depth: number) {
  if (depth < 0) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  // workspace at current dir?
  for (const e of entries) {
    if (e.isFile() && e.name.endsWith('.code-workspace')) {
      foundChildren.push(path.join(dir, e.name));
    }
  }
  if (depth === 0) return;
  for (const e of entries) {
    if (e.isDirectory()) {
      scanDown(path.join(dir, e.name), depth - 1);
    }
  }
}
scanDown(start, Math.max(0, opts.downDepth));

return { ancestorWorkspace: null, childWorkspaces: foundChildren, projectSignal: hasProjectSignal(start, opts.keyFiles) };
}

export function hasProjectSignal(dir: string, keyFiles: string[]): boolean {
  const files = fs.readdirSync(dir);
  // Direct match
  for (const k of keyFiles) {
    if (k.includes('*')) continue;
    if (files.includes(k)) return true;
  }
  // Glob for *.sln
  if (keyFiles.some(k => k.includes('*.sln'))) {
    if (files.some(f => f.endsWith('.sln'))) return true;
  }
  // .git ancestor is signal too
  let cur = dir;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(cur, '.git'))) return true;
    const parent = path.dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }
  return false;
}
