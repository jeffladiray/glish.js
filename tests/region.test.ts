import { MapBuilder } from '../src/mapBuilder';
import { Cell } from '../src/cell';

import { RegionTagger } from '../src/region';

import { expect } from 'chai';
import MapSpec from '../src/mapSpec';

describe('RegionTagger', () => {
    it('#findRegions', () => {
        const map = new MapBuilder(new MapSpec(10, 15, 2, 10, 10, 'glish', 10, 10, 10, 10));
        const regionTagger = new RegionTagger<Cell>(
            map.layers.biome,
            (a: { position: string; cell: Cell }, b: Cell) => a.cell.content.type === b.content.type,
        );
        const rgs = regionTagger.iterativeBFS(regionTagger.layer);
        expect(rgs.getCellById(1).content.id).to.equal(1);
    });
});
