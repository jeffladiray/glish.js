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

  *[Symbol.iterator]() {
    let i = 0;
    let j = 0;
    for (let i = 0; i < this._matrix.length; i++) {
      for (let j = 0; j < this._matrix[i].length; j++) {
        yield this.getCellAt(i, j);
      }
    }
  }

  initWith(CellConstructor: new (...params: any) => T) {
    if(this.size >= 0) {
      let matrix = new Array(this.size).fill(new Array(this.size).fill(new CellConstructor(0, { x: 0, y: 0 })));
      this._matrix = matrix.map((c: Array<T>, i: number) => c.map((d: T, j: number) => new CellConstructor( j + this.size * i, { x: j, y: i })))
    } else {
      throw new Error('Invalid size');
    }
  }

  pushRow(row: Array<T>) {
    return this._matrix.push(row);
  }

  addToRowById(id: number, t: T) {
    const row = this.getCellsBySpec((c: T) => c.id === id);
    if(row && row.length > 0) {
      row.push(t);
    }
  }

  getCellsBySpec(spcFunc: (c: T) => boolean): Array<T> {
    const res = new Array<T>();
    for (const c of this) {
      if (spcFunc(c)) {
        res.push(c);
      }
    }
    return res;
  }

  getRandomCell(): T {
    return this.getCellAt(Math.floor(Math.random() * this.size), Math.floor(Math.random() * this.size));
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

  updateLayer(subLayer: Layer<T>, startingId: number) {
    const initialCell = this.getCellById(startingId);
    for (const c of subLayer) {
      this.getCellAt(c.x + initialCell.x, c.y + initialCell.y);
    }
  }

  getCellNeighbours(b: T): Array<{ position: string, cell: T}> {    
    let neighbourgs = new Array();
    if (b.x - 1 > 0 && b.y - 1 > 0) {
      const NW = this.getCellAt(b.x - 1, b.y - 1);
      neighbourgs.push({ position: 'NW', cell: NW });
    }
    if (b.x + 1 < this.size && b.y - 1 > 0) {
      const NE = this.getCellAt(b.x + 1, b.y - 1);
      neighbourgs.push({ position: 'NE', cell: NE });
    }
    if (b.x + 1 < this.size && b.y + 1 < this.size) {
      const SE = this.getCellAt(b.x + 1, b.y + 1);
      neighbourgs.push({ position: 'SE', cell: SE });
    }
    if (b.x - 1 > 0 && b.y + 1 < this.size) {
      const SW = this.getCellAt(b.x - 1, b.y + 1);
      neighbourgs.push({ position: 'SW', cell: SW });
    }
    if (b.x + 1 < this.size) {
      const E = this.getCellAt(b.x + 1, b.y);
      neighbourgs.push({ position: 'E', cell: E, });
    }
    if (b.x - 1 >= 0) {
      const W = this.getCellAt(b.x - 1, b.y);
      neighbourgs.push({ position: 'W', cell: W });
    }
    if (b.y + 1 < this.size) {
      const S = this.getCellAt(b.x, b.y + 1);
      neighbourgs.push({ position: 'S', cell: S });
    }
    if (b.y - 1 >= 0) {
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

