import { Ball } from './Ball';
import { Bounds } from './Bounds';
import { Block } from './Block';
import { Paddle } from './Paddle';

export class Collisions {
  static checkCollision(
    ball: Ball,
    paddle: Paddle,
    bounds: Bounds,
    blocks: Block[]
  ) {
    // check if the ball hits the bounds
    // if (
    //   ball.x - ball.radius <= bounds.x ||
    //   ball.x + ball.radius >= bounds.x + bounds.width
    // ) {
    //   ball.vx *= -1;
    // }
    // if (ball.y - ball.radius <= bounds.y) {
    //   ball.vy *= -1;
    // }

    // reverse the y direction if the ball hits the paddle
    // if (
    //   ball.x + ball.radius >= paddle.x - 0.05 &&
    //   ball.x - ball.radius <= paddle.x + paddle.width + 0.05 &&
    //   ball.y - ball.radius <= paddle.y + paddle.height &&
    //   ball.y + ball.radius >= paddle.y
    // ) {
    //   ball.vy *= -1;
    // }

    // reverse the x and y directions if the ball hits any of the blocks
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (!block) continue; // skip null or undefined blocks
      if (
        ball.x + ball.radius > block.x &&
        ball.x - ball.radius < block.x + block.width &&
        ball.y + ball.radius > block.y &&
        ball.y - ball.radius < block.y + block.height
      ) {
        if (
          ball.x + ball.radius >= block.x + block.width ||
          ball.x - ball.radius <= block.x
        ) {
          ball.vx *= -1;
        }
        if (
          ball.y + ball.radius >= block.y + block.height ||
          ball.y - ball.radius <= block.y
        ) {
          ball.vy *= -1;
        }

        block.value--;
        block.updateColor();
        console.log(block.value);
        break;
      }
    }
  }
}
