import { Map } from '../src/map';
import { expect } from 'chai';

describe('Map', () => {
    it('#constructor', () => {
        const map = new Map({ sizeW: 10, sizeH: 15, chunkSize: 2, baseFrequency: 10, cellSize: 5, seed: 'glish' });
        expect(map.chunkSize).equal(2);
        expect(map.cellSize).equal(5);
    });
    it('#computeChunks', () => {
        const map = new Map({ sizeW: 10, sizeH: 15, chunkSize: 2, baseFrequency: 10, cellSize: 5, seed: 'glish' });
        console.warn(map);
    });
});
