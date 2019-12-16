import { Layer } from './layer';
import { Cell } from './cell';

export class Region<T extends Cell> {
    static R_COUNTER = 0;
    id: number;
    content: Array<T> = new Array<T>();
    edges: Array<T> = new Array<T>();
    borderWith: Array<Region<T>> = new Array<Region<T>>();
    constructor(content: Array<T>) {
        this.content = content;
        this.id = Region.R_COUNTER++;
    }

    addBorderRegions(r: Region<T>): void {
        if (!this.borderWith.find((b: Region<T>) => b.borderWith !== r.borderWith)) {
            this.borderWith.push(r);
        }
    }

    findCommonEdges(r: Region<T>): Array<T> {
        return r.edges.reduce((acc: Array<T>, e1: T) => {
            this.edges.forEach((e2: T) => {
                if (Math.abs(e1.x - e2.x) <= 1 && Math.abs(e1.y - e2.y) <= 1) {
                    acc.push(e1);
                }
            });
            return acc;
        }, new Array<T>());
    }

    addEdge(c: T): void {
        if (!this.edges.find((b: T) => b.id === c.id)) {
            this.edges.push(c);
        }
    }

    addContent(c: T): void {
        this.content.push(c);
    }

    isInRegion(t: T): T | undefined {
        return this.content.find((c: T) => c.id === t.id);
    }

    isInEdges(t: T): boolean {
        return !!this.edges.find((c: T) => c.id === t.id);
    }

    first(): T {
        return this.content[0];
    }
}

export class RegionTagger<T extends Cell> {
    layer: Layer<T>;
    isSameRegion: (d: { position: string; cell: T }, v: T) => {};
    constructor(layer: Layer<T>, isSameRegion: (d: { position: string; cell: T }, v: T) => {}) {
        this.layer = layer;
        this.isSameRegion = isSameRegion;
    }

    iterativeBFS(layer: Layer<T>): Layer<Cell> {
        const visited = new Layer<Cell>('visited', layer.sizeW, layer.sizeH);
        let currentRegionId = 0;
        visited.initWith((id: number, x: number, y: number) => new Cell(id, { x, y }, { id: 0 }));
        while (visited.getCellsBySpec((c: Cell) => c.content.id === 0).length > 0) {
            const queue = [layer.getCellById(visited.getCellsBySpec((c: Cell) => c.content.id === 0)[0].id)];
            const currentRegion = [];
            currentRegionId++;
            while (queue.length > 0) {
                const cell = queue.shift();
                if (cell) {
                    const visitedCell = visited.getCellById(cell.id);
                    if (visitedCell.content.id === 0) {
                        visited.getCellById(cell.id).setContent({ ...visitedCell.content, id: currentRegionId });
                        currentRegion.push(cell);
                    }

                    const nghs = layer.getCellNeighbours(cell);
                    const nghsNotVisited = nghs.filter(
                        (cellA: { position: string; cell: T }) => visited.getCellById(cellA.cell.id).content.id === 0,
                    );
                    nghs.forEach((ngh: { position: string; cell: T }) => {
                        if (nghsNotVisited.includes(ngh)) {
                            if (this.isSameRegion(ngh, cell)) {
                                visited.getCellById(ngh.cell.id).setContent({ id: currentRegionId });
                                currentRegion.push(visited);
                                queue.unshift(ngh.cell);
                            } else {
                                const nghsEdges = layer
                                    .getCellNeighbours(cell)
                                    .filter((cellA: { position: string; cell: T }) => !this.isSameRegion(cellA, cell));
                                visited.getCellById(cell.id).setContent({ ...visitedCell.content, edges: nghsEdges });
                            }
                        } else {
                            if (this.isSameRegion(ngh, cell)) {
                                const nghsEdges = layer
                                    .getCellNeighbours(cell)
                                    .filter((cellA: { position: string; cell: T }) => !this.isSameRegion(cellA, cell));
                                visited.getCellById(cell.id).setContent({ id: currentRegionId, edges: nghsEdges });
                            } else {
                                const nghsEdges = layer
                                    .getCellNeighbours(cell)
                                    .filter((cellA: { position: string; cell: T }) => !this.isSameRegion(cellA, cell));
                                visited.getCellById(cell.id).setContent({ ...visitedCell.content, edges: nghsEdges });
                            }
                        }
                    });
                }
            }
        }

        return visited;
    }

    recursiveDFS(layer: Layer<T>): Layer<Cell> {
        const visited = new Layer<Cell>('visited', layer.sizeW, layer.sizeH);
        let currentRegionId = 0;
        visited.initWith((id: number, x: number, y: number) => new Cell(id, { x, y }, { id: 0 }));
        for (const cell of layer) {
            if (!visited.getCellById(cell.id).content.id) {
                currentRegionId++;
                this.explore(layer, visited, cell, currentRegionId);
            }
        }
        return visited;
    }

    explore(layer: Layer<T>, visited: Layer<Cell>, cell: T, currentRegionId: number): void {
        const visitedCell = visited.getCellById(cell.id);
        if (visitedCell.content.id === 0) {
            visited.getCellById(cell.id).setContent({ id: currentRegionId });
            const nghs = layer.getCellNeighbours(cell);
            nghs.forEach((ngh: { position: string; cell: T }) => {
                if (visited.getCellById(ngh.cell.id).content.id === 0 && this.isSameRegion(ngh, cell)) {
                    this.explore(layer, visited, ngh.cell, currentRegionId);
                }
            });
        }
    }
}
