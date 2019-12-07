import { Map } from '../src/map';
import { Cell } from '../src/cell';

import { RegionTagger } from '../src/region';

import { expect } from 'chai';

describe('RegionTagger', () => {
  it('#findRegions', () => {
    const map = new Map({ size: 5, baseFrequency: 100, cellSize: 8, seed: 'glish' });
    const regionTagger = new RegionTagger<Cell>(map.layers.biome, (a: Cell, b: Cell) => a.content.type === b.content.type);
    const rgs = regionTagger.findRegions(regionTagger.layer);
    expect(rgs).to.have.length(2); // Expecting 5 regions
    expect(rgs[0].edges).to.have.length(5); // Expect edges for ocean to be 5
    expect(rgs[1].edges).to.have.length(5); // Expect edges for ocean to be 5
  });
});