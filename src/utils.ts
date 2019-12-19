export class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v: Vector3): Vector3 {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;

        return this;
    }

    copy(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    normalize(): Vector3 {
        const dist = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
        return new Vector3(this.x / dist, this.y / dist, this.z / dist);
    }
}

export class Resource {
    id: number;
    static idCounter = 0;
    position: number;
    constructor(position: number) {
        this.id = Resource.idCounter;
        Resource.idCounter++;
        this.position = position;
    }
}

export class VoxelUtils {
    static createLine(
        resource: Resource,
        orientation: Vector3,
        length: number,
        origin = new Vector3(0, 0, 0),
    ): Array<{ v: Vector3; type: string; resource: Resource }> {
        const l = [];
        for (let i = 0; i < length; i++) {
            const o = orientation.copy().add(origin);
            const x = orientation.x ? o.x + i : o.x;
            const y = orientation.y ? o.y + i : o.y;
            const z = orientation.z ? o.z + i : o.z;

            l.push({ v: new Vector3(x, y, z), type: 'DRAW_LINE', resource });
        }
        return l;
    }

    static createRect(
        resource: Resource,
        H: number,
        W: number,
        origin = new Vector3(0, 0, 0),
    ): Array<{ v: Vector3; type: string; resource: Resource }> {
        const l = new Array<{ v: Vector3; type: string; resource: Resource }>();
        for (let i = 0; i < H; i++) {
            l.push(
                ...VoxelUtils.createLine(resource, new Vector3(1, 0, 0), W, origin.copy().add(new Vector3(0, i, 0))),
            );
        }
        return l;
    }

    static createBox(
        resource: Resource,
        H: number,
        W: number,
        h: number,
        origin = new Vector3(0, 0, 0),
    ): Array<{ v: Vector3; type: string; resource: Resource }> {
        const l = new Array<{ v: Vector3; type: string; resource: Resource }>();
        for (let j = 0; j < h; j++) {
            for (let i = 0; i < H; i++) {
                l.push(
                    ...VoxelUtils.createLine(
                        resource,
                        new Vector3(1, 0, 0),
                        W,
                        origin.copy().add(new Vector3(0, i, j)),
                    ),
                );
            }
        }
        return l;
    }
}

export class TreeGenerator {
    static makeDeciduousTree(
        trunkLength = 3,
        leavesLength = 3,
        trunkResource: Resource,
        leavesResource: Resource,
    ): Array<{ v: Vector3; type: string; resource: Resource }> {
        const trunk = VoxelUtils.createLine(trunkResource, new Vector3(0, 0, 1), trunkLength);
        const leaves = VoxelUtils.createBox(
            leavesResource,
            leavesLength,
            leavesLength,
            leavesLength,
            new Vector3(Math.floor(-leavesLength / 2), Math.ceil(-leavesLength / 2), trunkLength + 1),
        );

        const numberOfLeavesToRemove = Math.floor(Math.random() * leavesLength);
        for (let i = 0; i < numberOfLeavesToRemove; i++) {
            leaves.splice(Math.floor(Math.random() * leaves.length), 1);
        }
        return trunk.concat(leaves);
    }

    static makeConiferousTree(
        trunkLength = 3,
        trunkResource: Resource,
        leavesResource: Resource,
    ): Array<{ v: Vector3; type: string; resource: Resource }> {
        const trunk = VoxelUtils.createLine(trunkResource, new Vector3(0, 0, 1), trunkLength);
        const leaves = new Array<{ v: Vector3; type: string; resource: Resource }>();
        leaves.push(...VoxelUtils.createRect(leavesResource, 5, 5, new Vector3(-3, -2, trunkLength)));
        trunk.push(...VoxelUtils.createLine(trunkResource, new Vector3(0, 0, trunkLength + 1), 1));
        leaves.push(...VoxelUtils.createRect(leavesResource, 3, 3, new Vector3(-2, -1, trunkLength + 2)));
        trunk.push(...VoxelUtils.createLine(trunkResource, new Vector3(0, 0, trunkLength + 3), 1));
        leaves.push(...VoxelUtils.createLine(leavesResource, new Vector3(0, 0, trunkLength + 4), 1));
        return trunk.concat(leaves);
    }
}
