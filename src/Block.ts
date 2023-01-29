import { Rect } from '@laser-dac/draw';
import { BasicColors } from './constants';
import { Bounds } from './Bounds';

export class Block extends Rect {
  value: number = 0;
  static createBlocks(
    grid: number[][],
    gap: number,
    blockWidth: number,
    blockHeight: number,
    bounds: Bounds
  ): Block[] {
    const getColorForValue = (value: number) => {
      switch (value) {
        case 5:
          return BasicColors.RED;
        case 4:
          return BasicColors.CYAN;
        case 3:
          return BasicColors.GREEN;
        case 2:
          return BasicColors.YELLOW;
        case 1:
          return BasicColors.MAGENTA;
        case 0:
          return BasicColors.BLACK;
        default:
          return BasicColors.BLACK;
      }
    };

    const blockX = bounds.width / 2 - (grid[0].length * (blockWidth + gap)) / 2;
    const blocks: Block[] = [];

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] !== 0) {
          const block = new Block({
            width: blockWidth,
            height: blockHeight,
            x: j * (blockWidth + gap) + blockX + gap / 2 + bounds.x,
            y: i * (blockHeight + gap) + 0.05 + bounds.y,
            color: getColorForValue(grid[i][j]),
          });
          block.value = grid[i][j];
          blocks.push(block);
        }
      }
    }
    return blocks;
  }
}
