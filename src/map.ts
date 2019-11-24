import { Layer } from './layer';
import { Cell } from './cell';
export class Map {
  size: number;
  cellHeight: number;
  cellWidth: number;
  biomeLayer: Layer<BiomeCell>;
  constructor(parameters: { size: number, cellH: number, cellW: number }) {
    this.size = parameters.size;
    this.cellHeight = parameters.cellH;
    this.cellWidth = parameters.cellW;
    this.biomeLayer = new Layer('biome', 10);
  }
}

class BiomeCell extends Cell {
  constructor(id: number) {
    super(id);
  }
}