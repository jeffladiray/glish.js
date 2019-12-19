import { MapBuilder } from './mapBuilder';
import MapSpec from './mapSpec';
import { BIOME_ARRAY, SPAWN_ARRAY, Biome, SpawnableInterface } from './constants';

export class Map {
    chunkSize: number;
    baseFrequency: number;
    cellSize: number;
    seed: string;
    map: MapBuilder;
    spawnables: Array<SpawnableInterface> = SPAWN_ARRAY;
    biomes: Array<Biome> = BIOME_ARRAY;
    constructor(p: MapSpec) {
        this.baseFrequency = p.baseFrequency;
        this.cellSize = p.cellSize;
        this.seed = p.seed;
        this.chunkSize = p.chunkSize;
        this.map = new MapBuilder(p);
    }
}
