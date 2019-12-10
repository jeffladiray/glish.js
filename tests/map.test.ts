import { Map } from '../src/map';
import { expect } from 'chai';

describe('Map', () => {
  it('#constructor', () => {
    let map = new Map({ size: 10, baseFrequency: 10, cellSize: 5, seed: 'jeff' });
    expect(map.size).equal(10);
    expect(map.cellSize).equal(5);
  });
  it('#getBiomeLayer', () => {
    let map = new Map({ size: 10, baseFrequency: 10, cellSize: 5, seed: 'jeff' });
    expect(map.layers.biome.getCellAt(0, 0).content.type).to.equal('OCEAN_BIOME');
  }); 
});