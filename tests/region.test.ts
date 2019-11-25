import { BiomeCell } from '../src/biome';
import { Map } from '../src/map';
import { RegionTagger } from '../src/region';
import { expect } from 'chai';

describe('RegionTagger', () => {
  it('#findRegions', () => {
    let map = new Map({ size: 5, baseFrequency: 128, cellSize: 5, seed: 'jeff' });
    const regionTagger = new RegionTagger<BiomeCell>(map.getBiomeLayer(), (a: BiomeCell, b: BiomeCell) => a.biome.type === b.biome.type);
    regionTagger.findRegions(regionTagger.layer);
  });
});