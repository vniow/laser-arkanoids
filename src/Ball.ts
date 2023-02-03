import { Circle } from '@laser-dac/draw';

// this extends the Circle class from @laser-dac/draw

interface BallOptions {
  radius: number;
  x: number;
  y: number;
  color: [number, number, number];
}

export class Ball extends Circle {
  // set the ball velocity
  vx: number = 0.006;
  vy: number = 0.006;

  static ball: Ball | null = null;

  static createBall(options: BallOptions): Ball {
    if (!this.ball) {
      this.ball = new Ball(options);
    }
    return this.ball;
  }

  // moves the ball
  updatePosition() {
    this.x += this.vx;
    this.y += this.vy;
  }
}
