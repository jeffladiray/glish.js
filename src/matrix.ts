import { Cell } from './cell';

export class Matrix<T extends Cell> {
  private _matrix: Array<Array<T>>;
  size: number;
  constructor(size: number) {
    this._matrix = new Array(new Array<T>());
    this.size = size;
  }
  initWith(CellConstructor: new (...params: any) => T) {
    let matrix = new Array(this.size).fill(new Array(this.size).fill(new CellConstructor(0)));
    this._matrix = matrix.map((c: Array<T>, i: number) => c.map((d: T, j: number) => new CellConstructor( i + this.size * j, { x: j, y: i })))
  }
  getCellAt(x: number, y: number): Cell {
    if (x >= this.size || y >= this.size) {
      throw new Error('Invalid x or y parameter');
    }
    return this._matrix[y][x];
  }

  getCellById(id: number) {
    return this.getCellAt(Math.floor(id / this.size), id % this.size);
  }
}
