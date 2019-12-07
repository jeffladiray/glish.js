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
  borders: Array<Array<Cell>>;
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
    
    this.layers.raw.initWith(Cell);
    this.layers.biome.initWith(Cell);
    this.layers.item.initWith(Cell);
    this.layers.region.initWith(Cell);
    this.map.initWith(Cell);

    console.log('Compute initial raw datas ...');

    // generating raw terrain informations
    const noiseGen = new S(parameters.seed);
    const computeNoiseWithFrequency = (x: number, y: number, octave = 0): number  => {
      return (1 / 2 ** octave) * noiseGen.noise2D(
        // eslint-disable-next-line no-mixed-operators
        2 ** octave * x / this.baseFrequency, 2 ** octave * y / this.baseFrequency,
      );
    }

    for (const cell of this.layers.raw) {
      cell.setContent({ 
        elevation: Math.abs(
          computeNoiseWithFrequency(cell.x, cell.y)
            + computeNoiseWithFrequency(cell.x, cell.y, 1)
            + computeNoiseWithFrequency(cell.x, cell.y, 2)
            + computeNoiseWithFrequency(cell.x, cell.y, 3)
            + computeNoiseWithFrequency(cell.x, cell.y, 4),
        ),
        humidity: Math.abs(
          computeNoiseWithFrequency(cell.x, cell.y)
        ),
      });
    }

    console.log('Compute biome datas ...');
    // generating biome info layer
    const computeBiome = (cell: Cell) => {
      const f = BIOME_ARRAY.find((b: Biome) => {
        return b.is(this.layers.raw.getCellById(cell.id).content.elevation);
      });    
      if (!f) {
        throw new Error('Error, biome has invalid elevation');
      }
      else return f;
    };

    for (const cell of this.layers.biome) {
      cell.setContent(computeBiome(cell));
    }

    console.log('Compute initial spawnable datas ...');
    // generating item info layer
    const computeSpawnables = (l: Layer<Cell>, cellInfo: any) => {
      const ableToSpawn = SPAWN_ARRAY.filter((s: Spawnable) => s.canSpawn(l, cellInfo));
      const selectedSpawnable = ableToSpawn[Math.floor(Math.random() * ableToSpawn.length)];
      if(selectedSpawnable) {
       return { type: selectedSpawnable.type, resource: selectedSpawnable.resource };
      }
      return {};
    }

    this.layers.item.initWith(Cell);
    for (const cell of this.layers.item) {
      cell.setContent(computeSpawnables(this.layers.item, this.getCellDataById(cell.id)));
    }

    console.log('Compute regions ...');
    // Calculating borders and regions
    const regionTagger = new RegionTagger<Cell>(this.layers.biome, (a: Cell, b: Cell) => a.content.type === b.content.type);
    const regions = regionTagger.findRegions(regionTagger.layer);
    for (const cell of this.layers.region) {
      cell.setContent((regions.find((r: Region<Cell>) => r.isInRegion(cell)) || {}).id);
    }

    this.borders = regions.reduce((acc: Array<Array<Cell>>, r1: Region<Cell>) => {
      regions.forEach((r2: Region<Cell>) => {
        const border = r1.findCommonEdges(r2);  
        if(border && border.length > 0 && r1 !== r2) {
          border.map((b: Cell) => {
            const neighbours = this.layers.biome.getCellNeighbours(b);
            b.setContent({
              ...b.content,
              neighbours: neighbours
                .filter((bc : { position: string, cell: Cell }) => bc.cell.content.type !== b.content.type)
                .map((bc : { position: string, cell: Cell }) => {
                  return {
                    position: bc.position,
                    biome: bc.cell.content.type,
                  }
                })
              });
          })
          acc.push(border);
        }
      });
      return acc;
    }, new Array<Array<Cell>>());

    console.log('Finalizing map object');

    // Finally, generate maps from others layers
    for (const cell of this.map) {
      cell.setContent(this.getCellDataById(cell.id));
    }
  }

  getCellDataById(id: number) {
    const res = {
      item: null,
      region: null,
      raw: this.layers.raw.getCellById(id).content,
      biome: this.layers.biome.getCellById(id).content
    };
    
    if(this.layers.item.getCellById(id)) {
      res.item = this.layers.item.getCellById(id).content
    }

    if(this.layers.region.getCellById(id)) {
      res.region = this.layers.region.getCellById(id).content
    }
    return res;
  }
}
