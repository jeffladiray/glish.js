import { Cell } from './cell';

import S from 'simplex-noise';

export class Biome {
  type: string;
  is: (elevation: number) => {};
  resource: string;
  constructor(type: string, is: (elevation: number) => {}, extras: { resource: string }) {
    this.type = type;
    this.is = is;
    this.resource = extras.resource;
  }

  serialize() {
    return {
      type: this.type,
    };
  }
}

export const BIOME_ARRAY: Array<Biome> = [
  new Biome(
    'OCEAN_BIOME',
    (elevation) => elevation >= 0 && elevation <= 0.4,
    { resource: 'w.png' }
  ),
  new Biome(
    'BEACH_BIOME',
    (elevation) => elevation >= 0.4 && elevation <= 0.6,
    { resource: 'b.png' }
  ),
  new Biome(
    'GRASS_BIOME',
    (elevation) => elevation >= 0.6 && elevation <= 0.8,
    { resource: 'g.png' }
  ),
  new Biome(
    'MOUNTAIN_BIOME',
    (elevation) => elevation >= 0.8,
    { resource: 'm.png' }
  ),
]

export class BiomeCell extends Cell {
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