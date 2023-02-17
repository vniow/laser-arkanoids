import { Circle } from './laser-dac/draw/src';
import { Bounds } from './Bounds';
import { Block } from './Block';
import { Paddle } from './Paddle';

interface BallOptions {
  x: number;
  y: number;
  radius: number;
  color: [number, number, number];
}

export class Ball extends Circle {
  // set the ball velocity
  vx: number;
  vy: number;

  constructor(options: BallOptions) {
    super(options);

    // randomly set the ball's initial direction
    if (Math.random() < 0.5) {
      this.vx = 0.01;
      this.vy = 0.01;
    } else {
      this.vx = -0.01;
      this.vy = 0.01;
    }
  }

  // moves the ball
  moveBall() {
    this.x += this.vx;
    this.y += this.vy;
  }
  checkCollision(bounds: Bounds, paddle: Paddle) {
    // check if the ball hits the bounds
    if (
      this.x - this.radius <= bounds.x ||
      this.x + this.radius >= bounds.x + bounds.width
    ) {
      this.vx *= -1;
    }
    if (this.y - this.radius <= bounds.y) {
      this.vy *= -1;
    }
    // reverse the y direction if the ball hits the paddle
    if (
      this.x + this.radius >= paddle.x - 0.05 &&
      this.x - this.radius <= paddle.x + paddle.width + 0.05 &&
      this.y - this.radius <= paddle.y + paddle.height &&
      this.y + this.radius >= paddle.y
    ) {
      this.vy *= -1;
    }
    // reverse the x and y directions if the ball hits any of the blocks
    // for (let i = 0; i < blocks.length; i++) {
    //   const block = blocks[i];
    //   if (!block) continue; // skip null or undefined blocks
    //   if (
    //     this.x + this.radius > block.x &&
    //     this.x - this.radius < block.x + block.width &&
    //     this.y + this.radius > block.y &&
    //     this.y - this.radius < block.y + block.height
    //   ) {
    //     if (
    //       this.x + this.radius >= block.x + block.width ||
    //       this.x - this.radius <= block.x
    //     ) {
    //       this.vx *= -1;
    //     }
    //     if (
    //       this.y + this.radius >= block.y + block.height ||
    //       this.y - this.radius <= block.y
    //     ) {
    //       this.vy *= -1;
    //     }

    //     block.value--;
    //     block.updateColor();

    //     break;
    //   }
    // }
  }
}
