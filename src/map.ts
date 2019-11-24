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

export class Biome {
  type: string;
  color: { r: number, g: number, b: number };
  is: (elevation: number) => {};
  constructor(type: string, color: { r: number, g: number, b: number }, is: (elevation: number) => {}) {
    this.type = type;
    this.color = color;
    this.is = is;
  }

  serialize() {
    return {
      type: this.type,
    };
  }
}

const BIOME_ARRAY: Array<Biome> = [
  new Biome(
    'OCEAN_BIOME',
    { r: 17, g: 36, b: 62 },
    (elevation) => elevation >= 0 && elevation <= 0.4,
  ),
  new Biome(
    'BEACH_BIOME',
    { r: 17, g: 36, b: 62 },
    (elevation) => elevation >= 0.4 && elevation <= 0.6,
  ),
  new Biome(
    'GRASS_BIOME',
    { r: 17, g: 36, b: 62 },
    (elevation) => elevation >= 0.6 && elevation <= 0.8,
  ),
  new Biome(
    'MOUNTAIN_BIOME',
    { r: 17, g: 36, b: 62 },
    (elevation) => elevation >= 0.8,
  ),
]

class BiomeCell extends Cell {
  private _noiseBaseFrequency: number;
  private static _noiseGenerator: any = new S('parameters.seed');
  elevation: number;
  biome: Biome;
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

  computeBiome(elevation: number): Biome {
    const f = BIOME_ARRAY.find((b: Biome) => {
      return b.is(this.elevation);
    });    
    if (!f) {
      throw new Error('Error, biome has invalid elevation');
    }
    else return f;
  }
}