import { Map } from './map';
import { Renderer } from './renderer';

const a = +Date.now();
const m = new Map({ size: 256, cellH: 32, cellW: 32, seed: 'test' });
const b = +Date.now();
const r = new Renderer(m);
(async () => {
  await r.renderBiomeLayerAsConsole();
  await r.renderBiomeLayerAsImg('output.png');
  console.log(`Rendered in ${b - a} ms`);
})();
