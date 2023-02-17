import { Line, Shape, Color } from './laser-dac/draw/src';

// this more or less recreates the Rect class from @laser-dac/draw
// minus the bottom line

interface BoundsOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;
}

export class Bounds extends Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;

  constructor(options: BoundsOptions) {
    super();
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.color = options.color;
  }

  // static bounds: Bounds | null = null;

  // static createBounds(options: BoundsOptions): Bounds {
  //   if (!this.bounds) {
  //     this.bounds = new Bounds(options);
  //   }
  //   return this.bounds;
  // }

  draw(resolution: number) {
    return [
      ...new Line({
        from: { x: this.x, y: this.y + this.height },
        to: { x: this.x, y: this.y },
        color: this.color,
        blankBefore: true,
        blankAfter: true,
      }).draw(resolution),
      // top
      ...new Line({
        from: { x: this.x, y: this.y },
        to: { x: this.x + this.width, y: this.y },
        color: this.color,
        blankAfter: true,
        blankBefore: true,
      }).draw(resolution),
      // right
      ...new Line({
        from: { x: this.x + this.width, y: this.y },
        to: { x: this.x + this.width, y: this.y + this.height },
        color: this.color,
        blankAfter: true,
        blankBefore: true,
      }).draw(resolution),
    ];
  }
}
