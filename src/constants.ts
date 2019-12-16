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
    OCEAN_ROCK_SPAWNABLE: new Resource(6),
    BEACH_TREE_SPAWNABLE: new Resource(7),
    GRASS_TREE_SPAWNABLE: new Resource(8),
    MOUTAIN_ROCK_SPAWNABLE: new Resource(9),
    OCEAN_HOLE_SPAWNABLE: new Resource(10),
    BEACH_CACTUS_SPAWNABLE: new Resource(11),
    GRASS_BERRY_BUSHES_SPAWNABLE: new Resource(12),
    MOUNTAIN_ALT_BACKGROUND_SPAWNABLE: new Resource(13),
    CITY_SPAWNABLE: new Resource(14),
    ROAD_SPAWNABLE: new Resource(15),
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) => c.elevation >= 0 && c.elevation <= 4,
        new Resource(2),
    ),
    new Biome(
        'BEACH_BIOME',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) => c.elevation >= 4 && c.elevation <= 7,
        new Resource(3),
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Biome('GRASS_BIOME', (c: any) => c.elevation >= 7 && c.elevation <= 9, new Resource(4)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Biome('MOUNTAIN_BIOME', (c: any) => c.elevation >= 9, new Resource(5)),
];
