import { Layer } from './layer';
import { BiomeCell } from './biome'

export class Map {
  size: number;
  baseFrequency: number;
  cellSize: number;
  biomeLayer: Layer<BiomeCell>;
  constructor(parameters: { size: number, baseFrequency: number, cellSize: number, seed: string }) {
    this.size = parameters.size;
    this.baseFrequency = parameters.baseFrequency;
    this.cellSize = parameters.cellSize;
    this.biomeLayer = new Layer('biome', parameters.size);
    BiomeCell.setBiomeCellParameters(this.baseFrequency, parameters.seed);
    this.biomeLayer.initWith(BiomeCell);
  }
  
  getBiomeLayer(): Layer<BiomeCell> {
    return this.biomeLayer;
  }
}
