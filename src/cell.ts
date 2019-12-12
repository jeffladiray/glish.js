export class Cell {
  id: number;
  x: number;
  y: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(id: number, config: { x: number; y: number } = { x: 0, y: 0 }, content: any = {}) {
    this.id = id;
    this.x = config.x;
    this.y = config.y;
    this.content = content;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setContent(content: any): void {
    this.content = content;
  }
}
