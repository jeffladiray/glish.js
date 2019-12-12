import { Layer } from './layer';
import { Cell } from './cell';

export class Resource {
  id: number;
  static idCounter = 0;
  position: { x: number; y: number } | number;
  constructor(position: number | { x: number; y: number }) {
    this.id = Resource.idCounter;
    Resource.idCounter++;
    this.position = position;
  }
}

export const R = {
  OCEAN_ROCK_SPAWNABLE: new Resource({ x: 0, y: 0 }),
  BEACH_TREE_SPAWNABLE: new Resource({ x: 1, y: 0 }),
  GRASS_TREE_SPAWNABLE: new Resource({ x: 2, y: 0 }),
  MOUTAIN_ROCK_SPAWNABLE: new Resource({ x: 3, y: 0 }),
  OCEAN_HOLE_SPAWNABLE: new Resource({ x: 4, y: 0 }),
  BEACH_CACTUS_SPAWNABLE: new Resource({ x: 5, y: 0 }),
  GRASS_BERRY_BUSHES_SPAWNABLE: new Resource({ x: 6, y: 0 }),
  MOUNTAIN_ALT_BACKGROUND_SPAWNABLE: new Resource({ x: 7, y: 0 }),
  CITY_SPAWNABLE: new Resource({ x: 8, y: 0 }),
  ROAD_SPAWNABLE: new Resource({ x: 9, y: 0 }),
};

export class Spawnable {
  type: string;
  resource: Resource;
  canSpawn: (l: Layer<Cell>, c: Cell) => {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(type: string, canSpawn: (l: Layer<Cell>, c: any) => {}, resource: Resource) {
    this.type = type;
    this.canSpawn = canSpawn;
    this.resource = resource;
  }
}

export class Biome {
  type: string;
  is: (elevation: number) => {};
  file: string;
  resource: Resource;
  constructor(type: string, is: (elevation: number) => {}, resource: Resource, file = 'assets/s2.png') {
    this.type = type;
    this.is = is;
    this.resource = resource;
    this.file = file;
  }

  serialize(): { type: string } {
    return {
      type: this.type,
    };
  }
}

export const SPAWN_ARRAY: Array<Spawnable> = [
  new Spawnable(
    'OCEAN_ROCK_SPAWNABLE',
    (l: Layer<Cell>, c) => {
      return c.raw.elevation < 0.1 && Math.random() > 0.99 && c.biome.type === 'OCEAN_BIOME';
    },
    R.OCEAN_ROCK_SPAWNABLE,
  ),
  new Spawnable(
    'BEACH_TREE_SPAWNABLE',
    (l: Layer<Cell>, c) => {
      return Math.random() > 0.5 && c.raw.humidity > 0.75 && c.biome.type === 'BEACH_BIOME';
    },
    R.BEACH_TREE_SPAWNABLE,
  ),
  new Spawnable(
    'GRASS_TREE_SPAWNABLE',
    (l: Layer<Cell>, c) => {
      return Math.random() > 0.5 && c.raw.humidity > 0.75 && c.biome.type === 'GRASS_BIOME';
    },
    R.GRASS_TREE_SPAWNABLE,
  ),
  new Spawnable(
    'MOUTAIN_ROCK_SPAWNABLE',
    (l: Layer<Cell>, c) => {
      return Math.random() > 0.9 && c.biome.type === 'MOUNTAIN_BIOME';
    },
    R.MOUTAIN_ROCK_SPAWNABLE,
  ),
  new Spawnable(
    'OCEAN_HOLE_SPAWNABLE',
    (l: Layer<Cell>, c) => {
      return c.raw.elevation < 0.1 && Math.random() > 0.991 && c.biome.type === 'OCEAN_BIOME';
    },
    R.OCEAN_HOLE_SPAWNABLE,
  ),
  new Spawnable(
    'BEACH_CACTUS_SPAWNABLE',
    (l: Layer<Cell>, c) => {
      return Math.random() > 0.995 && c.biome.type === 'BEACH_BIOME';
    },
    R.BEACH_CACTUS_SPAWNABLE,
  ),
  new Spawnable(
    'GRASS_BERRY_BUSHES_SPAWNABLE',
    (l: Layer<Cell>, c) => {
      return Math.random() > 0.99 && c.raw.humidity > 0.5 && c.biome.type === 'GRASS_BIOME';
    },
    R.GRASS_BERRY_BUSHES_SPAWNABLE,
  ),
  new Spawnable(
    'MOUNTAIN_ALT_BACKGROUND_SPAWNABLE',
    (l: Layer<Cell>, c) => {
      return Math.random() > 0.99 && c.biome.type === 'MOUNTAIN_BIOME';
    },
    R.MOUNTAIN_ALT_BACKGROUND_SPAWNABLE,
  ),
  new Spawnable(
    'CITY_SPAWNABLE',
    (l: Layer<Cell>, c) => {
      return c.biome.type !== 'OCEAN_BIOME' && Math.random() < 1 / (l.sizeH * 3);
    },
    R.CITY_SPAWNABLE,
  ),
  new Spawnable(
    'ROAD_SPAWNABLE',
    () => {
      return false;
    },
    R.ROAD_SPAWNABLE,
  ),
];

export const BIOME_ARRAY: Array<Biome> = [
  new Biome(
    'OCEAN_BIOME',

    (elevation: number) => elevation >= 0 && elevation <= 0.4,
    new Resource(0),
  ),
  new Biome('BEACH_BIOME', (elevation: number) => elevation >= 0.4 && elevation <= 0.75, new Resource(1)),
  new Biome('GRASS_BIOME', (elevation: number) => elevation >= 0.75 && elevation <= 0.99, new Resource(2)),
  new Biome('MOUNTAIN_BIOME', (elevation: number) => elevation >= 0.99, new Resource(3)),
];
