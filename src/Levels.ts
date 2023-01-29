import { Ball } from './Ball';
import { Bounds } from './Bounds';
import { Scene } from './laser-dac';

export class Level {
  grid: number[][];

  constructor(grid: number[][]) {
    this.grid = grid;

    this.drawBounds();
    this.drawBall();
  }

  drawBounds() {
    // draw the bounds
    const bounds = new Bounds({
      x: 0.1,
      y: 0.1,
      width: 0.8,
      height: 0.7,
      color: [Math.random(), 0, 1],
    });
    return bounds;
  }
  drawBall() {
    const ball = new Ball({
      radius: 0.05,
      x: 0.5,
      y: 0.5,
      color: [1, 1, 1],
    });
    return ball;
  }
  addToScene(scene: Scene) {
    scene.add(this.drawBall());
    scene.add(this.drawBounds());
  }
}
