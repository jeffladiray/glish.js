import { Map } from './map';
import { Biome, BiomeCell, BIOME_ARRAY } from './biome';

import Jimp from 'jimp';
import chalk from 'chalk';

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
      neighbourgs.push({ position: 'E', cell: this.map.getBiomeLayer().getCellAt(b.x + 1, b.y) });
    }
    if (b.x - 1 > 0) {
      neighbourgs.push({ position: 'W', cell: this.map.getBiomeLayer().getCellAt(b.x - 1, b.y) });
    }
    if (b.y + 1 < this.map.size) {
      neighbourgs.push({ position: 'S', cell: this.map.getBiomeLayer().getCellAt(b.x, b.y + 1) });
    }
    if (b.y - 1 > 0) {
      neighbourgs.push({ position: 'N', cell:this.map.getBiomeLayer().getCellAt(b.x, b.y - 1) });
    }    
    return neighbourgs;
  }

  getXYFromNeighbours(n: string): { x: number, y: number } {
    const cs = this.map.cellSize;
    switch(n) {
      case 'N':
        return { x: cs, y: cs }; 
      case 'S':
          return { x: cs, y: 3 * cs };
      case 'E':
        return { x: 2 * cs , y: 2 * cs };
      case 'W':
        return { x: 0, y: 2 * cs };
      case 'EN' || 'NE': 
        return { x: 2 * cs, y: cs };
      case 'WN' || 'NW': 
        return { x: 0, y: cs };  
      case 'ES' || 'SE':
        return { x: 2 * cs , y: 3 * cs };  
      case 'WS' || 'SW':
        return { x: 0, y: 3 * cs };
      default:
        return { x: cs, y: 0 }
    }
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
          this.map.getBiomeLayer().getMatrix().map((c: Array<BiomeCell>) => 
            c.map((bc: BiomeCell) => {
              let debugTime = +Date.now();
              const texture = basicBiomes.indexOf(basicBiomes.find((d: any) => { return d.type === bc.biome.type }));
              if (texture < 0) {
                throw new Error('Missing texture !')
              }
              if (bc.biome.type === 'OCEAN_BIOME') {
                const neighbours = this.getNeighbours(bc).filter((n: { position: string, cell: BiomeCell}) => n.cell.biome.type === 'BEACH_BIOME');
                const tileneighbours = neighbours.reduce((acc: string, bc : { position: string, bc: BiomeCell}) => acc += bc.position, '');
                const tilesetXY = this.getXYFromNeighbours(tileneighbours);
                if (tileneighbours !== '')
                  image.blit(o2bTileset, bc.x * res, bc.y * res, tilesetXY.x, tilesetXY.y, res, res)
                else
                  image.blit(basicBiomes[texture].pixelValues, bc.x * res, bc.y * res);
              } else if (bc.biome.type === 'BEACH_BIOME') {
                const neighbours = this.getNeighbours(bc).filter((n: { position: string, cell: BiomeCell}) => n.cell.biome.type === 'GRASS_BIOME');
                const tileneighbours = neighbours.reduce((acc: string, bc : { position: string, bc: BiomeCell}) => acc += bc.position, '');
                const tilesetXY = this.getXYFromNeighbours(tileneighbours);
                if (tileneighbours !== '')
                  image.blit(b2gTileset, bc.x * res, bc.y * res, tilesetXY.x, tilesetXY.y, res, res)
                else
                  image.blit(basicBiomes[texture].pixelValues, bc.x * res, bc.y * res);
              } else if (bc.biome.type === 'GRASS_BIOME') {
                const neighbours = this.getNeighbours(bc).filter((n: { position: string, cell: BiomeCell}) => n.cell.biome.type === 'MOUNTAIN_BIOME');
                const tileneighbours = neighbours.reduce((acc: string, bc : { position: string, bc: BiomeCell}) => acc += bc.position, '');
                const tilesetXY = this.getXYFromNeighbours(tileneighbours);
                if (tileneighbours !== '')
                  image.blit(g2mTileset, bc.x * res, bc.y * res, tilesetXY.x, tilesetXY.y, res, res)
                else
                  image.blit(basicBiomes[texture].pixelValues, bc.x * res, bc.y * res);
              }else {
                image.blit(basicBiomes[texture].pixelValues, bc.x * res, bc.y * res);
              }
            })
          );
  
          image.write(`build/${filename}`, (err) => {
            if (err) throw err;
            done();
          });
        }
      );
    })
  }
}
