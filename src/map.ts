import { Layer } from './layer';
import { Cell } from './cell';

import S from 'simplex-noise';

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
}

const OCEAN_BIOME = 'OCEAN_BIOME';
const DIRT_BIOME = 'DIRT_BIOME';
const SAND_BIOME = 'SAND_BIOME';
const FOREST_BIOME = 'FOREST_BIOME';

class BiomeCell extends Cell {
  private _noiseBaseFrequency: number;
  private static _noiseGenerator: any = new S('parameters.seed');
  elevation: number;
  biome: string;
  constructor(id: number, config: { x: number, y: number }) {
    super(id, config);
    this._noiseBaseFrequency = 128;
    const x = config.x;
    const y = config.y
    this.elevation = 
      Math.abs(
        this.computeNoiseWithFrequency(x, y)
          + this.computeNoiseWithFrequency(x, y, 1)
          + this.computeNoiseWithFrequency(x, y, 2)
          + this.computeNoiseWithFrequency(x, y, 3)
          + this.computeNoiseWithFrequency(x, y, 4),
      );
    this.biome = this.computeBiome(this.elevation);
  }

  computeNoiseWithFrequency(x: number, y: number, octave = 0): number {
    return (1 / 2 ** octave) * BiomeCell._noiseGenerator.noise2D(
      // eslint-disable-next-line no-mixed-operators
      2 ** octave * x / this._noiseBaseFrequency, 2 ** octave * y / this._noiseBaseFrequency,
    );
  }

  computeBiome(elevation: number): string {
    if (elevation > 0.75) {
      return OCEAN_BIOME;
    } else if (elevation > 0.5) {
      return SAND_BIOME;
    } else if (elevation > 0.25) {
      return DIRT_BIOME;
    } 
    return FOREST_BIOME;
  }
}