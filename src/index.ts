import { Simulator } from './laser-dac/simulator/src';
import { Level } from './Levels';

const simulator = new Simulator();
const level = new Level();

(async () => {
  simulator.events.on('KEYDOWN', (key: string) => {
    if (key === 'ArrowLeft') {
    }
    if (key === 'ArrowRight') {
    }
    if (key === 'Space') {
      console.log(`[${Date.now()}]` + 'space pressed');
    }
  });

  simulator.events.on('KEYRELEASE', (key: string) => {
    if (key === 'ArrowLeft') {
    }
    if (key === 'ArrowRight') {
    }
  });
})();
