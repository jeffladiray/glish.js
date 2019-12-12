import { Layer } from '../src/layer';
import { Cell } from '../src/cell';

import { expect } from 'chai';

const matrix = new Layer('biome', 3, 2);
matrix.initWith((id, x, y) => new Cell(id, { x, y }, false));

describe('Layer', () => {
  it('#constructor', () => {
    expect(matrix.sizeW).to.equal(3);
    expect(matrix.sizeH).to.equal(2);
  });
  it('#getCellAt', () => {
    expect(matrix.getCellAt(0, 0).id).to.equal(0);
    const cell = matrix.getCellAt(2, 1);
    expect(cell.id).to.equal(5);
    expect(cell.x).to.equal(2);
    expect(cell.y).to.equal(1);
    const cell2 = matrix.getCellAt(2, 0);
    expect(cell2.id).to.equal(2);
    expect(cell2.x).to.equal(2);
    expect(cell2.y).to.equal(0);

    expect(() => matrix.getCellAt(5, 5)).to.throw(Error, /x or y/g);
  });

  it('#getCellById', () => {
    const cell = matrix.getCellById(2);
    expect(cell.id).to.equal(2);
    expect(cell.x).to.equal(2);
    expect(cell.y).to.equal(0);
    expect(matrix.getCellById(4).id).to.equal(4);
  });

  it('#toJSON', () => {
    const jsonMatrix = matrix.toJSON();
    expect(jsonMatrix.type).to.equal('biome');
    expect(jsonMatrix.matrix[0][0].id).to.equal(0);
  });
});
