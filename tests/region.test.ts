import { Map } from '../src/map';
import { Cell } from '../src/cell';

import { RegionTagger } from '../src/region';

import { expect } from 'chai';

describe('RegionTagger', () => {
  it('#findRegions', () => {
    const map = new Map({ size: 5, baseFrequency: 100, cellSize: 8, seed: 'glish' });
    const regionTagger = new RegionTagger<Cell>(map.layers.biome, (a: Cell, b: Cell) => a.content.type === b.content.type);
    const rgs = regionTagger.iterativeBFS(regionTagger.layer);
    expect(rgs.getCellById(1).content.id).to.equal(1); // Expect edges for ocean to be 5
  });
});