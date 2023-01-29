import { Circle } from '@laser-dac/draw';
import { Bounds } from './Bounds';
import { Block } from './Block';
import { Paddle } from './Paddle';

// this extends the Circle class from @laser-dac/draw

export class Ball extends Circle {
  // set the ball velocity
  vx: number = 0.006;
  vy: number = 0.006;

  // moves the ball
  updatePosition() {
    this.x += this.vx;
    this.y += this.vy;
  }
  // check if the ball hits the bounds
  checkCollision(paddle: Paddle, bounds: Bounds, blocks: Block[]) {
    // reverse the x direction if the ball hits the left or right bounds
    if (
      this.x - this.radius <= bounds.x ||
      this.x + this.radius >= bounds.x + bounds.width
    ) {
      this.vx *= -1;
    }
    // reverse the y direction if the ball hits the top bounds
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

    // reverse the y direction if the ball hits any of the blocks

    for (const block of blocks) {
      if (
        this.x + this.radius > block.x &&
        this.x - this.radius < block.x + block.width &&
        this.y + this.radius > block.y &&
        this.y - this.radius < block.y + block.height
      ) {
        if (
          this.x + this.radius >= block.x + block.width ||
          this.x - this.radius <= block.x
        ) {
          this.vx *= -1;
        }
        if (
          this.y + this.radius >= block.y + block.height ||
          this.y - this.radius <= block.y
        ) {
          this.vy *= -1;
        }
      }
    }
  }
}
