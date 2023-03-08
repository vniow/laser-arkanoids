import { Point } from './Point';
import { Shape } from './Shape';
import { Color } from './Point';

// Frames per second; 30fps will be enough for most use-cases.
const DEFAULT_FPS = 30;
const DEFAULT_RESOLUTION = 500;

interface SceneOptions {
  // This number sets the requested number of points from a perpendicular line drawn from one side of the projection to the other.
  // Decreasing this number will make drawing faster but less accurate, increasing will make it slower but more accurate.
  resolution?: number;
}

type TransformFn = (points: Point[]) => Point[];

export class Scene {
  points: Point[] = [];
  resolution: number;
  interval?: NodeJS.Timer;
  color?: Color;

  constructor(options?: SceneOptions) {
    this.resolution = (options && options.resolution) || DEFAULT_RESOLUTION;
  }

  cachedPoints: { [key: string]: Point } = {};

  add(shape: Shape, transformer?: TransformFn) {
    let newPoints = shape.draw(this.resolution);
    if (transformer) {
      newPoints = transformer(newPoints);
    }

    const newCachedPoints: { [key: string]: Point } = {};

    newPoints.forEach((point) => {
      const key = JSON.stringify([point.x, point.y, point.r, point.g, point.b]);
      const cachedPoint = this.cachedPoints[key];
      if (cachedPoint) {
        // The point has been previously drawn, copy the cached point to avoid unnecessary object creation
        this.points.push(Object.assign(new Point(0, 0), cachedPoint));
      } else {
        // The point is new, add it to the points array and cache it
        this.points.push(point);
        newCachedPoints[key] = point;
      }
    });

    // Update the cached points
    this.cachedPoints = newCachedPoints;
  }

  reset() {
    this.points = [];
    this.cachedPoints = {};
  }

  start(requestAnimationFrame: () => void, fps: number = DEFAULT_FPS) {
    const ms = 1000 / fps;
    this.interval = setInterval(() => {
      this.reset();
      requestAnimationFrame();
    }, ms);
  }

  stop() {
    this.pause();
    this.reset();
  }

  pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }
}
