import { Bounds } from './Bounds';
import { Arc, Color, Shape, Line } from './laser-dac/draw/src';
import { gsap } from 'gsap';

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
  speed: number;

  constructor(options: PaddleOptions) {
    super();
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.color = options.color;
    this.speed = 0.05;
  }

  move(bounds: Bounds, direction: 'left' | 'right') {
    let newX;

    if (direction === 'left') {
      newX = Math.max(this.x - this.speed, bounds.x);
    } else if (direction === 'right') {
      newX = Math.min(
        this.x + this.speed,
        bounds.x + bounds.width - this.width
      );
    }
    gsap.to(this, { x: newX, ease: 'power2.out' });
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
    ];
  }
}
