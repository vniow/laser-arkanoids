import { Rect } from '@laser-dac/draw';
import { BasicColors } from './constants';
import { Bounds } from './Bounds';

export class Block extends Rect {
  value: number = 0;
  hit: boolean = false;

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

  static createBlocks(
    grid: number[][],
    gap: number,
    blockWidth: number,
    blockHeight: number,
    bounds: Bounds
  ): Block[] {
    // blockX keeps the array centred no matter how many you have
    const blockX =
      bounds.width / 2 -
      (grid[0].length * (blockWidth + gap)) / 2 +
      bounds.x +
      gap / 2;
    const blocks: Block[] = [];
    let y = 0.05 + bounds.y;
    let x = blockX;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] !== 0) {
          const block = new Block({
            width: blockWidth,
            height: blockHeight,
            x,
            y,
            color: this.getColorForValue(grid[i][j]),
          });
          block.value = grid[i][j];
          blocks.push(block);
        }
        x += blockWidth + gap;
      }
      x = blockX;
      y += blockHeight + gap;
    }
    return blocks;
  }
}
