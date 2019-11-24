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

  async renderBiomeLayerAsImg(filename: string) {
    return new Promise(async (done) => {
      const biomesImages = await Promise.all(BIOME_ARRAY.map(async (biome: Biome) => Jimp.read(`${__dirname}/../assets/${biome.resource}`)));
      const finalArray = biomesImages.map((params: Jimp, i: number): any => {
        return {
          type: BIOME_ARRAY[i].type,
          pixelValues: params
        }
      });
      const res = this.map.cellSize;

      new Jimp(
        this.map.size * res,
        this.map.size * res, 
        (err, image) => {
          if(err) throw err;
          this.map.getBiomeLayer().getMatrix().map((c: Array<BiomeCell>) => 
            c.map((bc: BiomeCell) => {
              const texture = finalArray.indexOf(finalArray.find((d: any) => { return d.type === bc.biome.type }));
              if (texture < 0) {
                throw new Error('Missing texture !')
              }
              for(let i = 0; i < res; i++) {
                for(let j = 0; j < res; j++) {
                  image.setPixelColor(
                    finalArray[texture].pixelValues.getPixelColor(i, j),
                    bc.x * res + i,
                    bc.y * res + j,
                  );
                } 
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
