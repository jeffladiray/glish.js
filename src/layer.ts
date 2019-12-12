import { Cell } from './cell';

export class Layer<T extends Cell> {
  private _matrix: Array<Array<T>>;
  type: string;
  sizeW: number;
  sizeH: number;
  constructor(type: string, sizeW: number, sizeH: number) {
    this._matrix = new Array(new Array<T>());
    this.sizeH = sizeH;
    this.sizeW = sizeW;
    this.type = type;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  *[Symbol.iterator]() {
    for (let i = 0; i < this._matrix.length; i++) {
      for (let j = 0; j < this._matrix[i].length; j++) {
        const c: T = this.getCellAt(i, j);
        yield c;
      }
    }
  }

  initWith(cellFab: (id: number, x: number, y: number) => T): void {
    if (this.sizeH >= 0 && this.sizeW >= 0) {
      const matrix = new Array(this.sizeH).fill(new Array(this.sizeW).fill(0));
      this._matrix = matrix.map((c: Array<T>, i: number) => {
        return c.map((d: T, j: number) => {
          return cellFab(j + this.sizeW * i, j, i);
        });
      });
    } else {
      throw new Error('Invalid size');
    }
  }

  pushRow(row: Array<T>): number {
    return this._matrix.push(row);
  }

  addToRowById(id: number, t: T): void {
    const row = this.getCellsBySpec((c: T) => c.id === id);
    if (row && row.length > 0) {
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
    return this.getCellAt(Math.floor(Math.random() * this.sizeW), Math.floor(Math.random() * this.sizeH));
  }

  getCellAt(x: number, y: number): T {
    if (x >= this.sizeW || y >= this.sizeH) {
      throw new Error('Invalid x or y parameter');
    }
    return this._matrix[y][x];
  }

  getMatrix(): Array<Array<T>> {
    return this._matrix;
  }

  getCellById(id: number): T {
    return this.getCellAt(id % this.sizeW, Math.floor(id / this.sizeW) % this.sizeH);
  }

  updateLayer(subLayer: Layer<T>, startingId: number): void {
    const initialCell = this.getCellById(startingId);
    for (const c of subLayer) {
      this.getCellAt(c.x + initialCell.x, c.y + initialCell.y);
    }
  }

  getCellNeighbours(b: T): Array<{ position: string; cell: T }> {
    const neighbourgs = [];
    if (b.x - 1 > 0 && b.y - 1 > 0) {
      const NW = this.getCellAt(b.x - 1, b.y - 1);
      neighbourgs.push({ position: 'NW', cell: NW });
    }
    if (b.x + 1 < this.sizeW && b.y - 1 > 0) {
      const NE = this.getCellAt(b.x + 1, b.y - 1);
      neighbourgs.push({ position: 'NE', cell: NE });
    }
    if (b.x + 1 < this.sizeW && b.y + 1 < this.sizeH) {
      const SE = this.getCellAt(b.x + 1, b.y + 1);
      neighbourgs.push({ position: 'SE', cell: SE });
    }
    if (b.x - 1 > 0 && b.y + 1 < this.sizeH) {
      const SW = this.getCellAt(b.x - 1, b.y + 1);
      neighbourgs.push({ position: 'SW', cell: SW });
    }
    if (b.x + 1 < this.sizeW) {
      const E = this.getCellAt(b.x + 1, b.y);
      neighbourgs.push({ position: 'E', cell: E });
    }
    if (b.x - 1 >= 0) {
      const W = this.getCellAt(b.x - 1, b.y);
      neighbourgs.push({ position: 'W', cell: W });
    }
    if (b.y + 1 < this.sizeH) {
      const S = this.getCellAt(b.x, b.y + 1);
      neighbourgs.push({ position: 'S', cell: S });
    }
    if (b.y - 1 >= 0) {
      const N = this.getCellAt(b.x, b.y - 1);
      neighbourgs.push({ position: 'N', cell: N });
    }
    return neighbourgs;
  }

  toJSON(): { matrix: Array<Array<T>>; sizeH: number; sizeW: number; type: string } {
    return {
      matrix: this._matrix,
      sizeH: this.sizeW,
      sizeW: this.sizeW,
      type: this.type,
    };
  }
}
