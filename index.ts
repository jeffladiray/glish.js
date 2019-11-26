import express, { Request, Response } from 'express';

import { Map } from './src/map';
import { Renderer } from './src/renderer';
import { resolve } from 'dns';

const SIZE = 64;
const FREQ = 128;
const CELL_SIZE = 16;
const SEED = `${+Date.now()}`;
const PORT = '8096';
const a = +Date.now();
const m = new Map({ size: SIZE, baseFrequency: FREQ, cellSize: CELL_SIZE, seed: SEED });
console.log(`Map created in ${+Date.now() - a}ms`);
const r = new Renderer(m);

(async () => {
  // await r.renderBiomeLayerAsConsole();
  await r.renderBiomeLayerAsImg('output.png');
  console.log(`Rendered in ${+Date.now() - a}ms`);
})();

const app = express();
app.use(express.static(`${__dirname}/assets`));
app.get('/', (req: Request, res: Response) => {
  res.sendFile(`${__dirname}/assets/index.html`);
});
app.get('/map', (req: Request, res: Response) => {
  res.send(m);
});

app.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost:${ PORT }` );
} );