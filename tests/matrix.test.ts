import { Matrix } from '../src/matrix';
import { Cell } from '../src/cell';

import { expect } from 'chai';

const matrix = new Matrix(5);
matrix.initWith(Cell);

describe('Matrix', () => {
  it('#constructor', () => {
    expect(matrix.size).to.equal(5);
  });
  it('#getCellAt', () => {
    expect(matrix.getCellAt(0,0).id).to.equal(0);
    const cell = matrix.getCellAt(1,2);
    expect(cell.id).to.equal(7);
    expect(cell.x).to.equal(1);
    expect(cell.y).to.equal(2);
    expect(matrix.getCellAt(4,4).id).to.equal(24);

    expect(() => matrix.getCellAt(5,5)).to.throw(Error, /x or y/g);
  });

  it('#getCellById', () => {
    const cell = matrix.getCellById(7);
    expect(cell.id).to.equal(7);
    expect(cell.x).to.equal(1);
    expect(cell.y).to.equal(2);
    expect(matrix.getCellById(23).id).to.equal(23);
  });
});