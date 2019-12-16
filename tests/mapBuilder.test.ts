import { MapBuilder } from '../src/MapBuilder';
import { expect } from 'chai';

describe('Chunk', () => {
    it('#constructor', () => {
        const chunk = new MapBuilder({
            sizeW: 10,
            sizeH: 10,
            baseFrequency: 10,
            cellSize: 5,
            computeNoiseWithFrequency: (): number => 0,
        });
        expect(chunk.sizeW).equal(10);
        expect(chunk.sizeH).equal(10);
        expect(chunk.cellSize).equal(5);
    });
    it('#getBiomeLayer', () => {
        const chunk = new MapBuilder({
            sizeW: 10,
            sizeH: 10,
            baseFrequency: 10,
            cellSize: 5,
            computeNoiseWithFrequency: (): number => 0,
        });
        expect(chunk.layers.biome.getCellAt(0, 0).content.type).to.equal('OCEAN_BIOME');
    });
});
