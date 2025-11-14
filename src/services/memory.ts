
import * as crypto from 'crypto';

export class RepoMemory {
  constructor(private globalState: { 
    get: <T>(key: string) => T | undefined; 
    update: (key: string, value: unknown) => Thenable<void> 
  }) {}

  private keyFor(repoRoot: string | null): string {
    const base = repoRoot || 'no-repo';
    const hash = crypto.createHash('sha1').update(base).digest('hex');
    return `autoWorkspaceCreator.decision.${hash}`;
  }

  public getDecision(repoRoot: string | null): 'allow' | 'deny' | undefined {
    return this.globalState.get(this.keyFor(repoRoot));
  }

  public async setDecision(repoRoot: string | null, decision: 'allow' | 'deny') {
    await this.globalState.update(this.keyFor(repoRoot), decision);
  }
}
