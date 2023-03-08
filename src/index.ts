import { DAC } from './laser-dac/core/src';
import { Simulator } from './laser-dac/simulator/src';
import { Scene, Circle, Line } from './laser-dac/draw/src';

start();

async function start() {
  const simulator = new Simulator();
  const dac = new DAC();
  const scene = new Scene({ resolution: 500 });
  dac.use(simulator);

  await dac.start();

  const circle = new Circle({
    x: 0.5,
    y: 0.5,
    radius: 0.5,
    color: [1, 1, 1],
  });

  const line = new Line({
    from: { x: 0, y: 0 },
    to: { x: 1, y: 1 },
    color: [0, 1, 0],
  });

  function renderScene() {
    // scene.add(circle);
    scene.add(line);
  }

  scene.start(renderScene);

  dac.stream(scene);
}
