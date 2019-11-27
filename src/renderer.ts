import { Map } from './map';
import { Biome, BiomeCell, BIOME_ARRAY } from './biome';

import Jimp from 'jimp';
import chalk from 'chalk';
import { Region } from './region';

export class Renderer {
  map: Map;
  constructor(map: Map) {
    this.map = map;
  }

  renderBiomeLayerAsConsole() {
    let str = '';
    this.map.getBiomeLayer().getMatrix().forEach(
      (c: Array<any>) => {
        c.forEach((d: any) => {
          const a = d.biome.type.charAt(0);
          if(a === 'O') str += `${chalk.blue.bgBlue(a)}`;
          if(a === 'G') str += `${chalk.green.bgGreen(a)}`;
          if(a === 'B') str += `${chalk.yellow.bgYellow(a)}`;
          if(a === 'M') str += `${chalk.white.bgWhite(a)}`;
        });
        str += '\n'
      }
    );
  }

  getNeighbours(b: BiomeCell) {
    let neighbourgs = new Array();
    if (b.x + 1 < this.map.size) {
      const E = this.map.getBiomeLayer().getCellAt(b.x + 1, b.y);
      neighbourgs.push({ position: 'E', cell: E, });
    }
    if (b.x - 1 > 0) {
      const W = this.map.getBiomeLayer().getCellAt(b.x - 1, b.y);
      neighbourgs.push({ position: 'W', cell: W });
    }
    if (b.y + 1 < this.map.size) {
      const S = this.map.getBiomeLayer().getCellAt(b.x, b.y + 1);
      const r = this.map.regions.find((r: Region<BiomeCell>) => r.isInRegion(S));
      neighbourgs.push({ position: 'S', cell: S });
    }
    if (b.y - 1 > 0) {
      const N = this.map.getBiomeLayer().getCellAt(b.x, b.y - 1);
      neighbourgs.push({ position: 'N', cell: N });
    }    
    return neighbourgs;
  }

  getXYFromNeighbours(n: string, biome: number): { x: number, y: number } {
    const base = biome * this.map.cellSize * 5;
    const cs = this.map.cellSize;
    if(n.length === 0) {
      return { x: base + cs, y: 0 };
    }    
    if(n.length === 1) {
      switch(n) {
        case 'N':
          return { x: base + cs, y: cs }; 
        case 'S':
            return { x: base + cs, y: + 3 * cs};
        case 'E':
          return { x: base + 2 * cs , y: + 2 * cs };
        case 'W':
          return { x: base, y: + 2 * cs };
      };
    } else if(n.length >= 2) {
      switch(true) {
        case /([NS]{2,3})/g.test(n):
            return { x: base + 3 * cs, y: cs };
        case /([EW]{2,3})/g.test(n):
            return { x: base + 3 * cs, y: 2 * cs };
        case /([N,E]{2})/g.test(n):
          return { x: base + 2 * cs, y: cs }; 
        case /([S,E]{2})/g.test(n):
            return { x: base + 2 * cs , y: 3 * cs };
        case /([N,W]{2})/g.test(n):
          return { x: base, y: cs };
        case /([S,W]{2})/g.test(n):
          return { x: base, y: 3 * cs };
        };
    }
    return { x: base + 2 * cs, y: 0 };
  }

  async renderBiomeLayerAsImg(filename: string) {
    return new Promise(async (done) => {

      const ts = await Jimp.read(`${__dirname}/../assets/ts.png`);
      const res = this.map.cellSize;

      new Jimp(
        this.map.size * res,
        this.map.size * res,
        (err, image) => {
          if(err) throw err;

          this.map.regions.forEach((r1: Region<BiomeCell>) => {
            r1.content.forEach((bc: BiomeCell) => {
              const tilesetXY = this.getXYFromNeighbours('', bc.biome.resource);
              image.blit(ts, bc.x * res, bc.y * res, tilesetXY.x, tilesetXY.y, res, res);
            });
          });
          // Was used to simulate border ... switching to client side rendering will be easier
          // this.map.borders.forEach((bca: Array<BiomeCell>) => {
          //   bca.forEach((bc: BiomeCell) => {
          //     let neighbours = [];
          //     if(bc.biome.type !== 'MOUNTAIN_BIOME') {
          //       if(bc.biome.type === 'OCEAN_BIOME') {
          //         neighbours = this.getNeighbours(bc).filter((n: { position: string, cell: BiomeCell}) => n.cell.biome.type === 'BEACH_BIOME');
          //       } else if (bc.biome.type === 'BEACH_BIOME') {
          //         neighbours = this.getNeighbours(bc).filter((n: { position: string, cell: BiomeCell}) => n.cell.biome.type === 'GRASS_BIOME');
          //       } else if (bc.biome.type === 'GRASS_BIOME') {
          //         neighbours = this.getNeighbours(bc).filter((n: { position: string, cell: BiomeCell}) => n.cell.biome.type === 'MOUNTAIN_BIOME');
          //       }
          //       const tileneighbours = neighbours.reduce((acc: string, bc : { position: string, bc: BiomeCell}) => acc += bc.position, '');
          //       const tilesetXY = this.getXYFromNeighbours(tileneighbours, bc.biome.resource);
          //       image.blit(ts, bc.x * res, bc.y * res, tilesetXY.x, tilesetXY.y, res, res);
          //     } else {
          //       const tilesetXY = this.getXYFromNeighbours('azqsd', bc.biome.resource);
          //       image.blit(ts, bc.x * res, bc.y * res, tilesetXY.x, tilesetXY.y, res, res);
          //     }
          //   });
          // });
          // this.map.getBiomeLayer().getMatrix().map((c: Array<BiomeCell>) => 
          //   c.map((bc: BiomeCell) => {
          //     const texture = basicBiomes.indexOf(basicBiomes.find((d: any) => { return d.type === bc.biome.type }));
          //     const r = this.map.regions.find((r: Region<BiomeCell>) => r.isInEdges(bc));

                
          //       const tileneighbours = neighbours.reduce((acc: 
          image.write(`build/${filename}`, (err) => {
            if (err) throw err;
            done();
          });
        }
      );
    })
  }
}
