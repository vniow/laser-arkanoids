import { DAC } from './laser-dac/core/src';
import { Simulator } from './laser-dac/simulator/src';
import { Scene } from './laser-dac/draw/src';
import { Block } from './Block';
import { Ball } from './Ball';
import { Bounds } from './Bounds';
import { Paddle } from './Paddle';

// about the laser-dac library:
// you can access the simulator at http://localhost:8080
// it draws within a square canvas
// all values are in percentages
// so any x and y values could be 0, 0.5, 0.000314, 1, etc.
// each object is a collection of points with an x, y, r, g, b value

// define the bounds
const BOUNDS_WIDTH = 0.1;
const BOUNDS_HEIGHT = 0.1;

// define the blocks
const BLOCK_WIDTH = BOUNDS_WIDTH / 10;
const BLOCK_HEIGHT = BLOCK_WIDTH / 2;
const BLOCK_GAP = BLOCK_WIDTH / 10;

// define the ball
const BALL_RADIUS = BLOCK_HEIGHT / 2;

// define the grid
// you can fit 7 blocks across with the default parameters
// the numbers represent the colours of the blocks
// 0 draws a blank block

const grid = [[4, 3, 2, 1, 3, 1, 2]];

export class Level {
  objects: (Ball | Bounds | Paddle | Block)[] = [];
  grid: number[][];
  blocks: Block[] = [];

  constructor() {
    this.grid = grid;
    this.start();
  }

  async start() {
    const dac = new DAC();
    dac.use(new Simulator());
    // if (process.env.DEVICE) {
    //   dac.use(new EtherDream());
    // }
    await dac.start();

    const scene = new Scene({ resolution: 500 });

    const bounds = new Bounds({
      x: (1 - BOUNDS_WIDTH) / 2,
      y: (1 - BOUNDS_HEIGHT) / 2,
      width: BOUNDS_WIDTH,
      height: BOUNDS_HEIGHT,
      color: [Math.random(), Math.random(), Math.random()],
    });
    this.objects.push(bounds);

    const checkCollision = (
      ball: Ball,
      bounds: Bounds,
      paddle: Paddle,
      blocks: Block[]
    ) => {
      // check if the ball hits the bounds
      if (
        ball.x - ball.radius <= bounds.x ||
        ball.x + ball.radius >= bounds.x + bounds.width
      ) {
        ball.vx *= -1;
      }
      if (ball.y - ball.radius <= bounds.y) {
        ball.vy *= -1;
      }
      // reverse the y direction if the ball hits the paddle
      if (
        ball.x + ball.radius >= paddle.x - BLOCK_GAP &&
        ball.x - ball.radius <= paddle.x + paddle.width + BLOCK_GAP &&
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.y + ball.radius >= paddle.y
      ) {
        ball.vy *= -1;
      }

      // detect collision with blocks
      for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        if (
          ball.x + ball.radius >= block.x &&
          ball.x - ball.radius <= block.x + block.width &&
          ball.y + ball.radius >= block.y &&
          ball.y - ball.radius <= block.y + block.height
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
          // update block color

          // remove block if value is zero

          block.value--;
          block.color = Block.getColorForValue(block.value);
          // remove block if value is zero
          if (block.value === 0) {
            blocks.splice(i, 1);
            this.objects.splice(this.objects.indexOf(block), 1); // remove from objects array as well

            i--; // to account for the index change due to splice
          }
        }
      }
    };

    for (let i = 0; i < grid.length; i++) {
      const totalLength =
        grid[i].length * BLOCK_WIDTH + (grid[i].length - 1) * BLOCK_GAP;
      const startX = (1 - BOUNDS_WIDTH) / 2 + (BOUNDS_WIDTH - totalLength) / 2;
      const startY = (1 - BOUNDS_HEIGHT) / 2 + BLOCK_GAP;
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] > 0) {
          const x = startX + j * (BLOCK_WIDTH + BLOCK_GAP);
          const y = startY + i * (BLOCK_HEIGHT + BLOCK_GAP);
          const block = new Block({
            width: BLOCK_WIDTH,
            height: BLOCK_HEIGHT,
            x,
            y,
            value: grid[i][j],
            color: Block.getColorForValue(grid[i][j]),
          });

          this.blocks.push(block);
          this.objects.push(block);
        }
      }
    }

    // the ball will start a BLOCK_GAP distance from the bottom of the grid
    const totalBlocksHeight =
      grid.length * (BLOCK_HEIGHT + BLOCK_GAP) - BLOCK_GAP;
    const startY = (1 - BOUNDS_HEIGHT) / 2 + BLOCK_GAP + totalBlocksHeight;
    // draw the ball
    const ball = new Ball({
      x:
        Math.random() * (bounds.x + (bounds.width - BLOCK_GAP) / 2 - bounds.x) +
        bounds.x +
        BLOCK_GAP,
      y: startY + BALL_RADIUS + BLOCK_GAP,
      radius: BALL_RADIUS,
      color: [1, 1, 1],
    });
    this.objects.push(ball);

    // draw the paddle
    const paddle = new Paddle({
      x: bounds.x + BLOCK_GAP * 2,
      y: bounds.y + BOUNDS_HEIGHT - BLOCK_GAP * 10,
      width: BLOCK_WIDTH * 8,
      height: BLOCK_GAP * 2,
      color: [1, 1, 1],
      speed: 0.01,
    });
    this.objects.push(paddle);

    const self = this;
    function renderLevel(objects: (Ball | Bounds | Paddle | Block)[]) {
      checkCollision(ball, bounds, paddle, self.blocks);
      for (const object of objects) {
        scene.add(object);
        if (object instanceof Ball) {
          object.moveBall();
          // object.checkCollision(bounds, paddle);
        }
      }
    }

    scene.start(() => {
      // scene.reset();
      renderLevel(this.objects);
    });

    dac.stream(scene);
  }
}
