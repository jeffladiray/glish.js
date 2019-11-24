import { Map } from './map';
import { Renderer } from './renderer';

const SIZE = 512;
const FREQ = 256;
const CELL_SIZE = 8;
const SEED = `${+Date.now()}`;

const a = +Date.now();
const m = new Map({ size: SIZE, baseFrequency: FREQ, cellSize: CELL_SIZE, seed: SEED });
console.log(`Map created in ${+Date.now() - a}ms`);
const r = new Renderer(m);
(async () => {
  //await r.renderBiomeLayerAsConsole();
  await r.renderBiomeLayerAsImg('output.png');
  console.log(`Rendered in ${+Date.now() - a}ms`);
})();
