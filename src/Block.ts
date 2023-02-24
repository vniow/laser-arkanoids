import { Shape, Line } from './laser-dac/draw/src';
import { BasicColors } from './constants';

interface BlockOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  color: [number, number, number];
  value: number;
}

export class Block extends Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  color: [number, number, number];
  value: number;

  constructor(options: BlockOptions) {
    super();
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.color = options.color;
    this.value = options.value;
  }

  updateColor() {
    this.color = Block.getColorForValue(this.value);
  }

  static colorMap = new Map([
    [5, BasicColors.RED],
    [4, BasicColors.CYAN],
    [3, BasicColors.GREEN],
    [2, BasicColors.YELLOW],
    [1, BasicColors.MAGENTA],
    [0, BasicColors.WHITE],
  ]);

  static getColorForValue(value: number) {
    return this.colorMap.get(value) || BasicColors.WHITE;
  }

  draw(resolution: number) {
    return [
      ...new Line({
        from: { x: this.x, y: this.y },
        to: { x: this.x + this.width, y: this.y },
        color: this.color,
        blankAfter: true,
        blankBefore: true,
      }).draw(resolution),
    ];
  }
}
