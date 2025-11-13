
import * as vscode from 'vscode';
import { localize } from '../nls';

export async function confirmCreate(wsPath: string): Promise<'yes'|'no'> {
  const yes = localize('confirmCreate.yes', 'Create & Reopen');
  const no = localize('confirmCreate.no', 'Not Now');
  const msg = localize('confirmCreate.msg', 'No workspace file found for this folder. Create one here?\n{0}', wsPath);
  const pick = await vscode.window.showInformationMessage(msg, { modal: false }, yes, no);
  return pick === yes ? 'yes' : 'no';
}
