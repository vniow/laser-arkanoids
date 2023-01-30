import { Ball } from './Ball';
import { Bounds } from './Bounds';
import { Scene } from './laser-dac';
import { Paddle } from './Paddle';
import { Block } from './Block';
import { BasicColors } from './constants';
import { RESOLUTION } from './laser-dac/constants';

interface LevelOptions {
  grid: number[][];
  boundsColour: [number, number, number];
}

export class Level {
  grid: number[][];
  boundsColour: [number, number, number];
  ball: Ball;
  paddle: Paddle;
  blocks: Block[] = [];
  bounds: Bounds;

  blockHeight: number;
  blockWidth: number;
  gap: number;
  radius: number;

  constructor(options: LevelOptions) {
    this.grid = options.grid;
    this.boundsColour = options.boundsColour;

    this.blockHeight = 0.05;
    this.blockWidth = 0.1;
    this.gap = 0.02;
    this.radius = this.blockHeight / 2;

    this.bounds = Bounds.createBounds({
      x: 0.1,
      y: 0.1,
      width: 0.8,
      height: 0.7,
      color: this.boundsColour,
    });

    this.ball = new Ball({
      radius: this.radius,
      // keep it within the bounds
      x:
        Math.random() *
          (this.bounds.x +
            (this.bounds.width - this.radius) / 2 -
            this.bounds.x) +
        this.bounds.x +
        this.radius,
      y:
        this.bounds.y +
        (this.blockHeight + this.gap) * this.grid.length +
        this.gap * 3,
      color: [1, 1, 1],
    });

    this.paddle = Paddle.createPaddle({
      x: this.bounds.x + this.bounds.width / 2,
      y: this.bounds.y + this.bounds.height - this.radius,
      width: 0.1,
      height: 0.02,
      color: [1, 1, 1],
      speed: 0.01,
    });

    this.blocks = Block.createBlocks(
      this.grid,
      this.gap,
      this.blockWidth,
      this.blockHeight,
      this.bounds
    );
  }

  updateBall = () => {
    this.ball.updatePosition();
    this.ball.checkCollision(this.paddle, this.bounds, this.blocks);
  };
}
