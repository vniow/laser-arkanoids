import { DAC } from '@laser-dac/core';
import { Simulator } from './simulator/src';
import { Scene } from '@laser-dac/draw';
import { Bounds } from './Bounds';
import { Ball } from './Ball';

// set the radius of the ball
const radius = 0.03;
// initialise the width and height of the bounds
let bWidth = Math.max(Math.random(), radius * 2);
let bHeight = Math.max(Math.random(), radius * 2);

// bring in that simulator
(async () => {
  const dac = new DAC();
  const simulator = new Simulator();
  dac.use(simulator);
  // listen for the click event from the simulator
  simulator.events.on('click', (data) => {
    // change the ball color
    ball.color = [Math.random(), Math.random(), Math.random()];
    console.log('ball color changed to: ', ball.color);
  });
  // listen for the spacebar event from the simulator
  simulator.events.on('spacebar', (data) => {
    console.log('starting bounds transformation');
    // set the new bounds parameters
    let newWidth = Math.max(Math.random(), radius * 2.5);
    let newHeight = Math.max(Math.random(), radius * 2.5);
    let newX = 0.5 - newWidth / 2;
    let newY = 0.5 - newHeight / 2;
    // calculate the differences between the current and new bounds
    let widthDiff = newWidth - bounds.width;
    let heightDiff = newHeight - bounds.height;
    let xDiff = newX - bounds.x;
    let yDiff = newY - bounds.y;
    // set the step size and the number of steps
    let step = 0.01;
    let steps = 1 / step;
    let widthStep = widthDiff / steps;
    let heightStep = heightDiff / steps;
    let xStep = xDiff / steps;
    let yStep = yDiff / steps;
    // update the bounds every 10ms until the new parameters are reached
    let interval = setInterval(() => {
      bounds.width += widthStep;
      bounds.height += heightStep;
      bounds.x += xStep;
      bounds.y += yStep;
      steps--;
      if (steps <= 0) {
        clearInterval(interval);
        bounds.color = [Math.random(), Math.random(), Math.random()];
        console.log('bounds color changed to: ', bounds.color);
      }
    }, 10);
  });
  // start the DAC
  await dac.start();
  // initialise the scene
  const scene = new Scene({
    resolution: 500,
  });
  // initialise the bounds at random positions
  const bounds = new Bounds({
    // the bWidth and bHeight variables ensure the bounds are always centered
    x: 0.5 - bWidth / 2,
    y: 0.5 - bHeight / 2,
    width: bWidth,
    height: bHeight,
    color: [1, 1, 1],
  });
  // initialise the ball at random positions
  const ball = new Ball({
    radius: radius,
    // keep it within the bounds
    x:
      Math.random() * (bounds.x + (bounds.width - radius) / 2 - bounds.x) +
      bounds.x +
      radius,
    y:
      Math.random() * (bounds.y + (bounds.height - radius) / 2 - bounds.y) +
      bounds.y +
      radius,
    color: [1, 1, 1],
  });
  // actually add the objects and render the scene
  function renderFrame() {
    scene.add(bounds);
    scene.add(ball);
    ball.updatePosition();
    ball.checkCollision(bounds);
  }
  // have the scene start the renderFrame function
  scene.start(renderFrame);
  // start streaming the scene to the DAC
  dac.stream(scene);
})();
