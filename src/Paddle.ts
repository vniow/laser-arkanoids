import { Line } from '@laser-dac/draw';
import { Bounds } from './Bounds';
import { Shape } from '@laser-dac/draw/dist/Shape';
import { Color } from '@laser-dac/draw/dist/Point';
import { Arc } from './arc';

interface PaddleOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;
}

export class Paddle extends Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;
  speed: number = 0;

  constructor(options: PaddleOptions) {
    super();
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.color = options.color;
  }

  move(direction: 'left' | 'right' | 'stop') {
    if (direction === 'left') {
      this.speed = -0.01;
    }
    if (direction === 'right') {
      this.speed = 0.01;
    }
    if (direction === 'stop') {
      this.speed = 0;
    }
  }

  update(bounds: Bounds) {
    this.x += this.speed;
    if (this.x + this.width > bounds.x + bounds.width || this.x < bounds.x) {
      this.speed = 0;
    }
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
