import { Layer } from './layer';
import { BiomeCell } from './biome'
import { RegionTagger, Region } from './region';

export class Map {
  size: number;
  baseFrequency: number;
  cellSize: number;
  biomeLayer: Layer<BiomeCell>;
  regions: Array<Region<BiomeCell>>;
  borders: Array<any>; 
  constructor(parameters: { size: number, baseFrequency: number, cellSize: number, seed: string }) {
    this.size = parameters.size;
    this.baseFrequency = parameters.baseFrequency;
    this.cellSize = parameters.cellSize;
    this.biomeLayer = new Layer('biome', parameters.size);
    BiomeCell.setBiomeCellParameters(this.baseFrequency, parameters.seed);
    this.biomeLayer.initWith(BiomeCell);
    const regionTagger = new RegionTagger<BiomeCell>(this.biomeLayer, (a: BiomeCell, b: BiomeCell) => a.biome.type === b.biome.type);
    this.regions = regionTagger.findRegions(regionTagger.layer);
    this.borders = this.regions.reduce((acc: Array<Array<BiomeCell>>, r1: Region<BiomeCell>) => {
      this.regions.forEach((r2: Region<BiomeCell>) => {
        const border = r1.findCommonEdges(r2);  
        if(border && border.length > 0 && r1 !== r2) {
          acc.push(border);
        }
      });
      return acc;
    }, new Array<Array<BiomeCell>>());
  }
  
  getBiomeLayer(): Layer<BiomeCell> {
    return this.biomeLayer;
  }
}
