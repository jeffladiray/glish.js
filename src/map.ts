import S from 'simplex-noise';

import { MapBuilder } from './mapBuilder';
import MapSpec from './mapSpec';
import { BIOME_ARRAY, SPAWN_ARRAY, Biome, Spawnable } from './constants';

export class Map {
    chunkSize: number;
    baseFrequency: number;
    cellSize: number;
    seed: string;
    map: MapBuilder;
    spawnables: Array<Spawnable> = SPAWN_ARRAY;
    biomes: Array<Biome> = BIOME_ARRAY;
    S: S;
    constructor(p: MapSpec) {
        this.baseFrequency = p.baseFrequency;
        this.cellSize = p.cellSize;
        this.seed = p.seed;
        this.chunkSize = p.chunkSize;
        const Si = new S(this.seed);
        this.S = Si;
        this.map = new MapBuilder({
            sizeW: p.sizeW,
            sizeH: p.sizeH,
            baseFrequency: this.baseFrequency,
            cellSize: this.cellSize,
            computeNoiseWithFrequency: (x: number, y: number, octave = 0): number => {
                return (
                    (1 / 2 ** octave) *
                    Si.noise2D((x * 2 ** octave) / this.baseFrequency, (y * 2 ** octave) / this.baseFrequency)
                );
            },
        });
    }
}
