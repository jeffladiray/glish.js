import { Layer } from './layer';
import { BiomeCell } from './biome'
import { RegionTagger, Region } from './region';

export class Map {
  size: number;
  baseFrequency: number;
  cellSize: number;
  biomeLayer: Layer<BiomeCell>;
  regions: Array<Region<BiomeCell>>;
  constructor(parameters: { size: number, baseFrequency: number, cellSize: number, seed: string }) {
    this.size = parameters.size;
    this.baseFrequency = parameters.baseFrequency;
    this.cellSize = parameters.cellSize;
    this.biomeLayer = new Layer('biome', parameters.size);
    BiomeCell.setBiomeCellParameters(this.baseFrequency, parameters.seed);
    this.biomeLayer.initWith(BiomeCell);
    const regionTagger = new RegionTagger<BiomeCell>(this.biomeLayer, (a: BiomeCell, b: BiomeCell) => a.biome.type === b.biome.type);
    this.regions = regionTagger.findRegions(regionTagger.layer);  
  }
  
  getBiomeLayer(): Layer<BiomeCell> {
    return this.biomeLayer;
  }
}
