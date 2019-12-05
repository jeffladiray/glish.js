import { Cell } from './cell';

import S from 'simplex-noise';

export class Biome {
  type: string;
  is: (elevation: number) => {};
  resource: number;
  constructor(type: string, is: (elevation: number) => {}, extras: { resource: number }) {
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
    { resource: 0 }
  ),
  new Biome(
    'BEACH_BIOME',
    (elevation) => elevation >= 0.4 && elevation <= 0.75,
    { resource: 1 }
  ),
  new Biome(
    'GRASS_BIOME',
    (elevation) => elevation >= 0.75 && elevation <= 0.99,
    { resource: 2 }
  ),
  new Biome(
    'MOUNTAIN_BIOME',
    (elevation) => elevation >= 0.99,
    { resource: 2 }
  ),
]

export class BiomeCell extends Cell {
  private static _noiseGenerator: any = new S('Seedless...orNot');
  private static _noiseBaseFrequency: number = 64;
  elevation: number;
  biome: Biome;
  constructor(id: number, config: { x: number, y: number }) {
    super(id, config);
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

  static setBiomeCellParameters(freq: number, seed: string) {
    BiomeCell._noiseBaseFrequency = freq;
    BiomeCell._noiseGenerator = new S(seed);
  }

  computeNoiseWithFrequency(x: number, y: number, octave = 0): number {
    return (1 / 2 ** octave) * BiomeCell._noiseGenerator.noise2D(
      // eslint-disable-next-line no-mixed-operators
      2 ** octave * x / BiomeCell._noiseBaseFrequency, 2 ** octave * y / BiomeCell._noiseBaseFrequency,
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