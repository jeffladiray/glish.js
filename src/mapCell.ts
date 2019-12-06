import { BIOME_ARRAY, SPAWN_ARRAY, Biome, Spawnable, Resource } from './constants';
import { Cell } from './cell';

import S from 'simplex-noise';
import { Layer } from './layer';

class Item  {
  type: string;
  resource: Resource;
  constructor(type: string, resource: Resource) {
    this.resource = resource;
    this.type = type;
  }
}

export class MapCell extends Cell {
  spawnables: Array<Spawnable>;
  private static _noiseGenerator: any = new S('Seedless...orNot');
  private static _noiseBaseFrequency: number = 64;
  biome: Biome;
  item: Item | null;
  constructor(id: number, config: { x: number, y: number }) {
    super(id, config);
    const x = config.x;
    const y = config.y;
    if (!this.content.elevation) {
      this.content = { 
        elevation: Math.abs(
          this.computeNoiseWithFrequency(x, y)
            + this.computeNoiseWithFrequency(x, y, 1)
            + this.computeNoiseWithFrequency(x, y, 2)
            + this.computeNoiseWithFrequency(x, y, 3)
            + this.computeNoiseWithFrequency(x, y, 4),
        ),
        humidity: Math.abs(
          this.computeNoiseWithFrequency(x, y)

        ),
      };
    } 
    this.biome = this.computeBiome(this.content.elevation);
    this.spawnables = [];
    this.item = null;
  }

  static setMapCellParameters(freq: number, seed: string) {
    MapCell._noiseBaseFrequency = freq;
    MapCell._noiseGenerator = new S(seed);
  }

  computeNoiseWithFrequency(x: number, y: number, octave = 0): number {
    return (1 / 2 ** octave) * MapCell._noiseGenerator.noise2D(
      // eslint-disable-next-line no-mixed-operators
      2 ** octave * x / MapCell._noiseBaseFrequency, 2 ** octave * y / MapCell._noiseBaseFrequency,
    );
  }

  computeBiome(elevation: number): Biome {
    const f = BIOME_ARRAY.find((b: Biome) => {
      return b.is(this.content.elevation);
    });    
    if (!f) {
      throw new Error('Error, biome has invalid elevation');
    }
    else return f;
  }

  computeSpawnables(l: Layer<MapCell>) {
    this.spawnables = SPAWN_ARRAY.filter((s) => s.canSpawn(l, this));
    const selectedSpawnable = this.spawnables[Math.floor(Math.random() * this.spawnables.length)];
    if(!this.item && selectedSpawnable) {
      this.item = new Item(selectedSpawnable.type, selectedSpawnable.resource);
    }
    return this.spawnables;
  }

  setItem(type: string, resource: Resource) {
    this.item = new Item(type, resource);
  }
}