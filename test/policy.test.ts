
import { expect } from 'chai';
import { clampDepth } from '../src/utils/policyFile';

describe('policy depth clamp', () => {
  it('clamps to [0,2] for down', () => {
    expect(clampDepth(5, 1, 0, 2)).to.eq(2);
    expect(clampDepth(-1, 1, 0, 2)).to.eq(0);
  });
});
