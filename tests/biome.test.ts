import { Biome } from '../src/constants';

import { expect } from 'chai';

const biome = new Biome('TEST_BIOME', (elevation) => { return elevation > 0 }, { resource: 0 });


describe('Biome', () => {
  it('#constructor', () => {
    expect(biome.type).to.equal('TEST_BIOME');
    expect(biome.is(0.1)).to.equal(true);
  });
  it('#serialize', () => {
    expect(biome.serialize().type).to.equal('TEST_BIOME');
  });
});