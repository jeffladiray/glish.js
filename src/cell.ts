export class Cell {
  id: number;
  x: number;
  y: number;
  content: any;
  constructor(id: number, config: { x: number, y: number } = { x: 0, y: 0 }) {
    this.id = id;
    this.x = config.x;
    this.y = config.y;
    this.content = {}; 
  }

  setContent(content: any) {
    this.content = content;
  }
}