import { Layer } from '../src/layer';
import { Cell } from '../src/cell';

import { expect } from 'chai';

const matrix = new Layer('biome', 5);
matrix.initWith((id, x, y) => new Cell(id, { x, y }, false));

describe('Layer', () => {
  it('#constructor', () => {
    expect(matrix.size).to.equal(5);
  });
  it('#getCellAt', () => {
    expect(matrix.getCellAt(0,0).id).to.equal(0);
    const cell = matrix.getCellAt(1,2);
    expect(cell.id).to.equal(11);
    expect(cell.x).to.equal(1);
    expect(cell.y).to.equal(2);
    const cell2 = matrix.getCellAt(3,1);
    expect(cell2.id).to.equal(8);
    expect(cell2.x).to.equal(3);
    expect(cell2.y).to.equal(1);
    expect(matrix.getCellAt(4,4).id).to.equal(24);

    expect(() => matrix.getCellAt(5,5)).to.throw(Error, /x or y/g);
  });

  it('#getCellById', () => {
    const cell = matrix.getCellById(11);
    expect(cell.id).to.equal(11);
    expect(cell.x).to.equal(1);
    expect(cell.y).to.equal(2);
    expect(matrix.getCellById(23).id).to.equal(23);
  });

  it('#toJSON', () => {
    const jsonMatrix = matrix.toJSON();
    expect(jsonMatrix.size).to.equal(5);
    expect(jsonMatrix.type).to.equal('biome');
    expect(jsonMatrix.matrix[0][0].id).to.equal(0);
  });
});