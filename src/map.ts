import { Layer } from './layer';
import { BiomeCell } from './biome'

export class Map {
  size: number;
  cellHeight: number;
  cellWidth: number;
  biomeLayer: Layer<BiomeCell>;
  constructor(parameters: { size: number, cellH: number, cellW: number, seed: string }) {
    this.size = parameters.size;
    this.cellHeight = parameters.cellH;
    this.cellWidth = parameters.cellW;
    this.biomeLayer = new Layer('biome', parameters.size);
    this.biomeLayer.initWith(BiomeCell);
  }
  
  getBiomeLayer(): Layer<BiomeCell> {
    return this.biomeLayer;
  }
}
