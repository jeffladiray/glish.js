import { Layer } from '../src/layer';
import { Cell } from '../src/cell';

import { expect } from 'chai';
describe('Layer', () => {
  it('#constructor', () => {
    const layer = new Layer('biome', 5);
    expect(layer.type).to.equal('biome');
    expect(layer.cellMatrix).to.be.ok;
  });
  it('#init', () => {
    const layer = new Layer('biome', 5);
    class TestCell extends Cell {
      constructor() { super(0); }
    }
    layer.init(TestCell);
    expect(layer.cellMatrix.size).to.equal(5);
  }); 
});