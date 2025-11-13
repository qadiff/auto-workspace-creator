
import { expect } from 'chai';
import { hasProjectSignal } from '../src/services/detector';
import * as fs from 'fs';
import * as path from 'path';

describe('detector', () => {
  it('treats .git ancestor as project signal', () => {
    const tmp = fs.mkdtempSync(path.join(process.cwd(), 'tmpdet-'));
    const git = path.join(tmp, '.git');
    fs.mkdirSync(git);
    const child = path.join(tmp, 'child');
    fs.mkdirSync(child);
    expect(hasProjectSignal(child, [])).to.be.true;
    fs.rmSync(tmp, { recursive: true, force: true });
  });
});
