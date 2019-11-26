import { Layer } from './layer';
import { Cell } from './cell';

export class Region<T extends Cell> {
  content: Array<T> = [];
  edges: Array<T> = [];
  constructor(content: Array<T>) {
    this.content = content;
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

  isSafe(layer: Layer<T>, row: number, col: number, visited: Array<Region<T>>): boolean {
    return row >= 0 
      && row < layer.size
      && col >= 0
      && col < layer.size
      && !!layer.getCellAt(row, col);
  }

  isVisited(layer: Layer<T>, row: number, col: number, visited: Array<Region<T>>): boolean {
    return !(this.isSafe && !(visited.find((r: Region<T>) => r.isInRegion(layer.getCellAt(row, col)))))
  }

  DFS(layer: Layer<T>, row: number, col: number, visited: Array<Region<T>>) {
    const rowNbr: Array<number> = [ -1, -1, -1, 0, 0, 1, 1, 1 ]; 
    const colNbr: Array<number> = [ -1, 0, 1, -1, 1, -1, 0, 1 ];
    const visitingCell = layer.getCellAt(row, col);
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
    
    for (let k = 0; k < 8; k++) {
      if (this.isSafe(this.layer, row + rowNbr[k], col + colNbr[k], visited)) {
        if (!this.isVisited(this.layer, row + rowNbr[k], col + colNbr[k], visited)) {
          if(this.isSameRegion(visitingCell, layer.getCellAt(row + rowNbr[k], col + colNbr[k]))) {
            this.DFS(this.layer, row + rowNbr[k], col + colNbr[k], visited);
          } else {
            currentRegion.addEdge(visitingCell);
          }
        } else {
          if(!this.isSameRegion(visitingCell, layer.getCellAt(row + rowNbr[k], col + colNbr[k]))) {
            currentRegion.addEdge(visitingCell);
          }
        }
      }
    }
    return visited;
  }

  findRegions(layer: Layer<T>) {
    let visited = new Array<Region<T>>();
    for (let i = 0; i < layer.size; i++) {
      for (let j = 0; j < layer.size; j++) { 
        if (layer.getCellAt(i, j) && !(visited.find((r: Region<T>) => r.isInRegion(layer.getCellAt(i, j))))) {
          this.DFS(layer, i, j, visited);
        }
      }
    }
    return visited;
  }
};