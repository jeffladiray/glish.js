import { Layer } from './layer';
import { Cell } from './cell'
import { BIOME_ARRAY, SPAWN_ARRAY, Biome, Spawnable, R } from './constants';
import { RegionTagger } from './region';


export class MapBuilder extends Cell {
  static counter = 0;
  id: number;
  sizeH: number;
  sizeW: number
  baseFrequency: number;
  cellSize: number;
  layers: {
    raw: Layer<Cell>;
    biome: Layer<Cell>;
    item: Layer<Cell>;
    region: Layer<Cell>;
  };
  computeNoiseWithFrequency: (x: number, y: number, octave?: number) => number;
  constructor(parameters: { sizeW: number, sizeH: number, baseFrequency: number, cellSize: number, computeNoiseWithFrequency: (x: number, y: number, octave?: number) => number }) {
    super(MapBuilder.counter, {x: MapBuilder.counter % parameters.sizeW , y: Math.floor(MapBuilder.counter / parameters.sizeH)}),
    this.id = MapBuilder.counter;
    MapBuilder.counter++;
    this.sizeH = parameters.sizeH;
    this.sizeW = parameters.sizeW;
    this.baseFrequency = parameters.baseFrequency;
    this.cellSize = parameters.cellSize;
    
    this.setContent(new Layer<Cell>('map', this.sizeW, this.sizeH));
    this.layers = {
      raw: new Layer<Cell>('raw', this.sizeW, this.sizeW),
      biome: new Layer<Cell>('biome', this.sizeW, this.sizeW),
      item: new Layer<Cell>('items', this.sizeW, this.sizeW),
      region: new Layer<Cell>('regions', this.sizeW, this.sizeW),
    };

    this.computeNoiseWithFrequency = parameters.computeNoiseWithFrequency;

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
          parameters.computeNoiseWithFrequency(x, y)
            + parameters.computeNoiseWithFrequency(x, y, 1)
            + parameters.computeNoiseWithFrequency(x, y, 2)
            + parameters.computeNoiseWithFrequency(x, y, 3)
            + parameters.computeNoiseWithFrequency(x, y, 4),
        ),
        humidity: Math.abs(
          parameters.computeNoiseWithFrequency(x, y)
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
    const regionTagger = new RegionTagger<Cell>(this.layers.biome, (a: { cell: Cell }, b: Cell) => a.cell.content.type === b.content.type);
    this.layers.region = regionTagger.iterativeBFS(this.layers.biome);

    console.log('finalizing map object');
    this.content.initWith((id: number, x: number, y: number) => new Cell(id, { x, y }, {
      item: this.layers.item.getCellById(id).content,
      raw: this.layers.raw.getCellById(id).content,
      biome: this.layers.biome.getCellById(id).content,
      region: this.layers.region.getCellById(id).content
    }));
  }
}
