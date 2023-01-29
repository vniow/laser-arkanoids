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

  function renderIntro() {
    const introText = new HersheyFont({
      x: 0.1,
      y: 0.5,
      font,
      charWidth: 0.02,
      text: 'press space',
      color: [1, 1, 1],
    });
    scene.add(introText);

    simulator.events.on('KEYDOWN', (key: string) => {
      if (key === 'Space') {
        spaceDown = true;
        console.log('space');
        scene.stop();
        renderGame();
        scene.start(renderGame);
        fs.rm('scores.json', (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
    let spaceDown = false;
  }
  scene.start(renderIntro);

  // draw the bounds
  const bounds = new Bounds({
    x: 0.1,
    y: 0.1,
    width: 0.8,
    height: 0.7,
    color: [Math.random(), 0, 1],
  });

  // draw the blocks
  // set the colour of the blocks based on the value
  function getColorForValue(value: number): Color {
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
  }
  // make the grid, each number is associated with a different colour & value
  const grid = [
    [5, 4, 3, 2, 1],
    [5, 4, 3, 2, 1],
    [5, 4, 3, 2, 1],
    [5, 4, 3, 2, 1],
  ];
  const gap = 0.02;
  const blockWidth = 0.1;
  const blockHeight = 0.05;
  const radius = blockHeight / 2;

  const blocks = Block.createBlocks(grid, gap, blockWidth, blockHeight, bounds);

  // initialise the ball at random positions
  const ball = new Ball({
    radius: radius,
    // keep it within the bounds
    x:
      Math.random() * (bounds.x + (bounds.width - radius) / 2 - bounds.x) +
      bounds.x +
      radius,
    y: bounds.y + (blockHeight + gap) * grid.length + gap * 3,
    color: [1, 1, 1],
  });

  const paddle = new Paddle({
    x:
      Math.random() * (bounds.x + (bounds.width - radius) / 2 - bounds.x) +
      bounds.x +
      radius,
    y: bounds.y + bounds.height - gap * 2,
    width: 0.2,
    height: radius,
    color: [1, 1, 1],
  });

  let leftArrowDown = false;
  let rightArrowDown = false;

  simulator.events.on('KEYDOWN', (key: string) => {
    if (key === 'ArrowLeft') {
      leftArrowDown = true;
      animateLeft();
    }
    if (key === 'ArrowRight') {
      rightArrowDown = true;
      animateRight();
    }
  });

  simulator.events.on('KEYRELEASE', (key: string) => {
    if (key === 'ArrowLeft') {
      leftArrowDown = false;
    }
    if (key === 'ArrowRight') {
      rightArrowDown = false;
    }
  });

  function animateLeft() {
    if (leftArrowDown) {
      const newX = paddle.x - 0.01;
      if (
        newX >= bounds.x + gap &&
        newX + paddle.width <= bounds.x + bounds.width
      ) {
        gsap.to(paddle, {
          x: paddle.x - 0.01,
          duration: 0.02,
          onComplete: animateLeft,
        });
      }
    }
  }

  function animateRight() {
    if (rightArrowDown) {
      const newX = paddle.x + 0.01;
      if (
        newX >= bounds.x &&
        newX + gap + paddle.width <= bounds.x + bounds.width
      ) {
        gsap.to(paddle, {
          x: paddle.x + 0.01,
          duration: 0.02,
          onComplete: animateRight,
        });
      }
    }
  }
  // set up the scoring
  let score: number = 0;
  let index: number = 0;
  const scoreDisplay = new HersheyFont({
    x: 0.1,
    y: 0.9,
    font,
    charWidth: 0.02,
    text: 'score: ' + score,
    color: [1, 1, 1],
  });

  // actually add the objects and render the scene
  function renderGame() {
    scene.add(scoreDisplay);
    scene.add(paddle);
    scene.add(bounds);
    scene.add(ball);
    ball.updatePosition();
    // ball.boundsCollision(bounds);
    ball.checkCollision(paddle, bounds, blocks);
    // add the blocks to the scene

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      scene.add(block);
      if (
        ball.x + ball.radius > block.x &&
        ball.x - ball.radius < block.x + block.width &&
        ball.y + ball.radius > block.y &&
        ball.y - ball.radius < block.y + block.height
      ) {
        if (block.value > 0) {
          block.value--;
          block.color = getColorForValue(block.value);
          if (block.value === 0) {
            score += 10;
            scoreDisplay.text = 'score: ' + score;
            blocks.splice(i, 1);
            i--; // decrement the counter to account for the removed element
          }
        }
      }
      if (ball.y + ball.radius > bounds.y + bounds.height) {
        scene.stop();
        renderGameOver();
        scene.start(renderGameOver);
        index++;
        logScore(score, index);
        return;
      }
    }

    function logScore(score: number, index: number) {
      let scores = [];

      try {
        scores = JSON.parse(fs.readFileSync('scores.json').toString());
      } catch (err) {
        console.error(err);
      }

      scores.push({ index, score });

      try {
        fs.writeFileSync('./scores.json', JSON.stringify(scores, null, 2));
      } catch (err) {
        console.error(err);
      }
    }
  }
  function renderGameOver() {
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
