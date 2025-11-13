
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function writeWorkspaceAndReopen(wsPath: string) {
  const dir = path.dirname(wsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(wsPath)) {
    const content = JSON.stringify({
      folders: [{ path: '.' }],
      settings: {},
      extensions: { recommendations: [] }
    }, null, 2);
    fs.writeFileSync(wsPath, content, 'utf-8');
  }
  await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(wsPath), true);
}
