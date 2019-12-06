import { Layer } from './layer';
import { MapCell } from './mapCell'
import { BIOME_ARRAY, SPAWN_ARRAY, Biome, Spawnable } from './constants';
import { RegionTagger, Region } from './region';


class MapCellMatrix extends Array<Array<MapCell>> { };

export class Map {
  size: number;
  baseFrequency: number;
  cellSize: number;
  spawnables: Array<Spawnable> = SPAWN_ARRAY;
  biomes: Array<Biome> = BIOME_ARRAY;
  map: Layer<MapCell>;
  regions: Array<Region<MapCell>>;
  borders: Array<any>; 
  constructor(parameters: { size: number, baseFrequency: number, cellSize: number, seed: string }) {

    // Save parameters
    this.size = parameters.size;
    this.baseFrequency = parameters.baseFrequency;
    this.cellSize = parameters.cellSize;
    
    console.log("Creating a new mapcell layer");
    // Create a new layer to store map cell data
    this.map = new Layer('map', parameters.size);
    // Pass frequency & seed to the perlin noise generator
    MapCell.setMapCellParameters(this.baseFrequency, parameters.seed);
    // Init the map with MapCell
    console.log("Init the mapcell layer");
    this.map.initWith(MapCell);

    console.log("Compute spawnables");
    // Estimate item to spawn
    for (const mc of this.map) {
      mc.computeSpawnables(this.map);
    }

    console.log("Compute regions");
    // Create a Region Tagger & tag regions with matching biome
    const regionTagger = new RegionTagger<MapCell>(this.map, (a: MapCell, b: MapCell) => a.biome.type === b.biome.type);
    this.regions = regionTagger.findRegions(regionTagger.layer);

    console.log("Compute borders");
    // Analyzing regions to get single sided bprders
    this.borders = this.regions.reduce((acc: MapCellMatrix, r1: Region<MapCell>) => {
      this.regions.forEach((r2: Region<MapCell>) => {
        const border = r1.findCommonEdges(r2);  
        if(border && border.length > 0 && r1 !== r2) {
          border.map((b: MapCell) => {
            const neighbours = this.map.getCellNeighbours(b);
            b.setContent(
              // Only send neighbours if biome is different
              neighbours.filter((bc : { position: string, cell: MapCell }) => bc.cell.biome.type !== b.biome.type).map((bc : { position: string, cell: MapCell }) => {
                return {
                  position: bc.position,
                  biome: bc.cell.biome.type,
                }
              })
            );
          })
          acc.push(border);
        }
      });
      return acc;
    }, new MapCellMatrix());
  }
  
  getMap(): Layer<MapCell> {
    return this.map;
  }
}
