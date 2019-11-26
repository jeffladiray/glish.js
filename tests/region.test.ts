import { BiomeCell } from '../src/biome';
import { Map } from '../src/map';
import { RegionTagger } from '../src/region';
import { Renderer } from '../src/renderer';

import { expect } from 'chai';

describe('RegionTagger', () => {
  it('#findRegions', () => {
    const map = new Map({ size: 5, baseFrequency: 100, cellSize: 8, seed: 'glish' });
    const regionTagger = new RegionTagger<BiomeCell>(map.getBiomeLayer(), (a: BiomeCell, b: BiomeCell) => a.biome.type === b.biome.type);
    const rgs = regionTagger.findRegions(regionTagger.layer);
    expect(rgs).to.have.length(2); // Expecting 5 regions
    expect(rgs[0].edges).to.have.length(5); // Expect edges for ocean to be 5
    expect(rgs[1].edges).to.have.length(5); // Expect edges for ocean to be 5
  });
});