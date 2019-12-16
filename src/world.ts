import MapSpec from './mapSpec';
import { Map } from './map';

export default class World {
    cellSize: number;
    tileSize: number;
    tileTextureWidth: number;
    tileTextureHeight: number;
    cellSliceSize: number;
    cell: Uint8Array;
    heightMap: Map;
    static FACES = [
        {
            // left
            uvRow: 0,
            dir: [-1, 0, 0],
            corners: [
                { pos: [0, 1, 0], uv: [0, 1] },
                { pos: [0, 0, 0], uv: [0, 0] },
                { pos: [0, 1, 1], uv: [1, 1] },
                { pos: [0, 0, 1], uv: [1, 0] },
            ],
        },
        {
            // right
            uvRow: 0,
            dir: [1, 0, 0],
            corners: [
                { pos: [1, 1, 1], uv: [0, 1] },
                { pos: [1, 0, 1], uv: [0, 0] },
                { pos: [1, 1, 0], uv: [1, 1] },
                { pos: [1, 0, 0], uv: [1, 0] },
            ],
        },
        {
            // bottom
            uvRow: 1,
            dir: [0, -1, 0],
            corners: [
                { pos: [1, 0, 1], uv: [1, 0] },
                { pos: [0, 0, 1], uv: [0, 0] },
                { pos: [1, 0, 0], uv: [1, 1] },
                { pos: [0, 0, 0], uv: [0, 1] },
            ],
        },
        {
            // top
            uvRow: 2,
            dir: [0, 1, 0],
            corners: [
                { pos: [0, 1, 1], uv: [1, 1] },
                { pos: [1, 1, 1], uv: [0, 1] },
                { pos: [0, 1, 0], uv: [1, 0] },
                { pos: [1, 1, 0], uv: [0, 0] },
            ],
        },
        {
            // back
            uvRow: 0,
            dir: [0, 0, -1],
            corners: [
                { pos: [1, 0, 0], uv: [0, 0] },
                { pos: [0, 0, 0], uv: [1, 0] },
                { pos: [1, 1, 0], uv: [0, 1] },
                { pos: [0, 1, 0], uv: [1, 1] },
            ],
        },
        {
            // front
            uvRow: 0,
            dir: [0, 0, 1],
            corners: [
                { pos: [0, 0, 1], uv: [0, 0] },
                { pos: [1, 0, 1], uv: [1, 0] },
                { pos: [0, 1, 1], uv: [0, 1] },
                { pos: [1, 1, 1], uv: [1, 1] },
            ],
        },
    ];
    constructor(mapSpec: MapSpec) {
        this.cellSize = Math.max(mapSpec.sizeW, mapSpec.sizeH);
        this.tileSize = mapSpec.tileSize;
        this.tileTextureWidth = mapSpec.tileTextureWidth;
        this.tileTextureHeight = mapSpec.tileTextureHeight;
        const { cellSize } = this;
        this.cellSliceSize = cellSize * cellSize;
        this.cell = new Uint8Array(cellSize * cellSize * cellSize);
        this.heightMap = new Map(mapSpec);

        for (const cell of this.heightMap.map.content) {
            let z = cell.content.raw.elevation;
            if (z < 4) z = 4;
            for (let i = 0; i < z - 1; i++) {
                this.setVoxel(cell.x, i, cell.y, 1);
            }
            this.setVoxel(cell.x, z - 1, cell.y, cell.content.biome.resource.position);
            this.setVoxel(cell.x, z, cell.y, cell.content.biome.resource.position);
            if (cell.content.item && cell.content.item.type) {
                this.setVoxel(cell.x, z + 1, cell.y, cell.content.item.resource.position);
            }
        }
    }

    euclideanModulo(n: number, m: number): number {
        return ((n % m) + m) % m;
    }

    computeVoxelOffset(x: number, y: number, z: number): number {
        const { cellSize, cellSliceSize } = this;
        const voxelX = this.euclideanModulo(x, cellSize) | 0;
        const voxelY = this.euclideanModulo(y, cellSize) | 0;
        const voxelZ = this.euclideanModulo(z, cellSize) | 0;
        return voxelY * cellSliceSize + voxelZ * cellSize + voxelX;
    }
    getCellForVoxel(x: number, y: number, z: number): Uint8Array | null {
        const { cellSize } = this;
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
        const cellZ = Math.floor(z / cellSize);
        if (cellX !== 0 || cellY !== 0 || cellZ !== 0) {
            return null;
        }
        return this.cell;
    }
    setVoxel(x: number, y: number, z: number, v: number): void {
        const cell = this.getCellForVoxel(x, y, z);
        if (!cell) {
            return; // TODO: add a new cell?
        }
        const voxelOffset = this.computeVoxelOffset(x, y, z);
        cell[voxelOffset] = v;
    }
    getVoxel(x: number, y: number, z: number): number {
        const cell = this.getCellForVoxel(x, y, z);
        if (!cell) {
            return 0;
        }
        const voxelOffset = this.computeVoxelOffset(x, y, z);
        return cell[voxelOffset];
    }

    generateGeometryDataForCell(
        cellX: number,
        cellY: number,
        cellZ: number,
    ): {
        uvs: Array<number>;
        positions: Array<number>;
        normals: Array<number>;
        indices: Array<number>;
    } {
        const { cellSize, tileSize, tileTextureWidth, tileTextureHeight } = this;
        const positions = [];
        const normals = [];
        const uvs = [];
        const indices = [];
        const startX = cellX * cellSize;
        const startY = cellY * cellSize;
        const startZ = cellZ * cellSize;

        for (let y = 0; y < cellSize; ++y) {
            const voxelY = startY + y;
            for (let z = 0; z < cellSize; ++z) {
                const voxelZ = startZ + z;
                for (let x = 0; x < cellSize; ++x) {
                    const voxelX = startX + x;
                    const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
                    if (voxel) {
                        const uvVoxel = voxel - 1;
                        for (const { dir, corners, uvRow } of World.FACES) {
                            const neighbor = this.getVoxel(voxelX + dir[0], voxelY + dir[1], voxelZ + dir[2]);
                            if (!neighbor) {
                                const ndx = positions.length / 3;
                                for (const { pos, uv } of corners) {
                                    positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                                    normals.push(...dir);
                                    uvs.push(
                                        ((uvVoxel + uv[0]) * tileSize) / tileTextureWidth,
                                        1 - ((uvRow + 1 - uv[1]) * tileSize) / tileTextureHeight,
                                    );
                                }
                                indices.push(ndx, ndx + 1, ndx + 2, ndx + 2, ndx + 1, ndx + 3);
                            }
                        }
                    }
                }
            }
        }

        return {
            positions,
            normals,
            uvs,
            indices,
        };
    }
}
