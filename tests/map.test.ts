import { Map } from '../src/map';
import { expect } from 'chai';
import MapSpec from '../src/mapSpec';

describe('Map', () => {
    it('#constructor', () => {
        const map = new Map(new MapSpec(10, 15, 2, 10, 10, 'glish', 10, 10, 10, 10));
        expect(map.chunkSize).equal(2);
        expect(map.cellSize).equal(10);
    });
    it('#computeChunks', () => {
        const map = new Map(new MapSpec(10, 15, 2, 10, 10, 'glish', 10, 10, 10, 10));
        console.warn(map);
    });
});
