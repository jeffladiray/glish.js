import { Cell } from './cell';

export class Layer<T extends Cell> {
  private _matrix: Array<Array<T>>;
  type: string;
  size: number;

  constructor(type: string, size: number) {
    this._matrix = new Array(new Array<T>());
    this.size = size;
    this.type = type;
  }

  initWith(CellConstructor: new (...params: any) => T) {
    let matrix = new Array(this.size).fill(new Array(this.size).fill(new CellConstructor(0, { x: 0, y: 0 })));
    this._matrix = matrix.map((c: Array<T>, i: number) => c.map((d: T, j: number) => new CellConstructor( j + this.size * i, { x: j, y: i })))
  }

  getCellAt(x: number, y: number): T {
    if (x >= this.size || y >= this.size) {
      throw new Error('Invalid x or y parameter');
    }
    return this._matrix[y][x];
  }

  getMatrix(): Array<Array<T>> {
    return this._matrix
  }

  getCellById(id: number): T {
    return this.getCellAt(id % this.size, Math.floor(id / this.size));
  }

  getCellNeighbours(b: T): Array<{ position: string, cell: T}> {
    let neighbourgs = new Array();
    if (b.x + 1 < this.size) {
      const E = this.getCellAt(b.x + 1, b.y);
      neighbourgs.push({ position: 'E', cell: E, });
    }
    if (b.x - 1 > 0) {
      const W = this.getCellAt(b.x - 1, b.y);
      neighbourgs.push({ position: 'W', cell: W });
    }
    if (b.y + 1 < this.size) {
      const S = this.getCellAt(b.x, b.y + 1);
      neighbourgs.push({ position: 'S', cell: S });
    }
    if (b.y - 1 > 0) {
      const N = this.getCellAt(b.x, b.y - 1);
      neighbourgs.push({ position: 'N', cell: N });
    }    
    return neighbourgs;
  }


  toJSON() {
    return {
      matrix: this._matrix,
      size: this.size,
      type: this.type
    }
  }
}

