import { Line } from '@laser-dac/draw';
import { Shape } from '@laser-dac/draw/dist/Shape';
import { Color } from '@laser-dac/draw/dist/Point';

// this more or less recreates the Rect class from @laser-dac/draw

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
