import { Block } from './Block';
import { Ball } from './Ball';
import { Bounds } from './Bounds';
import { Paddle } from './Paddle';
import { HersheyFont, loadHersheyFont } from './laser-dac/draw/src';
import path from 'path';

const font = loadHersheyFont(path.resolve(__dirname, './futural.jhf'));

// define the bounds

const BOUNDS_WIDTH = 0.3;
const BOUNDS_HEIGHT = 0.25;

// define the blocks
const BLOCK_WIDTH = BOUNDS_WIDTH / 12;
const BLOCK_HEIGHT = BLOCK_WIDTH / 2;
const BLOCK_GAP = BLOCK_WIDTH / 10;

// define the ball
const BALL_RADIUS = BLOCK_HEIGHT / 2;
const BALL_SPEED = 0.005;

// define the grid

interface LevelOptions {
  grid: number[][];
}

export class Level {
  grid: number[][];
  objects: (Ball | Bounds | Paddle | HersheyFont | Block)[] = [];
  bounds: Bounds;
  blocks: Block[] = [];
  ball: Ball;
  paddle: Paddle;
  gameOverText: HersheyFont;

  constructor(options: LevelOptions) {
    this.grid = options.grid;

    // define the bounds

    this.bounds = new Bounds({
      x: (1 - BOUNDS_WIDTH) / 2,
      y: (1 - BOUNDS_HEIGHT) / 2,
      width: BOUNDS_WIDTH,
      height: BOUNDS_HEIGHT,
      color: [Math.random(), Math.random(), Math.random()],
    });
    this.objects.push(this.bounds);

    this.ball = new Ball({
      x: this.bounds.x + this.bounds.width / 2,
      y: this.bounds.y + this.bounds.height / 2,
      radius: BALL_RADIUS,
      color: [1, 1, 1],
      speed: BALL_SPEED,
    });
    this.objects.push(this.ball);

    // draw the paddle
    this.paddle = new Paddle({
      x: this.bounds.x + BLOCK_GAP * 2,
      y: this.bounds.y + this.bounds.height - BLOCK_HEIGHT,
      width: BLOCK_WIDTH * 3,
      height: BLOCK_HEIGHT / 2,
      color: [1, 1, 1],
    });
    this.objects.push(this.paddle);

    this.gameOverText = new HersheyFont({
      font,
      text: 'game over',
      x: this.bounds.x,
      y: this.bounds.y + BOUNDS_HEIGHT / 2,
      color: [1, 1, 1],
      charWidth: 0.01,
    });

    this.checkCollision();
    this.createBlocks();
  }

  private createBlocks() {
    for (let i = 0; i < this.grid.length; i++) {
      const totalLength =
        this.grid[i].length * BLOCK_WIDTH +
        (this.grid[i].length - 1) * BLOCK_GAP;
      const startX = (1 - BOUNDS_WIDTH) / 2 + (BOUNDS_WIDTH - totalLength) / 2;
      const startY = (1 - BOUNDS_HEIGHT) / 2 + BLOCK_GAP * 5;
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] > 0) {
          const x = startX + j * (BLOCK_WIDTH + BLOCK_GAP);
          const y = startY + i * (BLOCK_HEIGHT + BLOCK_GAP);
          const block = new Block({
            width: BLOCK_WIDTH,
            height: BLOCK_HEIGHT,
            x,
            y,
            value: this.grid[i][j],
            color: Block.getColorForValue(this.grid[i][j]),
          });

          this.blocks.push(block);
          this.objects.push(block);
        }
      }
    }
  }

  checkCollision() {
    // check if the ball hits the bounds
    if (
      this.ball.x - this.ball.radius <= this.bounds.x ||
      this.ball.x + this.ball.radius >= this.bounds.x + this.bounds.width
    ) {
      this.ball.vx *= -1;
    }
    if (this.ball.y - this.ball.radius <= this.bounds.y) {
      this.ball.vy *= -1;
    }
    // reverse the y direction if the ball hits the paddle
    if (
      this.ball.x + this.ball.radius >= this.paddle.x - BLOCK_GAP &&
      this.ball.x - this.ball.radius <=
        this.paddle.x + this.paddle.width + BLOCK_GAP &&
      this.ball.y - this.ball.radius <= this.paddle.y + this.paddle.height &&
      this.ball.y + this.ball.radius >= this.paddle.y
    ) {
      this.ball.vy *= -1;
      console.log('hit paddle');
    }

    // detect collision with blocks
    for (let i = 0; i < this.blocks.length; i++) {
      let block = this.blocks[i];
      if (
        this.ball.x + this.ball.radius >= block.x &&
        this.ball.x - this.ball.radius <= block.x + block.width &&
        this.ball.y + this.ball.radius >= block.y &&
        this.ball.y - this.ball.radius <= block.y + block.height
      ) {
        if (
          this.ball.x + this.ball.radius >= block.x + block.width ||
          this.ball.x - this.ball.radius <= block.x
        ) {
          this.ball.vx *= -1;
        }
        if (
          this.ball.y + this.ball.radius >= block.y + block.height ||
          this.ball.y - this.ball.radius <= block.y
        ) {
          this.ball.vy *= -1;
        }

        // update block color when hit
        block.value--;
        block.color = Block.getColorForValue(block.value);
        if (block.value === 0) {
          this.blocks.splice(i, 1); // remove from blocks array
          this.objects.splice(this.objects.indexOf(block), 1); // remove from objects array as well

          i--; // to account for the index change due to splice
        }
      }
    }
  }

  gameOver = () => {
    if (
      this.ball.y + this.ball.radius >= this.bounds.y + this.bounds.height ||
      this.blocks.length === 0
    ) {
      this.objects = [];
      this.blocks = [];
      this.objects.push(this.gameOverText);
      return true;
    } else {
      return false;
    }
  };

  reset() {
    console.log('resetting game');
    // remove game over text
    this.objects.splice(this.objects.indexOf(this.gameOverText), 1);

    // reset bounds
    this.bounds = new Bounds({
      x: (1 - BOUNDS_WIDTH) / 2,
      y: (1 - BOUNDS_HEIGHT) / 2,
      width: BOUNDS_WIDTH,
      height: BOUNDS_HEIGHT,
      color: [Math.random(), Math.random(), Math.random()],
    });
    this.objects.push(this.bounds);

    // reset ball
    this.ball = new Ball({
      x: this.bounds.x + this.bounds.width / 2,
      y: this.bounds.y + this.bounds.height / 2,
      radius: BALL_RADIUS,
      color: [1, 1, 1],
      speed: BALL_SPEED,
    });
    this.objects.push(this.ball);

    // reset paddle
    this.paddle = new Paddle({
      x: this.bounds.x + BLOCK_GAP * 2,
      y: this.bounds.y + this.bounds.height - BLOCK_HEIGHT,
      width: BLOCK_WIDTH * 3,
      height: BLOCK_HEIGHT / 2,
      color: [1, 1, 1],
    });
    this.objects.push(this.paddle);

    // reset blocks
    // this.blocks = [];
    this.createBlocks();

    // reset collisions
    this.checkCollision();
  }
}
