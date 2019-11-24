import { Biome, BiomeCell, BIOME_ARRAY } from '../src/biome';

import { expect } from 'chai';

const biome = new Biome('TEST_BIOME', (elevation) => { return elevation > 0 }, { resource: 'fake.png' });


describe('Biome', () => {
  it('#constructor', () => {
    expect(biome.type).to.equal('TEST_BIOME');
    expect(biome.is(0.1)).to.equal(true);
  });
  it('#serialize', () => {
    expect(biome.serialize().type).to.equal('TEST_BIOME');
  });
});