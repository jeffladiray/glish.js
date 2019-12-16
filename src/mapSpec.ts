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
    }
}
