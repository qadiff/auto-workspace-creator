
import * as vscode from 'vscode';

export async function pickWorkspaceToOpen(anc: string | null, children: string[]): Promise<string | null> {
  const items: vscode.QuickPickItem[] = [];
  const map: string[] = [];
  if (anc) {
    items.push({ label: `$(arrow-up) Ancestor`, description: anc });
    map.push(anc);
  }
  for (const c of children) {
    items.push({ label: `$(folder) Child`, description: c });
    map.push(c);
  }
  if (items.length === 0) return null;
  const choice = await vscode.window.showQuickPick(items, { placeHolder: 'Select a workspace to open' });
  if (!choice) return null;
  const idx = items.findIndex(i => i.description === choice.description);
  return idx >= 0 ? map[idx] : null;
}
