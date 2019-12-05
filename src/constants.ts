import { MapCell } from './mapCell';
import { Layer } from './layer';
export class Spawnable {
  type: string;
  canSpawn: (l: Layer<MapCell>, c: MapCell) => {};
  resource: number;
  constructor(type: string, canSpawn: (l: Layer<MapCell>, c: MapCell) => {}, extras: { resource: number }) {
    this.type = type;
    this.canSpawn = canSpawn;
    this.resource = extras.resource;
  }
}

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

export const SPAWN_ARRAY: Array<Spawnable> = [
  new Spawnable('ROCK_OCEAN_SPAWNABLE', (l: Layer<MapCell>, c: MapCell) => { return Math.random() > 0.95 && c.biome.type === 'OCEAN_BIOME' }, { resource: 0 }),
  new Spawnable('BEACH_TREE_SPAWNABLE', (l: Layer<MapCell>, c: MapCell) => { return Math.random() > 0.95 && c.biome.type === 'BEACH_BIOME' }, { resource: 1 }),
  new Spawnable('GRASS_TREE_SPAWNABLE', (l: Layer<MapCell>, c: MapCell) => { return Math.random() > 0.95 && c.biome.type === 'GRASS_BIOME' }, { resource: 2 }),
  new Spawnable('SNOW_SPAWNABLE', (l: Layer<MapCell>, c: MapCell) => { return Math.random() > 0.95 && c.biome.type === 'MOUNTAIN_BIOME' }, { resource: 3 })
];

export const BIOME_ARRAY: Array<Biome> = [
  new Biome(
    'OCEAN_BIOME',
    
    (elevation: number) => elevation >= 0 && elevation <= 0.4,
    { resource: 0 }
  ),
  new Biome(
    'BEACH_BIOME',
    (elevation: number) => elevation >= 0.4 && elevation <= 0.75,
    { resource: 1 }
  ),
  new Biome(
    'GRASS_BIOME',
    (elevation: number) => elevation >= 0.75 && elevation <= 0.99,
    { resource: 2 }
  ),
  new Biome(
    'MOUNTAIN_BIOME',
    (elevation: number) => elevation >= 0.99,
    { resource: 2 }
  ),
];
