import { MapBuilder } from '../src/mapBuilder';
import { expect } from 'chai';
import MapSpec from '../src/mapSpec';

describe('Chunk', () => {
    it('#constructor', () => {
        const chunk = new MapBuilder(new MapSpec(10, 15, 2, 10, 10, 'glish', 10, 10, 10, 10));
        expect(chunk.sizeW).equal(15);
        expect(chunk.sizeH).equal(10);
        expect(chunk.cellSize).equal(10);
    });
    it('#getBiomeLayer', () => {
        const chunk = new MapBuilder(new MapSpec(10, 15, 2, 10, 10, 'glish', 10, 10, 10, 10));
        expect(chunk.layers.biome.getCellAt(0, 0).content.type).to.equal('GRASS_BIOME');
    });
});
