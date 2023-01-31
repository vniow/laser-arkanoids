import { DAC } from '@laser-dac/core';
import { Simulator } from './simulator/src';
import { Scene, loadHersheyFont, HersheyFont, Line } from './laser-dac';
import { Bounds } from './Bounds';
import { Ball } from './Ball';
import { Block } from './Block';
import { Color } from './laser-dac/Point';
import { BasicColors } from './constants';
import { Paddle } from './Paddle';
import { gsap } from 'gsap';
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

  // function renderIntro() {
  //   const introText = new HersheyFont({
  //     x: 0.1,
  //     y: 0.5,
  //     font,
  //     charWidth: 0.02,
  //     text: 'press space',
  //     color: [1, 1, 1],
  //   });
  //   scene.add(introText);

  //   simulator.events.on('KEYDOWN', (key: string) => {
  //     if (key === 'Space') {
  //       scene.stop();
  //       renderGame();
  //       scene.start(renderGame);
  //       // fs.rm('scores.json', (err) => {
  //       //   if (err) {
  //       //     console.log(err);
  //       //   }
  //       // });
  //     }
  //   });
  // }
  scene.start(renderGame);

  const level01 = new Level({
    grid: [
      [5, 4, 3, 2, 1],
      [1, 2, 3, 4, 5],
      [5, 4, 3, 2, 1],
      [1, 2, 3, 4, 5],
    ],
    boundsColour: [0, 0, 1],
  });

  simulator.events.on('KEYDOWN', (key: string) => {
    if (key === 'ArrowLeft') {
      level01.moveLeft();
    }
    if (key === 'ArrowRight') {
      level01.moveRight();
    }
  });

  simulator.events.on('KEYRELEASE', (key: string) => {
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      level01.stop();
    }
  });

  // set up the scoring
  // let score: number = 0;
  // let index: number = 0;
  // const scoreDisplay = new HersheyFont({
  //   x: 0.1,
  //   y: 0.9,
  //   font,
  //   charWidth: 0.02,
  //   text: 'score: ' + score,
  //   color: [1, 1, 1],
  // });

  // actually add the objects and render the scene
  function renderGame() {
    scene.add(level01.bounds);
    scene.add(level01.ball);
    // scene.add(scoreDisplay);
    scene.add(level01.paddle);
    level01.ball.updatePosition();
    level01.ball.checkCollision(level01.paddle, level01.bounds, level01.blocks);

    // add the blocks to the scene

    for (let i = 0; i < level01.blocks.length; i++) {
      const block = level01.blocks[i];
      scene.add(block);
      if (
        level01.ball.x + level01.ball.radius > block.x &&
        level01.ball.x - level01.ball.radius < block.x + block.width &&
        level01.ball.y + level01.ball.radius > block.y &&
        level01.ball.y - level01.ball.radius < block.y + block.height
      ) {
        if (block.value > 0) {
          block.value--;
          if (block.value === 0) {
            // score += 10;
            // scoreDisplay.text = 'score: ' + score;
            level01.blocks.splice(i, 1);
            i--; // decrement the counter to account for the removed element
          }
        }
      }
      // if (ball.y + ball.radius > bounds.y + bounds.height) {
      //   scene.stop();
      //   renderGameOver();
      //   scene.start(renderGameOver);
      //   index++;
      //   // logScore(score, index);
      //   return;
      // }
    }

    // function logScore(score: number, index: number) {
    //   let scores = [];

    //   try {
    //     scores = JSON.parse(fs.readFileSync('scores.json').toString());
    //   } catch (err) {
    //     console.error(err);
    //   }

    //   scores.push({ index, score });

    //   try {
    //     fs.writeFileSync('./scores.json', JSON.stringify(scores, null, 2));
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }
  }
  // function renderGameOver() {
  //   const gameOverText = new HersheyFont({
  //     x: 0.1,
  //     y: 0.5,
  //     font,
  //     charWidth: 0.02,
  //     text: 'game over ',
  //     color: [1, 1, 1],
  //   });
  //   scene.add(gameOverText);
  // }

  // start streaming the scene to the DAC
  dac.stream(scene);
})();
