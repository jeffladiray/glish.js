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

  getXYFromNeighbours(n: string): { x: number, y: number } {
    const cs = this.map.cellSize;
    if(n.length === 1) {
      switch(n) {
        case 'N':
          return { x: cs, y: cs }; 
        case 'S':
            return { x: cs, y: 3 * cs };
        case 'E':
          return { x: 2 * cs , y: 2 * cs };
        case 'W':
          return { x: 0, y: 2 * cs };
      };
    } else if(n.length >= 2) {
      switch(true) {
        case /([NS]{2,3})/g.test(n):
            return { x: 3 * cs, y: cs };
        case /([EW]{2,3})/g.test(n):
            return { x: 3 * cs, y: 2 * cs };
        case /([N,E]{2})/g.test(n):
          return { x: 2 * cs, y: cs }; 
        case /([S,E]{2})/g.test(n):
            return { x: 2 * cs , y: 3 * cs };
        case /([N,W]{2})/g.test(n):
          return { x: 0, y: cs };
        case /([S,W]{2})/g.test(n):
          return { x: 0, y: 3 * cs };
        };
    }
    return { x: 0, y: 0 };
  }

  async renderBiomeLayerAsImg(filename: string) {
    return new Promise(async (done) => {
      const biomesImages = await Promise.all(BIOME_ARRAY.map(async (biome: Biome) => Jimp.read(`${__dirname}/../assets/${biome.resource}`)));
      const o2bTileset = await Jimp.read(`${__dirname}/../assets/tileset_o_2_b.png`);

      const basicBiomes = biomesImages.map((params: Jimp, i: number): any => {
        return {
          type: BIOME_ARRAY[i].type,
          pixelValues: params
        }
      });
      const b2gTileset = await Jimp.read(`${__dirname}/../assets/tileset_b_2_g.png`);
      const g2mTileset = await Jimp.read(`${__dirname}/../assets/tileset_g_2_m.png`);

      const res = this.map.cellSize;

      new Jimp(
        this.map.size * res,
        this.map.size * res,
        (err, image) => {
          if(err) throw err;

          this.map.regions.forEach((r1: Region<BiomeCell>) => {
            r1.content.forEach((bc: BiomeCell) => {
              const texture = basicBiomes.indexOf(basicBiomes.find((d: any) => { return d.type === bc.biome.type }));
              image.blit(basicBiomes[texture].pixelValues, bc.x * res, bc.y * res);
            });
          });

          this.map.borders.forEach((bca: Array<BiomeCell>) => {
            bca.forEach((bc: BiomeCell) => {
              let neighbours = [];
              let ts = g2mTileset;
  
              if(bc.biome.type === 'OCEAN_BIOME') {
                ts = o2bTileset;
                neighbours = this.getNeighbours(bc).filter((n: { position: string, cell: BiomeCell}) => n.cell.biome.type === 'BEACH_BIOME');
              } else if (bc.biome.type === 'BEACH_BIOME') {
                ts = b2gTileset;
                neighbours = this.getNeighbours(bc).filter((n: { position: string, cell: BiomeCell}) => n.cell.biome.type === 'GRASS_BIOME');
              } else if (bc.biome.type === 'GRASS_BIOME') {
                ts = g2mTileset;
                neighbours = this.getNeighbours(bc).filter((n: { position: string, cell: BiomeCell}) => n.cell.biome.type === 'MOUNTAIN_BIOME');
              }
              const tileneighbours = neighbours.reduce((acc: string, bc : { position: string, bc: BiomeCell}) => acc += bc.position, '');
              const tilesetXY = this.getXYFromNeighbours(tileneighbours);
              image.blit(ts, bc.x * res, bc.y * res, tilesetXY.x, tilesetXY.y, res, res)  
            });
          });
          // this.map.getBiomeLayer().getMatrix().map((c: Array<BiomeCell>) => 
          //   c.map((bc: BiomeCell) => {
          //     const texture = basicBiomes.indexOf(basicBiomes.find((d: any) => { return d.type === bc.biome.type }));
          //     const r = this.map.regions.find((r: Region<BiomeCell>) => r.isInEdges(bc));
          //     if(r) {
          //       let neighbours = [];
          //       let ts = g2mTileset;
          //       if( bc.biome.type === 'OCEAN_BIOME') {
          //         ts = o2bTileset;
          //         neighbours = this.getNeighbours(bc).filter((n: { position: string, cell: BiomeCell}) => n.cell.biome.type === 'BEACH_BIOME');
          //       } else if (bc.biome.type === 'BEACH_BIOME') {
          //         ts = b2gTileset;
          //         neighbours = this.getNeighbours(bc).filter((n: { position: string, cell: BiomeCell}) => n.cell.biome.type === 'GRASS_BIOME');
          //       } else if (bc.biome.type === 'GRASS_BIOME') {
          //         ts = g2mTileset;
          //         neighbours = this.getNeighbours(bc).filter((n: { position: string, cell: BiomeCell}) => n.cell.biome.type === 'MOUNTAIN_BIOME');
          //       }
                
          //       const tileneighbours = neighbours.reduce((acc: string, bc : { position: string, bc: BiomeCell}) => acc += bc.position, '');
          //       const tilesetXY = this.getXYFromNeighbours(tileneighbours);
          //       image.blit(ts, bc.x * res, bc.y * res, tilesetXY.x, tilesetXY.y, res, res)  
          //     } else {
          //       image.blit(basicBiomes[texture].pixelValues, bc.x * res, bc.y * res);
          //     }
          //   })
          // );
          image.write(`build/${filename}`, (err) => {
            if (err) throw err;
            done();
          });
        }
      );
    })
  }
}
