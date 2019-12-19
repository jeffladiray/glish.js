import { Layer } from './layer';
import { Cell } from './cell';

import { Resource, Vector3, VoxelUtils, TreeGenerator } from './utils';

export const R = {
    OCEAN_ROCK_SPAWNABLE: new Resource(6),
    WOOD_TREE_SPAWNABLE: new Resource(7),
    TREE_LEAVES_SPAWNABLE: new Resource(8),
    MOUTAIN_ROCK_SPAWNABLE: new Resource(9),
    OCEAN_HOLE_SPAWNABLE: new Resource(10),
    BEACH_CACTUS_SPAWNABLE: new Resource(11),
    GRASS_BERRY_BUSHES_SPAWNABLE: new Resource(12),
    MOUNTAIN_ALT_BACKGROUND_SPAWNABLE: new Resource(13),
    PUMPKIN_SPAWNABLE: new Resource(14),
    CONIFEROUS_WOOD_SPAWNABLE: new Resource(15),
    CONIFEROUS_LEAVES_SPAWNABLE: new Resource(16),
};

export interface SpawnableInterface {
    type: string;
    canSpawn: (l: Layer<Cell>, c: Cell) => {};
    resource?: Resource;
}

export class Spawnable implements SpawnableInterface {
    type: string;
    resource: Resource | undefined;
    canSpawn: (l: Layer<Cell>, c: Cell) => {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(type: string, canSpawn: (l: Layer<Cell>, c: any) => {}, resource?: Resource) {
        this.type = type;
        this.canSpawn = canSpawn;
        this.resource = resource;
    }
}

export class VolumetricSpawnable implements SpawnableInterface {
    type: string;
    voxels: Array<{
        v: Vector3;
        type: string;
        resource: Resource;
    }>;
    canSpawn: (l: Layer<Cell>, c: Cell) => {};
    constructor(
        type: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        canSpawn: (l: Layer<Cell>, c: any) => {},
        voxels: Array<{ v: Vector3; type: string; resource: Resource }>,
    ) {
        this.type = type;
        this.canSpawn = canSpawn;
        this.voxels = voxels;
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

export const SPAWN_ARRAY: Array<SpawnableInterface> = [
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
        R.TREE_LEAVES_SPAWNABLE,
    ),
    new Spawnable(
        'GRASS_TREE_SPAWNABLE',
        (l: Layer<Cell>, c) => {
            return Math.random() > 0.5 && c.raw.humidity > 0.75 && c.biome.type === 'GRASS_BIOME';
        },
        R.TREE_LEAVES_SPAWNABLE,
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
        'PUMPKIN_SPAWNABLE',
        (l: Layer<Cell>, c) => {
            return c.biome.type !== 'OCEAN_BIOME' && Math.random() < 1 / (l.sizeH * 3);
        },
        R.PUMPKIN_SPAWNABLE,
    ),
    new VolumetricSpawnable(
        'BEACH_CACTUS_ALT_SPAWNABLE',
        (l: Layer<Cell>, c) => {
            return Math.random() > 0.995 && c.biome.type === 'BEACH_BIOME';
        },
        VoxelUtils.createLine(R.BEACH_CACTUS_SPAWNABLE, new Vector3(0, 0, 1), 2),
    ),
    new VolumetricSpawnable(
        'BEACH_CACTUS_ALT2_SPAWNABLE',
        (l: Layer<Cell>, c) => {
            return Math.random() > 0.995 && c.biome.type === 'BEACH_BIOME';
        },
        VoxelUtils.createLine(R.BEACH_CACTUS_SPAWNABLE, new Vector3(0, 0, 1), 3),
    ),
    new VolumetricSpawnable(
        'GRASS_TREE_ALT_SPAWNABLE',
        (l: Layer<Cell>, c) => {
            return Math.random() > 0.995 && c.biome.type === 'GRASS_BIOME';
        },
        TreeGenerator.makeDeciduousTree(3, 3, R.WOOD_TREE_SPAWNABLE, R.TREE_LEAVES_SPAWNABLE),
    ),
    new VolumetricSpawnable(
        'GRASS_TREE_ALT2_SPAWNABLE',
        (l: Layer<Cell>, c) => {
            return Math.random() > 0.995 && c.biome.type === 'GRASS_BIOME';
        },
        TreeGenerator.makeConiferousTree(3, R.WOOD_TREE_SPAWNABLE, R.TREE_LEAVES_SPAWNABLE),
    ),
];

export const BIOME_ARRAY: Array<Biome> = [
    new Biome(
        'OCEAN_BIOME',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) => c.elevation >= 0 && c.elevation <= 10,
        new Resource(2),
    ),
    new Biome(
        'BEACH_BIOME',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) => c.elevation >= 10 && c.elevation <= 20,
        new Resource(3),
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Biome('GRASS_BIOME', (c: any) => c.elevation >= 20 && c.elevation <= 30, new Resource(4)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Biome('MOUNTAIN_BIOME', (c: any) => c.elevation >= 30, new Resource(5)),
];
