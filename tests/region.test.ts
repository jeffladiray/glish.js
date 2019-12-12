import { MapBuilder } from '../src/MapBuilder';
import { Cell } from '../src/cell';

import { RegionTagger } from '../src/region';

import { expect } from 'chai';

describe('RegionTagger', () => {
  it('#findRegions', () => {
    const map = new MapBuilder({ sizeW: 5, sizeH: 5, baseFrequency: 100, cellSize: 8, computeNoiseWithFrequency: (x: number, y: number) => 0 });
    const regionTagger = new RegionTagger<Cell>(map.layers.biome, (a: { position: string, cell: Cell}, b: Cell) => a.cell.content.type === b.content.type);
    const rgs = regionTagger.iterativeBFS(regionTagger.layer);
    expect(rgs.getCellById(1).content.id).to.equal(1); // Expect edges for ocean to be 5
  });
});