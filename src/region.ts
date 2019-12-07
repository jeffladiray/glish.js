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

  addBorderRegions(r: Region<T>) {
    if(!this.borderWith.find((b: Region<T>) => b.borderWith !== r.borderWith)) {
      this.borderWith.push(r);
    }
  }

  findCommonEdges(r: Region<T>): Array<T> {
    return r.edges.reduce((acc: Array<T>, e1: T) => {
      this.edges.forEach((e2: T) => {
        if(Math.abs(e1.x - e2.x) <= 1 && Math.abs(e1.y - e2.y) <= 1) {
          acc.push(e1);
        }
      });
      return acc;
    }, new Array<T>());
  }

  addEdge(c: T) {
    if(!this.edges.find((b: T) => b.id === c.id)) {
      this.edges.push(c)
    }
  }

  addContent(c: T) {
    this.content.push(c);
  }
  
  isInRegion(t: T) {
    return this.content.find((c: T) => c.id === t.id);
  }

  isInEdges(t: T) {
    return this.edges.find((c: T) => c.id === t.id);
  }

  first(): T {
    return this.content[0];
  }
}

export class RegionTagger<T extends Cell> {
  layer: Layer<T>
  isSameRegion: (t: T, v: T) => {};
  constructor(layer: Layer<T>, isSameRegion: (t: T, v: T) => {}) {
    this.layer = layer;
    this.isSameRegion = isSameRegion;
  }

  isSafe(layer: Layer<T>, cell: T, visited: Array<Region<T>>): boolean {
      return !!cell;
  }

  isVisited(layer: Layer<T>, cell: T, visited: Array<Region<T>>): boolean {
    return !(this.isSafe && !(visited.find((r: Region<T>) => r.isInRegion(cell))));
  }

  DFS(layer: Layer<T>, visitingCell: T, visited: Array<Region<T>>) {
    const rowNbr: Array<number> = [ 0, 1, 0 ,-1];
    const colNbr: Array<number> = [ 1, 0, -1, 0];
    let currentRegion = visited[visited.length - 1];
    
    if (
      currentRegion
      && !currentRegion.isInRegion(visitingCell)
      && this.isSameRegion(visitingCell, visited[visited.length - 1].first())
    ) {
      currentRegion.addContent(visitingCell);
    } else {
      currentRegion = new Region([ visitingCell ] );
      visited.push(currentRegion);
    }
    const nghs = layer.getCellNeighbours(visitingCell);
    nghs.forEach((ngh: { position: string, cell: T }) => {
      if (this.isSafe(this.layer, ngh.cell, visited)) {
        if (!this.isVisited(this.layer, ngh.cell, visited)) {
          if(!this.isSameRegion(visitingCell, ngh.cell)) {
            currentRegion.addEdge(visitingCell);
          }
        } else {
          if(!this.isSameRegion(visitingCell, ngh.cell)) {
            currentRegion.addEdge(visitingCell);
          }
        }
      }
    });
    return visited;
  }

  findRegions(layer: Layer<T>) {
    let visited = new Array<Region<T>>();
    for (let i = 0; i < layer.size; i++) {
      for (let j = 0; j < layer.size; j++) { 
        if (layer.getCellAt(i, j) && !(visited.find((r: Region<T>) => r.isInRegion(layer.getCellAt(i, j))))) {
          this.DFS(layer, layer.getCellAt(i, j), visited);
        }
      }
    }
    return visited;
  }
};