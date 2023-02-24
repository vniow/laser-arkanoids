import { DAC } from './laser-dac/core/src';
import { Simulator } from './laser-dac/simulator/src';
import { Scene } from './laser-dac/draw/src';
import { Block } from './Block';
import { Ball } from './Ball';
import { Bounds } from './Bounds';
import { Paddle } from './Paddle';
import { Level } from './Levels';

// about the laser-dac library:
// you can access the simulator at http://localhost:8080
// it draws within a square canvas
// all values are in percentages
// so any x and y values could be 0, 0.5, 0.000314, 1, etc.
// each object is a collection of points with an x, y, r, g, b value

// you can fit 7 blocks across with the default parameters
// the numbers represent the colours of the blocks
// 0 draws a blank block

const level = new Level({
  grid: [
    [4, 0, 2, 1, 0, 1],
    [1, 2],
    [3, 1, 0, 2, 3],
  ],
});

start();

async function start() {
  const simulator = new Simulator();
  const dac = new DAC();
  const scene = new Scene({ resolution: 200 });
  dac.use(simulator);

  await dac.start();

  simulator.events.on('KEYDOWN', (key: string) => {
    if (key === 'ArrowLeft') {
      level.paddle.move(level.bounds, 'left');
      console.log('left');
    }
    // movePaddle('left');
    if (key === 'ArrowRight') {
      console.log('right');
      level.paddle.move(level.bounds, 'right');
    }
    // movePaddle('right');
    if (key === 'Space') {
      console.log(`[${Date.now()}]` + 'space pressed');
      if (level.gameOver()) {
        level.reset();
      }
    }
  });

  simulator.events.on('KEYRELEASE', (key: string) => {
    if (key === 'ArrowLeft') {
      console.log('left');
    }
    if (key === 'ArrowRight') {
    }
  });

  function renderScene() {
    level.checkCollision();
    level.gameOver();
    for (const object of level.objects) {
      scene.add(object);

      if (object instanceof Ball) {
        object.moveBall();
      }
      if (
        object instanceof Ball &&
        level.ball.y > level.bounds.y + level.bounds.height
      ) {
        // const blocksToRemove = level.objects.filter(
        //   (obj) => obj instanceof Block
        // );
        // for (const block of blocksToRemove) {
        //   level.objects.splice(level.objects.indexOf(block), 1);
        // }
        level.objects.splice(level.objects.indexOf(level.ball), 1);
        level.objects.splice(level.objects.indexOf(level.paddle), 1);
        level.objects.splice(level.objects.indexOf(level.bounds), 1);
      }
    }
  }

  scene.start(renderScene);

  dac.stream(scene);
}
