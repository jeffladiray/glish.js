import { Layer } from './layer';
import { Cell } from './cell'
import { BIOME_ARRAY, SPAWN_ARRAY, Biome, Spawnable, R } from './constants';
import { RegionTagger, Region } from './region';

import S from 'simplex-noise';

export class Map {
  size: number;
  baseFrequency: number;
  cellSize: number;
  map: Layer<Cell>;
  layers: {
    raw: Layer<Cell>;
    biome: Layer<Cell>;
    item: Layer<Cell>;
    region: Layer<Cell>;
  };
  spawnables: Array<Spawnable> = SPAWN_ARRAY;
  biomes: Array<Biome> = BIOME_ARRAY;
  constructor(parameters: { size: number, baseFrequency: number, cellSize: number, seed: string }) {
    this.size = parameters.size;
    this.baseFrequency = parameters.baseFrequency;
    this.cellSize = parameters.cellSize;
    this.map = new Layer<Cell>('map', this.size);
    this.layers = {
      raw: new Layer<Cell>('raw', this.size),
      biome: new Layer<Cell>('biome', this.size),
      item: new Layer<Cell>('items', this.size),
      region: new Layer<Cell>('regions', this.size),
    };

    const noiseGen = new S(parameters.seed);
    const computeNoiseWithFrequency = (x: number, y: number, octave = 0): number  => {
      return (1 / 2 ** octave) * noiseGen.noise2D(
        2 ** octave * x / this.baseFrequency, 2 ** octave * y / this.baseFrequency,
      );
    }

    const computeBiome = (id: number) => {
      const f = BIOME_ARRAY.find((b: Biome) => {
        return b.is(this.layers.raw.getCellById(id).content.elevation);
      });    
      if (!f) {
        throw new Error('Error, biome has invalid elevation');
      }
      else return f;
    };
    
    // generating item info layer
    const computeSpawnables = (l: Layer<Cell>, cellInfo: any) => {
      const ableToSpawn = SPAWN_ARRAY.filter((s: Spawnable) => s.canSpawn(l, cellInfo));
      const selectedSpawnable = ableToSpawn[Math.floor(Math.random() * ableToSpawn.length)];
      if(selectedSpawnable) {
       return { type: selectedSpawnable.type, resource: selectedSpawnable.resource };
      }
      return {};
    }

    console.log('raws ...');
    this.layers.raw.initWith((id, x, y) => {
      return new Cell(id, { x, y }, { 
        elevation: Math.abs(
          computeNoiseWithFrequency(x, y)
            + computeNoiseWithFrequency(x, y, 1)
            + computeNoiseWithFrequency(x, y, 2)
            + computeNoiseWithFrequency(x, y, 3)
            + computeNoiseWithFrequency(x, y, 4),
        ),
        humidity: Math.abs(
          computeNoiseWithFrequency(x, y)
        ),
      });
    });

    console.log('biomes ...');
    this.layers.biome.initWith((id, x, y) => {
      return new Cell(id, { x, y }, computeBiome(id));
    });

    console.log('items ...');
    this.layers.item.initWith((id, x, y) => {
      const content = { 
        raw: this.layers.raw.getCellById(id).content,
        biome: this.layers.biome.getCellById(id).content,
      }
      return new Cell(id, { x, y }, computeSpawnables(this.layers.item, content));
    });

    console.log('regions ...');
    // Calculating borders and regions
    const regionTagger = new RegionTagger<Cell>(this.layers.biome, (a: Cell, b: Cell) => a.content.type === b.content.type);
    this.layers.region = regionTagger.iterativeBFS(this.layers.biome);

    console.log('finalizing map object');
    this.map.initWith((id, x, y) => new Cell(id, { x, y }, {
      item: this.layers.item.getCellById(id).content,
      raw: this.layers.raw.getCellById(id).content,
      biome: this.layers.biome.getCellById(id).content,
      region: this.layers.region.getCellById(id).content
    }));
  }
}
