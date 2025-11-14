
import * as vscode from 'vscode';
import { detect } from './services/detector';
import { decide, PolicyConfig } from './services/policy';
import { writeWorkspaceAndReopen } from './services/creator';
import { confirmCreate } from './ui/prompts';
import { RepoMemory } from './services/memory';
import { loadWorkspacePolicy, clampDepth } from './utils/policyFile';


type ConfirmationMode = 'alwaysAsk' | 'askOncePerRepo' | 'silentIfSafe' | 'never';

function getConfig(): PolicyConfig & { searchDepth: {up: number, down: number}, keyProjectFiles: string[] } {
  const cfg = vscode.workspace.getConfiguration('autoWorkspaceCreator');
  const baseCfg = {
    enabled: cfg.get<boolean>('enabled', true),
    confirmationMode: cfg.get<ConfirmationMode>('confirmationMode', 'alwaysAsk'),
    writeToRepoRootIfDetected: cfg.get<boolean>('writeToRepoRootIfDetected', true),
    workspaceFileNamePattern: cfg.get<string>('workspaceFileNamePattern', '${folderName}.code-workspace'),
    sanitizeName: cfg.get<boolean>('sanitizeName', true),
    ignorePaths: cfg.get<string[]>('ignorePaths', ['~','/etc','/var','/tmp','node_modules','C:\\Windows','C:\\Program Files','/System','/Library']),
    searchDepth: cfg.get<{up: number, down: number}>('searchDepth', {up: 10, down: 1}),
    keyProjectFiles: cfg.get<string[]>('keyProjectFiles', ['.git','package.json','pnpm-workspace.yaml','pyproject.toml','requirements.txt','Pipfile','Cargo.toml','go.mod','pom.xml','build.gradle','*.sln'])
  };

  // Policy file overrides
  const folders = vscode.workspace.workspaceFolders;
  const folder = folders && folders.length ? folders[0].uri.fsPath : undefined;
  if (folder) {
    const policy = loadWorkspacePolicy(folder, 10);
    if (policy) {
      if (typeof policy.enabled === 'boolean') baseCfg.enabled = policy.enabled;
      if (policy.confirmationMode) baseCfg.confirmationMode = policy.confirmationMode;
      if (typeof policy.writeToRepoRootIfDetected === 'boolean') baseCfg.writeToRepoRootIfDetected = policy.writeToRepoRootIfDetected;
      if (typeof policy.workspaceFileNamePattern === 'string') baseCfg.workspaceFileNamePattern = policy.workspaceFileNamePattern;
      if (typeof policy.sanitizeName === 'boolean') baseCfg.sanitizeName = policy.sanitizeName;
      if (Array.isArray(policy.ignorePaths)) baseCfg.ignorePaths = policy.ignorePaths;
      if (Array.isArray(policy.keyProjectFiles)) baseCfg.keyProjectFiles = policy.keyProjectFiles;
      if (policy.searchDepth) {
        baseCfg.searchDepth = {
          up: clampDepth(policy.searchDepth.up, baseCfg.searchDepth.up, 0, 20),
          down: clampDepth(policy.searchDepth.down, baseCfg.searchDepth.down, 0, 2) // allow up to 2
        };
      }
    }
  }

  // Clamp depth even without policy (safety)
  baseCfg.searchDepth = {
    up: clampDepth(baseCfg.searchDepth.up, 10, 0, 20),
    down: clampDepth(baseCfg.searchDepth.down, 1, 0, 2)
  };

  return baseCfg;
}

async function maybeCreate(context: vscode.ExtensionContext) {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) return;
  
  const folder = folders[0].uri.fsPath;
  const cfg = getConfig();
  const det = detect(folder, { upDepth: cfg.searchDepth.up, downDepth: cfg.searchDepth.down, keyFiles: cfg.keyProjectFiles });
  
  // If workspace file found, skip
  if (det.ancestorWorkspace || det.childWorkspaces.length > 0) return;
  
  const decision = decide(cfg, { folder, projectSignal: det.projectSignal });
  if (!decision.allow) return;
  
  const memory = new RepoMemory(context.globalState);
  
  // Check askOncePerRepo mode
  if (cfg.confirmationMode === 'askOncePerRepo') {
    const prev = memory.getDecision(decision.repoRoot);
    if (prev === 'deny') return;
    if (prev === 'allow') {
      await writeWorkspaceAndReopen(decision.workspacePath!);
      return;
    }
  }
  
  if (decision.ask) {
    const result = await confirmCreate(decision.workspacePath!);
    if (!result) {
      if (cfg.confirmationMode === 'askOncePerRepo') {
        await memory.setDecision(decision.repoRoot, 'deny');
      }
      return;
    }
    if (cfg.confirmationMode === 'askOncePerRepo') {
      await memory.setDecision(decision.repoRoot, 'allow');
    }
  }
  
  await writeWorkspaceAndReopen(decision.workspacePath!);
}


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('autoWorkspaceCreator.createNow', async () => {
      await maybeCreate(context);
    }),
    vscode.commands.registerCommand('autoWorkspaceCreator.findAndOpenNearest', async () => {
      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) return;
      const folder = folders[0].uri.fsPath;
      const cfg = getConfig();
      const det = detect(folder, { upDepth: cfg.searchDepth.up, downDepth: cfg.searchDepth.down, keyFiles: cfg.keyProjectFiles });
      const target = det.ancestorWorkspace || (det.childWorkspaces.length > 0 ? det.childWorkspaces[0] : null);
      if (target) {
        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(target), true);
      } else {
        vscode.window.showInformationMessage('No nearby workspace found.');
      }
    }),
    vscode.commands.registerCommand('autoWorkspaceCreator.toggle', async () => {
      const cfg = vscode.workspace.getConfiguration('autoWorkspaceCreator');
      const current = cfg.get<boolean>('enabled', true);
      await cfg.update('enabled', !current, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`Auto Workspace Creator ${!current ? 'Enabled' : 'Disabled'}.`);
    })
  );

  // run on startup
  maybeCreate(context);
}

export function deactivate() {}
