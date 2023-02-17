import { Rect } from './laser-dac/draw/src';
import { BasicColors } from './constants';

interface BloockOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  color: [number, number, number];
  value: number;
}

export class Block extends Rect {
  value: number;

  constructor(options: BloockOptions) {
    super(options);
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
}
