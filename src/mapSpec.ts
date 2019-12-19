import S from 'simplex-noise';

export default class MapSpec {
    sizeH: number;
    sizeW: number;
    chunkSize: number;
    baseFrequency: number;
    cellSize: number;
    seed: string;
    tileSize: number;
    tileTextureWidth: number;
    tileTextureHeight: number;
    maxHeight: number;
    S: S;
    constructor(
        sizeH: number,
        sizeW: number,
        chunkSize: number,
        baseFrequency: number,
        cellSize: number,
        seed: string,
        tilesize = 16,
        tileTextureWidth = 16,
        tileTextureHeight = 16,
        maxHeight = 100,
    ) {
        this.sizeH = sizeH;
        this.sizeW = sizeW;
        this.chunkSize = chunkSize;
        this.baseFrequency = baseFrequency;
        this.cellSize = cellSize;
        this.seed = seed;
        this.tileSize = tilesize;
        this.tileTextureWidth = tileTextureWidth;
        this.tileTextureHeight = tileTextureHeight;
        this.maxHeight = maxHeight;

        const Si = new S(this.seed);
        this.S = Si;
    }

    computeElevation(x: number, y: number): number {
        return this.computeFlat(x, y);
    }

    computeHumidity(x: number, y: number): number {
        return y <= this.sizeH / 2 ? (2 * y) / this.sizeH : 1 - y / this.sizeH;
    }

    computeTemperature(x: number, y: number): number {
        return this.computeUsingPerlin(2 * x, 2 * y);
    }

    computeFlat(x: number, y: number): number {
        return 29;
    }

    computeUsingPerlin(x: number, y: number): number {
        const z = Math.floor(
            this.maxHeight *
                Math.abs(
                    this.computeNoiseWithFrequency(x, y) +
                        this.computeNoiseWithFrequency(x, y, 1) +
                        this.computeNoiseWithFrequency(x, y, 2) +
                        this.computeNoiseWithFrequency(x, y, 3) +
                        this.computeNoiseWithFrequency(x, y, 4) +
                        this.computeNoiseWithFrequency(x, y, 5) +
                        this.computeNoiseWithFrequency(x, y, 6),
                ),
        );

        if (z >= this.maxHeight) {
            return this.maxHeight;
        }
        return z;
    }

    computeNoiseWithFrequency(x: number, y: number, octave = 0): number {
        const Si = this.S;
        return (
            (1 / 2 ** octave) *
            Si.noise2D((x * 2 ** octave) / this.baseFrequency, (y * 2 ** octave) / this.baseFrequency)
        );
    }
}
