import { DAC } from '@laser-dac/core';
import { Simulator } from './simulator/src';
import { Scene, loadHersheyFont, HersheyFont } from './laser-dac';
import * as path from 'path';
import fs from 'fs';
import { Level } from './Levels';

const font = loadHersheyFont(path.resolve(__dirname, './futural.jhf'));

// bring in that simulator
(async () => {
  const dac = new DAC();
  const simulator = new Simulator();
  dac.use(simulator);

  // start the DAC
  await dac.start();
  // initialise the scene
  const scene = new Scene({
    resolution: 250,
  });

  scene.start(renderLevel);

  const levels = [
    new Level({
      grid: [[1]],
      boundsColour: [Math.random(), Math.random(), Math.random()],
    }),
    new Level({
      grid: [[1, 1, 1]],
      boundsColour: [Math.random(), Math.random(), Math.random()],
    }),
    new Level({
      grid: [[1, 1, 1, 1, 1]],
      boundsColour: [Math.random(), Math.random(), Math.random()],
    }),
  ];

  levels[0].selected = true;

  simulator.events.on('KEYDOWN', (key: string) => {
    for (const i in levels) {
      if (levels[i].selected) {
        if (key === 'ArrowLeft') {
          levels[i].moveLeft();
        }
        if (key === 'ArrowRight') {
          levels[i].moveRight();
        }
        // if (key === 'ArrowUp' && Number(i) > 0) {
        //   levels[i].selected = false;
        //   levels[Number(i) - 1].selected = true;
        // }
        // if (key === 'ArrowDown' && Number(i) < levels.length - 1) {
        //   levels[i].selected = false;
        //   levels[Number(i) + 1].selected = true;
        // }
      }
    }
  });

  simulator.events.on('KEYRELEASE', (key: string) => {
    for (const i in levels) {
      if (levels[i].selected) {
        if (key === 'ArrowLeft') {
          levels[i].stop();
        }
        if (key === 'ArrowRight') {
          levels[i].stop();
        }
      }
    }
  });

  // add all the Level objects to the scene
  function renderLevel() {
    for (const level of levels) {
      if (level.selected) {
        scene.add(level.bounds);
        scene.add(level.ball);
        scene.add(level.paddle);
        level.updateCollisions();
        level.updateBall();
        level.bounds.color = level.boundsColour;
        level.blocks.forEach((block) => {
          scene.add(block);
        });
        if (level.gameOver()) {
          scene.stop();
          gameOver();
          scene.start(gameOver);
          break;
        }
        if (level.levelCompleted()) {
          nextLevel();

          break;
        }
        break;
      }
    }
  }

  function nextLevel() {
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].selected === true && i < levels.length - 1) {
        levels[i].selected = false;
        levels[i + 1].selected = true;
        break;
      }
    }
  }

  function gameOver() {
    const gameOverText = new HersheyFont({
      x: 0.1,
      y: 0.5,
      font,
      charWidth: 0.02,
      text: 'game over ',
      color: [1, 1, 1],
    });
    scene.add(gameOverText);
  }
  // start streaming the scene to the DAC
  dac.stream(scene);
})();
