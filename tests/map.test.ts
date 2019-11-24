import { Map } from '../src/map';
import { expect } from 'chai';

describe('Map', () => {
  it('#constructor', () => {
    let map = new Map({ size: 10, cellW: 5, cellH: 5, seed: 'jeff' });
    expect(map.size).equal(10);
    expect(map.cellWidth).equal(5);
    expect(map.cellHeight).equal(5);
  });
  it('#biomeLayer', () => {
    let map = new Map({ size: 10, cellW: 5, cellH: 5, seed: 'jeff' });
    expect(map.biomeLayer.getCellAt(0, 0).biome.type).to.equal('OCEAN_BIOME');
  }); 
});