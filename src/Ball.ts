import { Circle } from '@laser-dac/draw';
import { Bounds } from './Bounds';

// this extends the Circle class from @laser-dac/draw

export class Ball extends Circle {
  // set the ball velocity
  vx: number = 0.005;
  vy: number = 0.005;

  // moves the ball
  updatePosition() {
    this.x += this.vx;
    this.y += this.vy;
  }
  // check if the ball hits the bounds
  checkCollision(bounds: Bounds) {
    // reverse the x direction if the ball hits the left or right bounds
    if (
      this.x - this.radius <= bounds.x ||
      this.x + this.radius > bounds.x + bounds.width
    ) {
      this.vx *= -1;
    }
    // reverse the y direction if the ball hits the top bounds
    if (
      this.y - this.radius <= bounds.y ||
      this.y + this.radius > bounds.y + bounds.height
    ) {
      this.vy *= -1;
    }
    // this code keeps the ball within the bounds when the bounds change
    if (this.x + this.radius > bounds.x + bounds.width) {
      this.x = bounds.x + bounds.width - this.radius;
    }
    if (this.x - this.radius < bounds.x) {
      this.x = bounds.x + this.radius;
    }
    if (this.y + this.radius > bounds.y + bounds.height) {
      this.y = bounds.y + bounds.height - this.radius;
    }
    if (this.y - this.radius < bounds.y) {
      this.y = bounds.y + this.radius;
    }
  }
}
