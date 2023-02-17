import { Bounds } from './Bounds';
import { Arc, Color, Shape, Line } from './laser-dac/draw/src';

interface PaddleOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;
  speed: number;
}

export class Paddle extends Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;
  speed: number;

  constructor(options: PaddleOptions) {
    super();
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.color = options.color;
    this.speed = options.speed;
  }

  draw(resolution: number) {
    return [
      // top line
      ...new Line({
        from: { x: this.x, y: this.y },
        to: { x: this.x + this.width, y: this.y },
        color: this.color,
        blankAfter: true,
        blankBefore: true,
      }).draw(resolution),

      //   right arc
      ...new Arc({
        x: this.x + this.width,
        y: this.y + this.height / 2,
        radius: this.height / 2,
        startAngle: -Math.PI / 2,
        endAngle: Math.PI / 2,
        color: this.color,
      }).draw(resolution),

      // bottom line
      ...new Line({
        from: { x: this.x, y: this.y + this.height },
        to: { x: this.x + this.width, y: this.y + this.height },
        color: this.color,
        blankAfter: true,
        blankBefore: true,
      }).draw(resolution),

      // left arc

      ...new Arc({
        x: this.x,
        y: this.y + this.height / 2,
        radius: this.height / 2,
        startAngle: Math.PI / 2,
        endAngle: Math.PI + Math.PI / 2,
        color: this.color,
      }).draw(resolution),
    ];
  }
}
