import express, { Request, Response } from 'express';

import { Map } from './map';

const SIZE = 60;
const CHUNK_SIZE = 1;
const FREQ = 128;
const CELL_SIZE = 16;
const SEED = 'solo'; // `${+Date.now()}`;
const PORT = '8096';
const a = +Date.now();
const m = new Map({ sizeH: SIZE, sizeW: SIZE * 2, chunkSize: CHUNK_SIZE, baseFrequency: FREQ, cellSize: CELL_SIZE, seed: SEED });
console.log(`Map created in ${+Date.now() - a}ms`);

const app = express();
app.use(express.static(`${__dirname}/assets`));
app.get('/', (req: Request, res: Response) => {
  res.sendFile(`${__dirname}/assets/index.html`);
});
app.get('/map', (req: Request, res: Response) => {
  res.send(m);
});
app.get('/biomes', (req: Request, res: Response) => {
  res.send(m);
});

app.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost:${ PORT }` );
} );