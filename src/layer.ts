import { Matrix } from './matrix';
import { Cell } from './cell';
export class Layer<T extends Cell> {
  cellMatrix: Matrix<T>;
  type: string;
  constructor(type = 'default', size: number) {
    this.cellMatrix = new Matrix(size);
    this.type = type;
  }
  init(CellConstructor: new () => T) {
    this.cellMatrix.initWith(CellConstructor);
  }
}

