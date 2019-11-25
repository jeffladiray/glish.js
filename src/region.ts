import { Layer } from './layer';
import { Cell } from './cell';

class Region<T extends Cell> {
  id: number;
  content: Array<T> = [];
  constructor(id: number, content: Array<T>) {
    this.id = id;
    this.content = content;
  }

  isInRegion(t: T) {
    return this.content.find((c: T) => c.id === t.id);
  }
}

export class RegionTagger<T extends Cell> {
  layer: Layer<T>
  isSameRegion: (t: T, v: T) => {};
  static currentRegionId: number = 0;
  static currentRegions = new Array<Region<any>>();
  constructor(layer: Layer<T>, isSameRegion: (t: T, v: T) => {}) {
    this.layer = layer;
    this.isSameRegion = isSameRegion;
  }

  isSafe(layer: Layer<T>, row: number, col: number, visited: Array<Region<T>>): boolean {
    return row >= 0 
      && row < layer.size
      && col >= 0
      && col < layer.size
      && layer.getCellAt(row, col)
      && !(visited.find((r: Region<T>) => r.isInRegion(layer.getCellAt(row, col))));
  }

  DFS(layer: Layer<T>, row: number, col: number, visited: Array<Region<T>>) {
    const rowNbr: Array<number> = [ -1, -1, -1, 0, 0, 1, 1, 1 ]; 
    const colNbr: Array<number> = [ -1, 0, 1, -1, 1, -1, 0, 1 ];
    for (let k = 0; k < 8; k++) {
      if (this.isSafe(this.layer, row + rowNbr[k], col + colNbr[k], visited)
      ) {
        if(this.isSameRegion(this.layer.getCellAt(row + rowNbr[k], col + colNbr[k]), this.layer.getCellAt(row, col))) {
          const r = RegionTagger.currentRegions.find((r: Region<T>) => r.isInRegion(this.layer.getCellAt(row + rowNbr[k], col + colNbr[k])));
          if(r && r.id) {
            r.content.push(this.layer.getCellAt(row + rowNbr[k], col + colNbr[k]));
          }
        } else {
          RegionTagger.currentRegionId++;
        }
        //this.DFS(this.layer, row + rowNbr[k], col + colNbr[k], RegionTagger.currentRegions); 
        visited = RegionTagger.currentRegions;
      }
    }

    return RegionTagger.currentRegions;
  }

  findRegions(layer: Layer<T>) {
    let visited = new Array<Region<T>>();
    const res = Array<T>();
    for (let i = 0; i < layer.size; i++) {
      for (let j = 0; j < layer.size; j++) { 
        if (layer.getCellAt(i, j) && !(visited.find((r: Region<T>) => r.isInRegion(layer.getCellAt(i, j))))) {
          RegionTagger.currentRegions.push(new Region(RegionTagger.currentRegionId,[ layer.getCellAt(i, j) ]));
          visited = this.DFS(layer, i, j, visited);
        }
      }
    }
    console.warn(RegionTagger.currentRegions);
  }
};