import { Circle } from './laser-dac/draw/src';
import { Bounds } from './Bounds';
import { Block } from './Block';
import { Paddle } from './Paddle';

interface BallOptions {
  x: number;
  y: number;
  radius: number;
  color: [number, number, number];
  speed: number;
}

export class Ball extends Circle {
  // set the ball velocity
  speed: number;
  vx: number;
  vy: number;

  constructor(options: BallOptions) {
    super(options);
    this.speed = options.speed;

    // randomly set the ball's initial direction
    if (Math.random() < 0.5) {
      this.vx = this.speed;
      this.vy = this.speed;
    } else {
      this.vx = -this.speed;
      this.vy = this.speed;
    }
  }

  // moves the ball
  moveBall() {
    this.x += this.vx;
    this.y += this.vy;
  }
}
