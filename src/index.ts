import { Map } from './map';
import chalk from 'chalk';

const a = +Date.now();
const m = new Map({ size: 64, cellH: 32, cellW: 32, seed: 'test' });
let str = '';
m.biomeLayer.iterate(
  (d: any) => { 
    const a = d.biome.charAt(0);
    if(a === 'O') return str += `${chalk.blue.bgBlue(a)}`;
    if(a === 'D') return str += `${chalk.green.bgGreen(a)}`;
    if(a === 'S') return str += `${chalk.yellow.bgYellow(a)}`;
    if(a === 'F') return str += `${chalk.white.bgWhite(a)}`;
    return str += `${a}`; 
  }, 
  () => { return str += '\n' }
);
const b = +Date.now();
console.log(str);
console.log(b - a, 'ms');
