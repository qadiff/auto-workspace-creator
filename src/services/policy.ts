
import * as path from 'path';
import { isPathIgnored, sanitizeFileName } from '../utils/fs';
import { findGitRoot } from '../utils/git';

export type ConfirmationMode = 'alwaysAsk' | 'askOncePerRepo' | 'silentIfSafe' | 'never';

export interface PolicyConfig {
  enabled: boolean;
  confirmationMode: ConfirmationMode;
  writeToRepoRootIfDetected: boolean;
  workspaceFileNamePattern: string;
  sanitizeName: boolean;
  ignorePaths: string[];
}

export interface PolicyInput {
  folder: string;
  projectSignal: boolean;
}

export interface PolicyDecision {
  allow: boolean;
  ask: boolean;
  workspacePath: string | null;
  reason: string;
  repoRoot: string | null;
}

export function decide(cfg: PolicyConfig, input: PolicyInput): PolicyDecision {
  if (!cfg.enabled) return { allow: false, ask: false, workspacePath: null, reason: 'disabled', repoRoot: null };

  if (isPathIgnored(input.folder, cfg.ignorePaths)) {
    return { allow: false, ask: false, workspacePath: null, reason: 'ignored-path', repoRoot: null };
  }

  if (!input.projectSignal) {
    return { allow: false, ask: false, workspacePath: null, reason: 'no-project-signal', repoRoot: null };
  }

  const repoRoot = findGitRoot(input.folder) || null;
  const baseDir = (cfg.writeToRepoRootIfDetected && repoRoot) ? repoRoot : input.folder;
  const name = path.basename(baseDir);
  const fileName = cfg.sanitizeName ? sanitizeFileName(name) : name;
  const workspacePath = path.join(baseDir, `${fileName}.code-workspace`);

  switch (cfg.confirmationMode) {
    case 'never':
      return { allow: false, ask: false, workspacePath, reason: 'never', repoRoot };
    case 'silentIfSafe':
      return { allow: true, ask: false, workspacePath, reason: 'silentIfSafe', repoRoot };
    case 'askOncePerRepo':
    case 'alwaysAsk':
    default:
      return { allow: true, ask: true, workspacePath, reason: 'ask', repoRoot };
  }
}
